/*jslint es6*/
/**
 * @author jason a. grafft <jason@grafft.co>
 */
"use strict";
import {adapt} from "@cycle/run/lib/adapt";
import Dexie from "dexie";
import {div, img, h2, hr, makeDOMDriver, option, p, select, span} from "@cycle/dom";
// import isolate from "@cycle/isolate";
import {run} from "@cycle/run";
import xs from "xstream";

/**
 * Global... Dexie instance. Will be refactored
 * @const {Dexie}
 */
const db = new Dexie("vision:monocle");
db.version(2).stores({
    recordFrom: "id"
    // , videojs: "id"
});

/**
 * XStream listener for Dexie instance `db`
 * @const {xs<Listener>}
 */
 const dexieListener = {
    next: (o) => {
        db[o.group].add({id: o.id})
            .then(() => {
                console.log(`${o.id} added to ${o.group}.`);
            })
            .catch("ConstraintError", () => {
                db.recordFrom.where("id").equals(o.id).delete();
                console.log(`${o.id} removed from ${o.group}.`);
            })
            .catch((e) => {
                console.error(e)
            });
    },
    error: (err) => console.error(err),
    complete: () => console.log("dexieListener complete"),
};

/**
 * Bidirectional Cycle.js driver for WebSocket connections
 * @param {string} adr IP address of WebSocket
 * @returns {xs<Stream>}
 */
const wsDriver = (adr) => {
    const ws = new WebSocket(adr);
    /**
     * Producer for `wsDriver`
     * @param {xs<Stream>} out_ XStream to listen on
     * @returns {xs<Stream>}
     */
    const driver = (out_) => {
        out_.addListener({
            next: (out) => {
                ws.send(JSON.stringify(out));
            },
            error: (err) => console.error(err),
            complete: () => console.log("wsDriver out_ complete.")
        });

        /**
         * Listener for `wsDriver`
         */
        const in_ = xs.create({
            start: (listener) => {
                ws.onopen = () => {
                    ws.send(JSON.stringify({key: "devices", req: "find", val: {group: "devices"}}));
                };
                ws.onmessage = (msg) => {
                    const j = JSON.parse(msg.data);
                    console.log(j);
                    listener.next(j);
                };
            },
            stop: () => {
                ws.close();
            }
        });
        return adapt(in_);
    };
    return driver;
};

/**
 * Encapsulates DOM events and display logic for rendering by Cycle.js
 * @param {Object} sources Object containing key-value pairs used by components
 * @returns {Object.<{DOM: DOMSource}>}
 */
const main = (sources) => {
    /**
     * Filters stream for "devices" key
     * @const {xs<Stream>}
     */
    const devices_ = sources.ws
        .filter((x) => x.key === "devices")
        .map((x) => x.res)
        .startWith({devices: [{id: null, dataType: null}]});

    /**
     * Filters stream for "status" key
     * @const {xs<Stream>}
     */
    const status_ = sources.ws
        .filter((x) => x.key === "status")
        // .map((x) => x.res)
        .startWith({req: "status", status: "initializing..."});

    /**
     * Collects click events for `.device` elements
     * @const {xs<Stream>}
     */
    const deviceClicks_ = sources.DOM
        .select(".device")
        .events("click")
        .map((x) => ({id: x.target.id, group: "recordFrom"}));

    deviceClicks_.addListener(dexieListener);

    /**
     * Collects click events occurring over masthead
     * @const {xs<Stream>}
     */
    const mastheadClicks_ = sources.DOM
        .select(".masthead-element")
        .events("click")
        .map((x) => ({id: x.target.id, req: "masthead"}));

    /**
     * Collects change?? events in the selector for Video.js
     * @const {xs<Stream>}
     */
    const videojsSelector_ = sources.DOM
        .select(".videojs-selector")
        .events("input")
        .map((x) => {
            const sel = x.target.options[x.target.selectedIndex];
            return {id: sel.id, addr: sel.value};
        });
    
    videojsSelector_.addListener({
        next: i => console.log(i),
        error: err => console.error(err),
        complete: () => console.log('completed'),
      });

    /**
     * Collects click events occuring over status element
     * @const {xs<Stream>}
     */
    const statusClicks_ = sources.DOM
        .select(".status")
        .events("click")
        .map((x) => ({id: x.target.id, req: "status"}));

    const outgoing_ = xs.merge(mastheadClicks_, statusClicks_);

    const dexieDevices_ = xs.fromPromise(db.recordFrom.toArray()).startWith([]);

    /** Virtual DOM rendered by Cycle.js
     * @const {DOMSource}
     */
    const vdom_ = xs.combine(devices_, status_, dexieDevices_)
        .map(([dev, stat, dexDev]) =>
            div([
                div(".masthead", {
                    attrs: {style: "background-color: black; color: white; height: 60px; text-align: center;"}
                },
                [
                    span(".masthead-element", {attrs: {id: "status", style: `color: ${stat.status == "OK" ? "green" : "red"}; float: left; padding: 15px 0px 0px 15px; text-align: left;`}}, stat.status == "OK" ? "LIVE" : "ERR"),
                    span(".logo", {attrs: {id: "logo", style: "display: inline-block; margin: 0 auto;"}}, img({attrs: {src: "img/monocle.png", alt: "monocle logo"}})),
                    span(".masthead-element", {attrs: {id: "settings", style: "float: right; padding: 15px 15px 0px 0px;"}}, "[SET]")
                ]),
                div(".devices-list", {
                        attrs: {style: "background-color: lightgreen; float: left; margin: 0 0.5% 0 0.5%; width: 17%;"}
                    },
                    Object.keys(dev).map((k) => {
                        return div(`.devices-${k}`,
                            dev[k].map((d) => {
                                const sel = dexDev.map((x) => x.id).includes(d.id);
                                return p(".device", {
                                    attrs: {id: d.id, dataType: k, style: `background-color: ${sel ? "black" : "white"}; color: ${sel ? "white" : "black"}; font-weight: ${sel ? "bold": "normal"};`}
                                }, [
                                    `(${k[0]}) `,
                                    `${d.label}${d.location ? " (" + d.location + ")" : ""}`
                                ])
                            })
                        )
                    })
                ),
                div(".videojs-panel", {
                        attrs: {style: "background-color: lightblue; float: left; width: 60%;"}
                    }, [
                        select(".videojs-selector", (dev.video) ? dev.video.map((v) => {
                            return option(
                                ".videojs-option",
                                {attrs: {id: v.id, dataType: v.dataType, value: `${v.stream.protocol}://${v.stream.address}${v.stream.path}`}},
                                v.label
                            )
                        }) : "unavailable"),
                        h2("<<video.js>>")
                    ]
                ),
                div(".status-list", {
                        attrs: {style: "background-color: red; float: left; margin: 0 0.5% 0 0.5%; width: 21%;"}
                    }, [
                    span(">>LABEL INPUT<< [RECORD]"),
                    hr(),
                    p(JSON.stringify(stat))
                ])
            ])
        );

    return {
        DOM: vdom_,
        ws: outgoing_
    };
};

/**
 * Run `main` and connect it to `driver`
 * @param {Function} A function that takes `sources` as inputs and outputs `sinks`
 * @param {Object} An object where keys are driver names and values are driver functions
 */
run(main, {
    DOM: makeDOMDriver("#app"),
    ws: wsDriver("ws://localhost:12131")
});