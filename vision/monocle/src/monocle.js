// import { div, h1, hr, input, label, makeDOMDriver } from "@cycle/dom";
import { h1, div, input, p, makeDOMDriver } from "@cycle/dom";
import { run } from "@cycle/run";
// import xstream from "xstream";

// const tempData = Object.freeze([
//   { label: "w00t", id: 1 },
//   { label: "s00t", id: 2 },
//   { label: "r00t", id: 3 },
//   { label: "b00t", id: 4 },
//   { label: "p00t", id: 5 }
// ]);

function main(sources) {
  const sinks = {
    DOM: sources.DOM.select('input').events('click')
      .map(ev => ev.target.checked)
      .startWith(false)
      .map(toggled =>
        div([
          input({attrs: {type: 'checkbox'}}), 'Toggle me',
          p(toggled ? 'ON' : 'off')
        ])
      )
  };
  return sinks;
}

// function main(sources) {
//   const input_ = sources.DOM.select(".field").events("input")

//   const name_ = input_.map(ev => ev.target.value).startWith("")

//   const vdom_ = name_.map(name =>
//     div([
//       label("w00t:"),
//       input(".field", {attrs: {type: "text"}}),
//       hr(),
//       h1("Høla, " + name),
//     ])
//   )

//   return { DOM: vdom_ }
// }

run(main, { DOM: makeDOMDriver("#app") })