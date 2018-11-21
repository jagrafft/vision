import mkdirp from "mkdirp";
import moment from "moment";
import Task from "folktale/concurrency/task";

import "../../neurons/group";
import {setEq} from "../../neurons/sets";
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
                if (err) resolver.reject(err);
                res === null ? resolver.reject("EXISTS") : resolver.resolve("OK");
            });
        }
    );
};

/**
 * Create Cortex session object
 * @param {String} name Session name
 * @param {Array<String>} ids Device IDs to include
 * @param {String} status Approximately crent status of session
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
 * Pair sources by dataType within their group
 * @param {Object} obj Object of sources
 * @returns {Array<Array<Object>>}
 */
export const pairByLocation = (obj) => {
    const defaultHandler = settings.handlers[settings.defaults.handler];
    const handlers = Object.entries(obj.groupByKey("location")).reduce((a,c) => {
            a.push(c[1].map((x) => {
                if ("handler" in x) return x.handler;
                return Array.isArray(x.dataType) ? (setEq(defaultHandler.dataType, x.dataType) ? settings.defaults.handler : "NOT FOUND 1")
                    : (defaultHandler.dataType.includes(x.dataType) ? settings.defaults.handler : "NOT FOUND 2")
            }));
            return a;
        }, []).flat();
    console.log(new Set(handlers));

    return Object.entries(obj).reduce((acc, kv) => {
        const uniqueDts = new Set(kv[1].map((x) => x.dataType));

        // Only attempt to pair keys whose values have multiple dataTypes
        if (uniqueDts.size > 1) {
            // Collect sources whose dataType is included in `defaultHandler.dataType`
            const defaultSrcs = Object.entries(kv[1].groupByKey("dataType"))
                .reduce((a, c) => {
                    defaultHandler.dataType.includes(c[0]) ? a[c[0]] = c[1] : acc.push(c[1]);
                    return a;
                }, new Object({}));
            
            setEq(defaultHandler.dataType, Object.keys(defaultSrcs)) ? acc.push("PAIR!!")
                : Object.entries(defaultSrcs).forEach((x) => acc.push(x[1]));
        } 
        else { acc.push(kv[1]); }
        return acc;
    }, []).flat()
};