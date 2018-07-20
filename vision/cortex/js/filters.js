/*jslint es6*/
"use strict";

const groupBy = ((arr, k) => {
    return arr.reduce((g, ob) => {
        const v = ob[k];
        if (typeof g[v] === "undefined") g[v] = [];
        g[v].push(ob);
        return g;
    }, {});
});

module.exports.devices = ((d) => {
    const m = d.map((x) => {
        let r = {
            id: x._id,
            dataType: x.dataType,
            label: x.label,
            location: x.location
        };

        if (typeof x.stream !== "undefined") {
            r.stream = {
                address: x.address,
                path: x.stream.path,
                protocol: x.stream.protocol
            };
        }
        return r;
    });
    return groupBy(m, "dataType");
    // return m;
});

module.exports.records = ((r) => {
    console.log(`filters.records = (r) = ${r}`);
});