/*jslint es6*/
/**
 * Strip array of objects returned by NeDB operation of key-value pairs used only by Cortex.
 * @param {Array<Object>} arr Array of objects containing results of an NeDB operation.
 */
export const prune = (arr) => {
    return arr.map((x) => {
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
};

/**
 * Returns JSON packet which conforms to *vision* specifications.
 * @param {string} key Keyword for packet. Used by Monocle and "Window" for updates when packet is returned.
 * @param {string} req Client request. **TO BE DEPRECATED**
 * @param {*} res Result of operation performed at client's request. *Should be JSON serializable.*
 * @param {string} stat Status string that conforms to *vision* specifications.
 * @returns {string} Stringified JSON packet conforming to *vision* specifications.
 */
export const reply = (key, res, stat) => JSON.stringify({key: key, res: res, status: stat});