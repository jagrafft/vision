/*jslint es6*/
"use strict";
import {adapt} from '@cycle/run/lib/adapt';
import {div, h2, h4, makeDOMDriver, p} from "@cycle/dom";
// import isolate from "@cycle/isolate";
import {run} from "@cycle/run";
import xs from "xstream";

// Cycle.js WebScoket Driver
const wsDriver = (a) => {
    const ws = new WebSocket(a);
    const driver = () => {
        const in_ = xs.create({
            start: listener => {
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

const Devices = (sources) => {
    const d_ = sources.ws
        .filter((x) => x.req === "devices");

    const clicks_ = sources.DOM
        .select(".device")
        .events("click")
        .map((x) => ({id: x.target.id}));

    clicks_.addListener({
        next: (ev) => {
            console.log(ev);
        },
        error: (e) => console.error(e),
        complete: () => {}
    });

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
                                    }, `${d.label} - ${d.location}`)
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

// const Status = (sources) => {
//     const dom = sources.DOM;
//     const ws_ = sources.ws;

//     const vdom_ = ws_
//         .filter((x) => x.req === "status")
//         .map((x) =>
//             div(".status-list", [
//                 h2("process status"),
//                 span(".status", x.res)
//             ])
//     );

//     const clicks_ = dom
//         .select(".status")
//         .events("click")
//         .map((x) => x.target.textContent);

//     clicks_.addListener({
//         next: (ev) => {
//             console.log(`Status clicks_ listener.next: (ev) => ${ev}`);
//         },
//         error: (e) => {
//             console.error(e);
//         },
//         complete: () => {
//             console.log("Status clicks_ listener complete");
//         }
//     });

//     return {
//         DOM: vdom_
//     }
// }

// const main = xs.combine(Devices, Status);

run(Devices, {
    DOM: makeDOMDriver("#app"),
    ws: wsDriver("ws://localhost:12131")
});

// const localStoreLookup = (id) => localStorage.getItem(id) === null ? false : true;

// const localStoreTransact = (obj) => {
//     const key = `src${obj.id}`;
//     localStorage.getItem(key) === null ? localStorage.setItem(key, obj.id) : localStorage.removeItem(key);
// }