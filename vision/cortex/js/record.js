/*jslint es6*/
"use strict";

module.exports.start = ((req) => {
    console.log(`record.start = (req) => ${req}`);
});

module.exports.stop = ((req) => {
    console.log(`record.stop = (req) => ${req}`);
});