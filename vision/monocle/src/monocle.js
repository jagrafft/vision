/*jslint es6*/
"use strict";
import {adapt} from '@cycle/run/lib/adapt';
import {div, h2, h4, makeDOMDriver, p, span} from "@cycle/dom";
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
                    ws.send(JSON.stringify({req: "devices", val: {}}));
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

const Masthead = (sources) => {
    const clicks_ = sources.DOM
        .select(".masthead-element")
        .events("click")
        .map((x) => ({id: x.target.id}));

    clicks_.addListener(StreamPrinter);
    // TODO Listen to sources.ws for "status", set STATUS accordingly?

    const vdom_ = xs.of(
        div(".masthead", {
            attrs: {
                style: "background-color: black; color: white; height: 2.5em; text-align: center;"
            }
        },
        [
            span(".masthead-element", {attrs: {id: "status", style: "float: left; width: 75px;"}},"[STATUS]"),
            span(".masthead-element", {attrs: {id: "logo", style: "display: inline-block; margin: 0 auto;"}},"[MONOCLE_LOGO]"),
            span(".masthead-element", {attrs: {id: "settings", style: "float: right; width: 75px;"}},"[SET]")
        ])
    );

    return {
        DOM: vdom_
    }
};

const Devices = (sources) => {
    const d_ = sources.ws
        .filter((x) => x.req === "devices");

    const clicks_ = sources.DOM
        .select(".device")
        .events("click")
        .map((x) => ({id: x.target.id}));

    clicks_.addListener(StreamPrinter);

    const vdom_ = d_
        .map((x) => {
            const res = x.res;
            return div(".devices", [
                h2("devices"),
                div(".devices-lists",
                    Object.keys(res).map((k) => {
                        return div([
                            h4(k),
                            div(`.devices-${k}`,
                                res[k].map((d) => {
                                    return p(".device", {
                                        attrs: {id: d.id, dataType: k}
                                    }, `${d.label}${d.location ? " (" + d.location + ")" : ""}`)
                                })
                            )
                        ])
                    })
                )
            ])
        });

    return {
        DOM: vdom_
    }
}

const Status = (sources) => {
    const dom = sources.DOM;
    const ws_ = sources.ws;

    const vdom_ = ws_
        .filter((x) => x.req === "status")
        .map((x) =>
            div(".process-status", [
                h2("process status"),
                span(".status", x.res)
            ])
    );

    const clicks_ = dom
        .select(".status")
        .events("click")
        .map((x) => x.target.textContent);

    clicks_.addListener(StreamPrinter);

    return {
        DOM: vdom_
    }
}

const main = Masthead;
// const vdom_ = Devices;
// const vdom_ = Status;
// const vdom_ = xs.combine(Masthead, Devices);
// const vdom_ = xs.combine(Devices, Status);
// const vdom_ = xs.combine(Masthead, Status);
// const vdom_ = xs.combine(Masthead, Devices, Status);

run(main, {
    DOM: makeDOMDriver("#app"),
    ws: wsDriver("ws://localhost:12131")
});

// const localStoreLookup = (id) => localStorage.getItem(id) === null ? false : true;

// const localStoreTransact = (obj) => {
//     const key = `src${obj.id}`;
//     localStorage.getItem(key) === null ? localStorage.setItem(key, obj.id) : localStorage.removeItem(key);
// }