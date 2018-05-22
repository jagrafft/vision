import { div, h1, hr, input, label, makeDOMDriver } from "@cycle/dom";
import { run } from "@cycle/run";

function main(sources) {
  const input_ = sources.DOM.select(".field").events("input")

  const name_ = input_.map(ev => ev.target.value).startWith("")

  const vdom_ = name_.map(name =>
    div([
      label("w00t:"),
      input(".field", {attrs: {type: "text"}}),
      hr(),
      h1("Høla, " + name),
    ])
  )

  return { DOM: vdom_ }
}

run(main, { DOM: makeDOMDriver("#app") })