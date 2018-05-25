/*jslint es6*/
import xs from "xstream";
import isolate from "@cycle/isolate";
import {div, span, input, label, makeDOMDriver} from "@cycle/dom";
import {run} from "@cycle/run";

function List(sources) {
    const props = Object.freeze([
        {label: "w00t", id: 1},
        {label: "s00t", id: 2},
        {label: "r00t", id: 3},
        {label: "b00t", id: 4},
        {label: "p00t", id: 5}
    ]);

    function isolateList (props) {
        return props.reduce(function (prev, prop) {
            return prev.concat(isolate(ListItem)({Props: xs.of(prop), DOM: sources.DOM}).DOM);
        }, []);
    }

    const vdom_ = xs.combine.apply(null, isolateList(props))
        .map((x) => div(".list", x));

    return {
        DOM: vdom_
    };
}

function ListItem(sources) {
    const domSource = sources.DOM;
    const props_ = sources.Props;

    const srcIds_ = domSource
        .select(".src")
        .events("change")
        .map((ev) => ({id: ev.target.id, checked: ev.target.checked}));

    srcIds_.addListener({
        next: function handleNextEvent(event) {
            console.log(`event: {id: ${event.id}, checked: ${event.checked}}`);
        },
        error: function handleError(error) {
            console.error(`error: ${error}`);
        },
        complete: function handleCompleted() {
            console.log(`completed`);
        }
    });

    const state$ = props_
        .map(props => srcIds_
            .map((val) => ({id: props.id, label: props.label}))
            .startWith(props)
        )
        .flatten();

    const vdom_ = state$
        .map(state => div(".list-item", [
            input(".src", {
                attrs: {type: "checkbox", id: state.id}
            }),
            label({attrs: {for: state.id}}, state.label)
        ])
    );

    return {
        DOM: vdom_
    };
}

run(List, {DOM: makeDOMDriver("#app")});