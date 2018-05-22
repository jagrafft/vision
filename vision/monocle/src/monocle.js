import { div, h1, hr, input, label, makeDOMDriver } from '@cycle/dom';
import { run } from '@cycle/run';

function main(sources) {
  const input$ = sources.DOM.select('.field').events('input')

  const name$ = input$.map(ev => ev.target.value).startWith('')

  const vdom$ = name$.map(name =>
    div([
      label('w00t:'),
      input('.field', {attrs: {type: 'text'}}),
      hr(),
      h1('Høla, ' + name),
    ])
  )

  return { DOM: vdom$ }
}

run(main, { DOM: makeDOMDriver('#app') })