/*jslint es6*/
"use strict";

module.exports.devices = ((d) => {
    return d.map((x) => {
        let r = {
            dataType: x.dataType,
            label: x.label,
            location: x.location
        };

        if (typeof x.stream !== "undefined") {
            r["stream"] = {
                address: x.address,
                path: x.stream.path,
                protocol: x.stream.protocol
            };
        }
        return r;
    });
});

module.exports.records = ((r) => {
    console.log(`filters.records = (r) = ${r}`);
});