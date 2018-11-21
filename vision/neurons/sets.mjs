/**
 * Evaluate the per-item equality of two sets
 * @param {Array} a Set A
 * @param {Array} b Set B
 * @returns {Boolean}
 */
export const setEq = (a, b) => {
    if (a.length !== b.length) return false;
    const _a = new Set(a);
    const _b = new Set(b);
    return _a.size !== _b.size ? false : (new Set([..._a].filter((x) => !_b.has(x)))).size === 0
};