/*jslint es6*/
if (!Array.prototype.groupByKey) {
    /**
     * Group array by key.
     * @param {string} k Key to group by.
     * @returns {Array<Object>}
     */
    Array.prototype.groupByKey = function(k) {
        return this.reduce((g, ob) => {
            const v = ob[k];
            if (typeof g[v] === "undefined") g[v] = [];
            g[v].push(ob);
            return g;
        }, {});
    }
}