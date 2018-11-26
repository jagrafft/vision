import mkdirp from "mkdirp";
import moment from "moment";
import Task from "folktale/concurrency/task";

import "../../neurons/group";
// import {setEq} from "../../neurons/sets";
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
 * Pair sources in `obj` by `dataType`
 * @param obj Object of sources whose keys are `dataType`s
 * @param hand Name of handler for pairing operation
 * @returns {Folktale<Task>}
 */
export const pairWithHandler = (obj, hand) => {
    return Task.task(
        (resolver) => {
            const handler = settings.handlers[hand];
            // Reject request if handler cannot be found in settings
            if (typeof handler === "undefined") resolver.reject("Handler not found.");

            /**
             * Check if `obj` has all dataTypes required by handler.
             * Note that the value of `reduce` is "inverted" before return so that
             * - `true` indicates dataTypes are missing
             * - `false` indicates no dataTypes are missing
             */
            const missingDts = !handler.dataType.reduce((a,c) => a && Object.entries(obj).includes(c[0]), true);

            // Reject request if it cannot be fulfilled
            if (handler.allDataTypes && missingDts) resolver.reject("Insufficient data sources to satisfy handler's type requirement.");

            // Add all keys matching dataType of handler to `pair`
            const [pair, pass] = Object.entries(obj).reduce((a, c) => {
                handler.dataType.includes(c[0]) ? a[0][c[0]] = c[1] : a[1][c[0]] = c[1];
                return a;
            }, [new Object({}), new Object({})]);

            const sortedPairs = Object.entries(pair)
                .map((x) => new Object({dataType: x[0], srcs: x[1]}))
                .sort((a,b) => { return b.srcs.length - a.srcs.length });

            const tail = sortedPairs.slice(1);
            // `sortedPairs[0]` ("head" of `sortedPairs`) is the longest list,
            // so map over it to keep overhead of pairing operation more calculable
            sortedPairs[0].map((x, i) => {
                ""
            });

            resolver.resolve(new Object({paired = pair, unpaired = pass}));
        }
    );
};

/**
 * Pair sources by dataType within their group
 * @param {Object} obj Object of sources
 * @returns {Array<Array<Object>>}
 */
// export const pairByLocation = (obj) => {
//     const defaultHandler = settings.handlers[settings.defaults.handler];
//     const handlers = Object.entries(obj.groupByKey("location")).reduce((a,c) => {
//             a.push(c[1].map((x) => {
//                 if ("handler" in x) return x.handler;
//                 return Array.isArray(x.dataType) ? (setEq(defaultHandler.dataType, x.dataType) ? settings.defaults.handler : "NOT FOUND 1")
//                     : (defaultHandler.dataType.includes(x.dataType) ? settings.defaults.handler : "NOT FOUND 2")
//             }));
//             return a;
//         }, []).flat();
//     console.log(new Set(handlers));

//     return Object.entries(obj).reduce((acc, kv) => {
//         const uniqueDts = new Set(kv[1].map((x) => x.dataType));

//         // Only attempt to pair keys whose values have multiple dataTypes
//         if (uniqueDts.size > 1) {
//             // Collect sources whose dataType is included in `defaultHandler.dataType`
//             const defaultSrcs = Object.entries(kv[1].groupByKey("dataType"))
//                 .reduce((a, c) => {
//                     defaultHandler.dataType.includes(c[0]) ? a[c[0]] = c[1] : acc.push(c[1]);
//                     return a;
//                 }, new Object({}));

//             setEq(defaultHandler.dataType, Object.keys(defaultSrcs)) ? acc.push("PAIR!!")
//                 : Object.entries(defaultSrcs).forEach((x) => acc.push(x[1]));
//         } 
//         else { acc.push(kv[1]); }
//         return acc;
//     }, []).flat()
// };