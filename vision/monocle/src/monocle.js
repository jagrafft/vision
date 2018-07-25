/*jslint es6*/
"use strict";
import {adapt} from '@cycle/run/lib/adapt';
import {b, div, img, h2, makeDOMDriver, p, span} from "@cycle/dom";
// import isolate from "@cycle/isolate";
import {run} from "@cycle/run";
import xs from "xstream";

// Cycle.js WebScoket Driver
const wsDriver = (a) => {
    const ws = new WebSocket(a);
    const driver = () => {
        const in_ = xs.create({
            start: (listener) => {
                ws.onopen = () => {
                    ws.send(JSON.stringify({req: "find", val: {group: "devices"}}));
                };
                ws.onmessage = (msg) => {
                    const j = JSON.parse(msg.data);
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

const StreamPrinter = {
    next: (v) => console.log(v),
    error: (e) => console.error(e),
    complete: () => console.log("StreamPrinter complete")
};

const main = (sources) => {
    const devices_ = sources.ws
        .filter((x) => x.req === "devices")
        .map((x) => x.res)
        .startWith({devices: [{id: null, dataType: null}]});

    const status_ = sources.ws
        .filter((x) => x.req === "status")
        .startWith({req: "status", res: "initializing..."});

    const masthead  = div(".masthead", {
            attrs: {style: "background-color: black; color: white; height: 60px; text-align: center;"}
        },
        [
            span(".masthead-element", {attrs: {id: "status", style: "float: left; width: 75px;"}}, "[STATUS]"),
            span(".logo", {attrs: {id: "logo", style: "display: inline-block; margin: 0 auto;"}}, img({attrs: {src: "img/monocle.png", alt: "monocle logo"}})),
            span(".masthead-element", {attrs: {id: "settings", style: "float: right; width: 75px;"}}, "[SET]")
        ]);

    const deviceClicks_ = sources.DOM
        .select(".device")
        .events("click")
        .map((x) => ({id: x.target.id, origin: "devices"}));

    const mastheadClicks_ = sources.DOM
        .select(".masthead-element")
        .events("click")
        .map((x) => ({id: x.target.id, origin: "masthead"}));

    // const statusClicks_ = sources.DOM
    //     .select(".status")
    //     .events("click")
    //     .map((x) => ({id: x.target.id, origin: "status"}));

    deviceClicks_.addListener(StreamPrinter);
    mastheadClicks_.addListener(StreamPrinter);
    // statusClicks_.addListener(StreamPrinter);

    const vdom_ = xs.combine(devices_, status_)
        .map(([dev, stat]) =>
            div([
                masthead,
                h2("devices"),
                div(".devices-list",
                    Object.keys(dev).map((k) => {
                        return div(`.devices-${k}`,
                            dev[k].map((d) => {
                                return p(".device", {
                                    attrs: {id: d.id, dataType: k}
                                }, [
                                    b(`(${k[0]}) `),
                                    `${d.label}${d.location ? " (" + d.location + ")" : ""}`
                                ])
                            })
                        )
                    })
                ),
                h2("status"),
                div(".status-list", [
                    JSON.stringify(stat)
                ])
            ])
        );

    return {
        DOM: vdom_
    };
};

run(main, {
    DOM: makeDOMDriver("#app"),
    ws: wsDriver("ws://localhost:12131")
});

// const localStoreLookup = (id) => localStorage.getItem(id) === null ? false : true;

// const localStoreTransact = (key, obj) => {
//     localStorage.getItem(key) === null ? localStorage.setItem(key, obj) : localStorage.removeItem(key);
// }