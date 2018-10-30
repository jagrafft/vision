/*jslint es6*/
if (!Array.prototype.groupByKey) {
    /**
     * Group array by key.
     * @param {string} k Key to group by.
     * @returns {Object}
     */
    Array.prototype.groupByKey = function(k) {
        return this.reduce((a, c) => {
            const v = c[k];
            if (typeof a[v] === "undefined") a[v] = [];
            a[v].push(c);
            return a;
        }, {});
    }
}