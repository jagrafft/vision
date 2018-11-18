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
export const createDir = (path, subpaths = []) => {
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
 * @param {String} dtGrp Group membership, defaults to "sessions"
 * @returns {Object}
 */
export const newSession = (name, ids, status, dtGrp = "sessions") => {
    return new Object({
        dataType: "session",
        devices: ids,
        group: dtGrp,
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
export const pairSources = (arr) => {
    console.log(`PAIR`);
    const devicePairs = dtGrp[dts[0]]
        .map((aud) => {
            return dtGrp[dts[1]]
                .map((vid) => {
                    return new Object({
                        dataType: dts,
                        audio: aud,
                        video: vid
                    })
                })
            }).flat();
        a.push(devicePairs);
};