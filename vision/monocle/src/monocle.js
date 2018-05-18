/*jslint es6 */
import preact, { h } from "preact";

preact.render(
  <div>
    <button onClick={() => alert("w00t!")}>Click THIS!</button>
  </div>,
  document.getElementById("app")
);