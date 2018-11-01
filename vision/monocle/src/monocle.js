/*jslint es6*/
/**
 * @author jason a. grafft <jason@grafft.co>
 */
"use strict";
import {adapt} from "@cycle/run/lib/adapt";
import Dexie from "dexie";
import {div, img, input, hr, makeDOMDriver, option, p, select, span} from "@cycle/dom";
import {run} from "@cycle/run";
import sampleCombine from "xstream/extra/sampleCombine";
import xs from "xstream";

// TODO Implement handler selection

/**
 * Global Dexie instance.
 * @const {Dexie}
 */
const db = new Dexie("vision:monocle");
db.version(2).stores({
    recordQueue: "id"
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
            .catch("ConstraintError", () => {   // failed due to preexising key
                db.recordQueue.where("id").equals(o.id).delete();
                console.log(`${o.id} removed from ${o.group}.`);
            })
            .catch((e) => console.error(e));
    },
    error: (err) => console.error(err),
    complete: () => console.log("dexieListener complete")
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
     */
    const driver = (out_) => {
        out_.addListener({
            next: (out) => {
                // console.log(out);
                const rep = out.req == "record" ? out.ids.then((dev) => new Object({key: out.key, req: out.req, val: {label: out.label, ids: dev.map((x) => x.id)}})) : new Promise((resolve) => resolve(out));

                rep.then((x) => ws.send(JSON.stringify(x)));
            },
            error: (err) => console.error(err),
            complete: () => console.log("wsDriver out_ complete.")
        });

        /**
         * Listener for `wsDriver`
         * @const {xs<Stream>}
         */
        const in_ = xs.create({
            start: (listener) => {
                ws.onopen = () => {
                    ws.send(JSON.stringify({key: "devices", req: "find", val: "group"}));
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
     * Collects click events for `.device` elements
     * @const {xs<Stream>}
     */
    const deviceClicks_ = sources.DOM
        .select(".device")
        .events("change")
        .map((x) => ({id: x.target.id, checked: x.target.checked, group: "recordQueue"}));

    /**
     * Forwards `deviceClick_` values to `dexieListener`
     */
    deviceClicks_.addListener(dexieListener);

    /**
     * Collects click events occurring over masthead
     * @const {xs<Stream>}
     */
    const mastheadClicks_ = sources.DOM
        .select(".masthead-element")
        .events("click")
        .map((x) => ({key: x.target.id, req: x.target.id, val: {}}));

    /**
     * Collects click events from "record" and "stop" buttons
     */
    const recordStopButtons_ = sources.DOM
        .select(".recordToggle")
        .events("click")
        .map((x) => x.target.value);

    /**
     * Filters invalid characters from session label
     * @const {xs<Stream>}
     */
    const sessionLabel_ = sources.DOM
        .select(".sessionLabel")
        .events("input")
        .map((x) => (x.target.value.replace(/[!@#$%^&\*()\-=_+|;':",.\[\]{}<\\/>?']/g, " ")))
        .startWith("");

    /**
     * Collects click events occurring over status element
     * @const {xs<Stream>}
     */
    const statusClicks_ = sources.DOM
        .select(".status")
        .events("click")
        .map((x) => ({id: x.target.id, req: "status"}));

    /**
     * Collects input events in `.video-selector`
     * @const {xs<Stream>}
     */
    const videoSelector_ = sources.DOM
        .select(".video-selector")
        .events("input")
        .map((x) => {
            const sel = x.target.options[x.target.selectedIndex];
            return {id: sel.id, addr: sel.value};
        })
        .startWith({id: "", addr: ""});

    /**
     * Filters stream for "devices" key
     * @const {xs<Stream>}
     */
    const devices_ = sources.ws
        .filter((x) => x.key == "devices")
        .map((x) => x.res)
        .startWith({devices: [{id: null, dataType: null}]});

    /**
     * Filters stream for "status" key
     * @const {xs<Stream>}
     */
    const status_ = sources.ws
        .filter((x) => x.key == "status")
        .startWith({req: "status", status: "initializing..."});

    /**
     * Compose `recordStopButtons_` events with `sessionLabel_` events for record start/stop
     * @const {xs<Stream>}
     */
    const recordStopRequests_ = recordStopButtons_.compose(sampleCombine(sessionLabel_))
        .map((x) => {
            return new Object({
                key: x[0],
                req: "record",
                label: x[1],
                ids: x[0] == "start" ? Promise.resolve(db.recordQueue.toArray()) : Promise.resolve([])
            });
        });

    /**
     * Connect streams to outgoing WebSocket
     * @const {xs<Stream>}
     */
    const outgoing_ = xs.merge(mastheadClicks_, recordStopRequests_, statusClicks_);
    // const outgoing_ = recordStopRequests_;

    /** Virtual DOM rendered by Cycle.js
     * @const {DOMSource}
     * @returns {DOMSource}
     */
    const vdom_ = xs.combine(devices_, status_, xs.fromPromise(db.recordQueue.toArray()), videoSelector_, sessionLabel_)
        .map(([dev, stat, que, vid, lab]) => {
            const deviceQueue = que.map((x) => x.id);
            return div([
                div(".masthead", {
                    attrs: {style: "background-color: black; color: white; height: 60px; text-align: center;"}
                },
                [
                    span(
                        ".masthead-element",
                        {attrs: {id: "status", style: `color: ${stat.status == "OK" ? "green" : "red"}; float: left; padding: 15px 0px 0px 15px; text-align: left;`}},
                        stat.status == "OK" ? "LIVE" : "ERR"
                    ),
                    span(
                        ".logo",
                        {attrs: {id: "logo", style: "display: inline-block; margin: 0 auto;"}},
                        img({attrs: {src: "img/monocle.png", alt: "monocle logo"}})
                    ),
                    span(
                        ".masthead-element",
                        {attrs: {id: "settings", style: "float: right; padding: 15px 15px 0px 0px;"}},
                        "[SET]"
                    )
                ]),
                div(
                    ".devices-list", {
                        attrs: {style: "background-color: lightgreen; float: left; margin: 4px 0.5% 0 0.5%; width: 17%;"}
                    },
                    Object.keys(dev).map((k) => {
                        return div(`.devices-${k}`,
                            dev[k].map((d) => {
                                return div(
                                    [
                                        input(
                                            ".device",
                                            {attrs: {id: d.id, dataType: k, type: "checkbox",
                                            checked: deviceQueue.includes(d.id)}}
                                        ),
                                        span(`(${k[0]}) ${d.label}${d.location ? " (" + d.location + ")" : ""}`)
                                    ]
                                )
                            })
                        )
                    })
                ),
                div(".video-panel", {
                        attrs: {style: "background-color: lightblue; float: left; margin: 4px 0 0 0; width: 60%;"}
                    }, [
                        select(
                            ".video-selector",
                            {attrs: {style: "margin: 4px 0 4px 10%;"}},
                            (dev.video) ? dev.video.map((v) => {
                                return option(
                                    ".video-option",
                                    {attrs: {id: v.id, dataType: v.dataType, value: `${v.stream.protocol}://${v.stream.address}${v.stream.path}`}},
                                    v.label
                                )
                            }) : "unavailable"
                        ),
                        div(
                            {attrs: {style: "margin: auto; height: 450px; width: 800px;"}},
                            img(
                                ".video-stream",
                                {attrs: {src: (vid.addr == "" ? `${dev.video[0].stream.protocol}://${dev.video[0].stream.address}${dev.video[0].stream.path}` : vid.addr), style: "height: 450px; width: 800px;"}}
                            )
                        )
                    ]
                ),
                div(".status-list", {
                        attrs: {style: "background-color: red; float: left; margin: 4px 0.5% 0 0.5%; width: 21%;"}
                    },
                    [
                        input(
                            ".sessionLabel",
                            {attrs: {style: "margin: 0 0 0 4px; width: 65%;", type: "text", value: lab}}
                        ),
                        input(
                            ".recordToggle",
                            {attrs: {style: "width: 25%;", type: "button", value: "start", disabled: lab == ""}}
                        ),
                        hr(),
                        p(JSON.stringify(stat)),
                        input(
                            ".recordToggle",
                            {attrs: {style: "width: 25%;", type: "button", value: "stop"}}
                        )
                    ]
                )
            ])
        });

    return {
        DOM: vdom_,
        ws: outgoing_
    };
};

/**
 * Run `main` and connect it to `driver`
 * @param {Function} DOM
 * @param {xs<Stream>} ws
 */
run(main, {
    DOM: makeDOMDriver("#app"),
    ws: wsDriver("ws://localhost:12131")
});