/*jslint es6*/
"use strict";
import {adapt} from '@cycle/run/lib/adapt';
import {div, span, makeDOMDriver} from "@cycle/dom";
// import isolate from "@cycle/isolate";
import {run} from "@cycle/run";
import xs from "xstream";

// Cycle.js WebScoket Driver
const wsDriver = (a) => {
    const ws = new WebSocket(a);
    const driver = () => {
        const in_ = xs.create({
            start: listener => {
                ws.onmessage = (msg) => {
                    const j = JSON.parse(msg.data);
                    listener.next(j);
                };
            },
            stop: () => {ws.close()}
        });
        return adapt(in_);
    };
    return driver;
};

const main = (sources) => {
    // const devices = ws_.filter(x => x.req === "queryDevices");
    const status = sources.ws.filter(x => x.req === "status");
    const vdom_ = status.map((x) => div(".w00t-list", [span(".w00t", `status: ${x.res}`)]));
    return {
        DOM: vdom_
    }
};
  
run(main, {
    DOM: makeDOMDriver("#app"),
    ws: wsDriver("ws://localhost:12131")
});

// const localStoreLookup = (id) => localStorage.getItem(id) === null ? false : true;

// const localStoreTransact = (obj) => {
//     const key = `src${obj.id}`;
//     localStorage.getItem(key) === null ? localStorage.setItem(key, obj.id) : localStorage.removeItem(key);
// }

// const List = (sources) => {
//     // const props = devices;
//     const props = Object.freeze([
//         {label: "w00t", id: 1},
//         {label: "s00t", id: 2},
//         {label: "r00t", id: 3},
//         {label: "b00t", id: 4},
//         {label: "p00t", id: 5}
//     ]);

//     const isolateList = (props) => {
//         return props.reduce(function (prev, prop) {
//             return prev.concat(isolate(ListItem)({Props: xs.of(prop), DOM: sources.DOM}).DOM);
//         }, []);
//     };
//     // console.log(isolateList);

//     const vdom_ = xs.combine.apply(null, isolateList(props))
//         .map((x) => div(".list", x));

//         // console.log(vdom_);
//     return {
//         DOM: vdom_
//     };
// }

// const ListItem = (sources) => {
//     const domSource = sources.DOM;
//     const props_ = sources.Props;

//     const srcIds_ = domSource
//         .select(".src")
//         .events("click")
//         .map((ev) => ({id: ev.target.id}));

//     srcIds_.addListener({
//         next: function handleNextEvent(event) {
//             localStoreTransact(event);
//         },
//         error: function handleError(error) {
//             console.error(`error: ${error}`);
//         },
//         complete: function handleCompleted() {
//             console.log(`completed`);
//         }
//     });

//     const state_ = props_
//         .map((props) => srcIds_
//             .map(() => ({id: props.id, label: props.label}))
//             .startWith(props)
//         )
//         .flatten();

//     const vdom_ = state_
//         .map((state) => div(".list-item", [
//             span(".src", {
//                 attrs: {id: state.id}
//             }, `${state.label}${localStoreLookup(`src${state.id}`) ? "*" : ""}`)
//         ]));

//     return {
//         DOM: vdom_
//     };
// }

// run(List, {DOM: makeDOMDriver("#app")});