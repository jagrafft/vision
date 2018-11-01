/*jslint es6*/
import mkdirp from "mkdirp";
import moment from "moment";
import Task from "folktale/concurrency/task";

import "../../neurons/group";
import {logEvent} from "./logger";
import settings from "./resources/settings.json";

/**
 * Create `path` with mkdir -p method
 * @param {String} path 
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
 * @param {String} grp Group membership, defaults to "sessions"
 * @returns {Object}
 */
export const newSession = (name, ids, status, grp = "sessions") => {
    return new Object({
        dataType: "session",
        devices: ids,
        group: grp,
        initiated: new Date(),
        lastUpdate: new Date(),
        name: name,
        path: `${settings.defaults.outputDir}/${name.replace(/\s/g, "_")}-${moment().format("YYYY-MM-DD_HHmmss")}`,
        status: status
    })
};

/**
 * Pair audio and video devices by shared key
 * @param {Object} arr Devices for pairing
 * @param {String} key Key in device `Object` to use for association
 * @returns {Array<Object>}
 */
export const pairAvSrc = (arr, key = "location") => {
    const g = arr.groupByKey(key);
    return Object.keys(g)
        .reduce((a,c) => {
            const grp = g[c].groupByKey("dataType");
            const pair = ((x) => x[0] && x[1])(["audio", "video"].map((x) => x in grp));

            if (pair) {
                const prs = grp["audio"]
                    .map((a) => {
                        return grp["video"]
                            .map((v) => {
                                return new Object({
                                    dataType: ["audio", "video"],
                                    audio: a,
                                    video: v
                                })
                            })
                        }).flat();
                    a.push(prs);
            } else {
                a.push(Object.entries(grp).map((x) => x[1]));
            }
            return a.flat();
        }, []).flat();
};