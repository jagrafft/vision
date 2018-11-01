/*jslint es6*/
import mkdirp from "mkdirp";
import moment from "moment";
import Task from "folktale/concurrency/task";

import "../../neurons/group";
import {logEvent} from "./logger";
import settings from "./resources/settings.json";

/**
 * Create `path` with mkdir -p method
 * @param {String} path String representing nested path
 * @returns {Folktale<Task>}
 */
export const createDir = (path) => {
    return Task.task(
        (resolver) => {
            resolver.cleanup(() => {
                logEvent(path, "createDir", "CLEANUP").run();
            });

            resolver.onCancelled(() => {
                logEvent(path, "createDir", "CANCELLED").run();
            });

            mkdirp(path, (err, res) => {
                // TODO Reduce number of return states (err, EXISTS, OK)
                if (err) resolver.reject(err);
                res === null ? resolver.reject("EXISTS") : resolver.resolve("OK");
            });
        }
    );
};

/**
 * Create *vision* Session object
 * @param {String} name Session name
 * @param {Array<String>} ids Device IDs to include
 * @param {String} status Approximately current status of session
 * @param {String} dtGroup Group membership, defaults to "sessions"
 * @returns {Object}
 */
export const newSession = (name, ids, status, dtGroup = "sessions") => {
    return new Object({
        dataType: "session",
        devices: ids,
        group: dtGroup,
        initiated: new Date(),
        lastUpdate: new Date(),
        name: name,
        path: `${settings.defaults.outputDir}/${name.replace(/\s/g, "_")}-${moment().format("YYYY-MM-DD_HHmmss")}`,
        status: status
    })
};

/**
 * Pair audio and video devices by shared key
 * @param {Array<Object>} arr Devices for pairing
 * @param {Array<String>} dts Data types to pair
 * @param {String} key Key in device `Object` to use for association
 * @returns {Array<Object>}
 */
export const pairSources = (arr, dts, key = "location") => {
    const deviceGroups = arr.groupByKey(key);

    return Object.keys(deviceGroups)
        .reduce((a,c) => {
            const dtGroup = deviceGroups[c].groupByKey("dataType");
            const pair = ((x) => x[0] && x[1])(dts.map((x) => x in dtGroup));

            // TODO Refactor `dts[0]`, `dts[1]` to generic
            if (pair) {
                const devicePairs = dtGroup[dts[0]]
                    .map((aud) => {
                        return dtGroup[dts[1]]
                            .map((vid) => {
                                return new Object({
                                    dataType: dts,
                                    audio: aud,
                                    video: vid
                                })
                            })
                        }).flat();
                    a.push(devicePairs);
            } else {
                a.push(Object.entries(dtGroup).map((x) => x[1]));
            }
            return a.flat();
        }, []).flat();
};