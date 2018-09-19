/*jslint es6*/
/**
 * @author jason a. grafft <jason@grafft.co>
 */
"use strict";
import {adapt} from '@cycle/run/lib/adapt';
import {div, img, h2, makeDOMDriver, option, p, select, span} from "@cycle/dom";
// import isolate from "@cycle/isolate";
import {run} from "@cycle/run";
import xs from "xstream";

// const localStoreLookup = (id) => localStorage.getItem(id) === null ? false : true;

// const localStoreTransact = (key, obj) => {
//     localStorage.getItem(key) === null ? localStorage.setItem(key, obj) : localStorage.removeItem(key);
// }

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
 * Bidirectional XStream driver for device selection.
 */

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
    // const deviceClicks_ = sources.DOM
    //     .select(".device")
    //     .events("click")
    //     .map((x) => ({id: x.target.id, req: "devices"}));

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
    // const videojsSelector_ = sources.DOM
        // .select(".videojs-selector")
        // .events("click")
        // .map((x) => ({id: x.target.id, origin: "masthead"}));

    /**
     * Collects click events occuring over status element
     * @const {xs<Stream>}
     */
    const statusClicks_ = sources.DOM
        .select(".status")
        .events("click")
        .map((x) => ({id: x.target.id, req: "status"}));

    const outgoing_ = xs.merge(mastheadClicks_, statusClicks_);

    /** Virtual DOM rendered by Cycle.js
     * @const {DOMSource}
     */
    const vdom_ = xs.combine(devices_, status_)
        .map(([dev, stat]) =>
            div([
                div(".masthead", {
                    attrs: {style: "background-color: black; color: white; height: 60px; text-align: center;"}
                },
                [
                    span(".masthead-element", {attrs: {id: "status", style: `color: ${stat.status == "OK" ? "green" : "red"}; float: left; padding: 15px 0px 0px 15px; text-align: left;`}}, stat.status == "OK" ? "LIVE" : "ERR"),
                    span(".logo", {attrs: {id: "logo", style: "display: inline-block; margin: 0 auto;"}}, img({attrs: {src: "img/monocle.png", alt: "monocle logo"}})),
                    span(".masthead-element", {attrs: {id: "settings", style: "float: right; padding: 15px 15px 0px 0px;"}}, "[SET]")
                ]),
                h2("devices"),
                div(".devices-list",
                    Object.keys(dev).map((k) => {
                        return div(`.devices-${k}`,
                            dev[k].map((d) => {
                                return p(".device", {
                                    attrs: {id: d.id, dataType: k}
                                }, [
                                    `(${k[0]}) `,   // localStoreLookup(k[0])
                                    `${d.label}${d.location ? " (" + d.location + ")" : ""}`
                                ])
                            })
                        )
                    })
                ),
                h2("<<video.js>>"),
                div(".videojs-panel",
                    select(".videojs-selector", (dev.video) ? dev.video.map((v) => {
                        return option(
                            ".videojs-option",
                            {attrs: {id: v.id, dataType: v.dataType}},
                            v.label
                        )
                    }) : "unavailable")
                ),
                // h2("status"),
                // div(".status-list", [
                //     JSON.stringify(stat)
                // ])
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