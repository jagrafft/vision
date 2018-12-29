/*jslint es6 */
import moment from "moment";

import Status from "./status";

/**
 * Returns JSON packet which conforms to *vision* specifications.
 * @param {string} key Keyword for packet. Used by Monocle and "Window" for updates when packet is returned.
 * @param {*} res Result of operation performed at client's request. *Should be JSON serializable.*
 * @param {string} stat Status string that conforms to *vision* specifications.
 * @returns {Promise<String>} Stringified JSON packet conforming to *vision* specifications.
 */
export const packet = (key, val, sender, status) => {
    return new Promise((resolve, reject) => {
        const vals = new Set([key, val, sender]);
        if (vals.has(undefined)) reject(Status.ERROR);

        let obj = new Object({key: key, val: val, sender: sender});
        if (status !== undefined) obj["status"] = status;

        resolve(JSON.stringify(obj));
    });
};

/**
 * Strip array of objects returned by NeDB operation of key-value pairs used only by Cortex.
 * @param {Array<Object>} arr Array of objects containing results of an NeDB operation.
 * @returns {Promise<Array>}
 */
export const prune = (arr) => {
    return Promise.resolve(
        arr.map((x) => {
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
        })
    );
};

/**
* Create *vision* Session object
* @param {Array<String>} ids Device IDs
* @param {String} label Session name
* @param {String} location Session location
* @param {String} path Path where data will dump
* @param {String} status Approximately current status of session
* @param {Array<String>} tags Additional information; defaults to `[]`
* @returns {Promise<Object || String>}
*/
export const session = (ids, label, location, path, status, tags = []) => {
    return new Promise((resolve, reject) => {
        if (new Set([ids, label, location, path, status]).has(undefined)) reject(Status.ERROR);

        resolve(new Object({
            dt: moment().format("X"),
            deviceIds: ids,
            label: label,
            location: location,
            path: `${path}/${label.replace(/\s/g, "_")}-${moment().format("YYYY-MM-DD_HHmmss")}`,
            tags: tags,
            status: status,
            lastUpdate: moment().format("X")
        }))
    });
};