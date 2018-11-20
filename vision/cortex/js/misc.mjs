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
 * Pair sources in an array
 * @param {Object} obj Array of sources
 * @returns {Array<Array<Object>>}
 */
export const pairByDataType = (obj) => {
    const defaultHandler = settings.handlers[settings.defaults.handler];

    return Object.entries(obj).reduce((a,c) => {
        const u = new Set(c[1].map((x) => x.dataType));

        // Only attempt to pair groups with multiple dataTypes
        if (u.size > 1) {
            const dtGrps = c[1].groupByKey("dataType");
            const srcs = Object.entries(dtGrps).reduce((acc,cur) => {
                // Test if dataType(s) of `defaultHandler` include dataType of `cur`
                // T: add (dataType => [src...]) to `acc`
                // F: push [src...] to `a`
                defaultHandler.dataType.includes(cur[0]) ? acc[cur[0]] = cur[1] : a.push(cur[1]);
                return acc;
            }, new Object({}));
            
            // All dataTypes in `dtGrps` included in `defaultHandler.dataType`
            const dtSrcs = Object.keys(srcs);
            const handlerDtLength = defaultHandler.dataType.length;
            // Union of `defaultHandler.dataType` and dtSrcs`
            const dtUnion = new Set([...defaultHandler.dataType, ...dtSrcs]);

            // Test if `dtUnion` is the same length as `defaultHandler.dataType` and dtSrcs`,
            // indicating whether `srcs` is valid for pairing operation.
            // T: (1) pair, (2) push to `a`
            // F: Push values to `a`
            if ((handlerDtLength === dtSrcs.length) && (handlerDtLength === dtUnion.size)) {
                // Add dataType to object?
                a.push("PAIR!!")
            }
            else { Object.entries(srcs).forEach((x) => a.push(x[1])); }
        } 
        else { a.push(c[1]); }
        return a;
    }, []).flat()
};

/**
 * Return a handler from `settings.handlers` based on dataType
 * @param {String} dt Datatype to search for
 * @returns {String} Handler file name
 */
export const returnHandler = (dt) => {
};