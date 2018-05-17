/*jslint es6*/

import preact, { h } from "preact";

preact.render(
  <div>
    <button onClick={() => alert("w00t!")}>Click to Test</button>
  </div>,
  document.querySelector('[data-js="main"]')
);
