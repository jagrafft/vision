(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('preact')) :
  typeof define === 'function' && define.amd ? define(['preact'], factory) :
  (factory(global.preact));
}(this, (function (preact) { 'use strict';

  var preact__default = 'default' in preact ? preact['default'] : preact;

  /*jslint es6*/

  preact__default.render(preact.h(
    "div",
    null,
    preact.h(
      "button",
      { onClick: function onClick() {
          return alert("w00t!");
        } },
      "Click to Test"
    )
  ), document.querySelector('[data-js="main"]'));

})));
//# sourceMappingURL=bundle.js.map
