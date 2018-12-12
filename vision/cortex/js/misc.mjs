import mkdirp from "mkdirp";
import moment from "moment";
import Task from "folktale/concurrency/task";

import "../../neurons/group";
// import {setEq} from "../../neurons/sets";
import {logEvent} from "./logger";
import settings from "./resources/settings.json";

/**
 * Assign handlers to an array of sources
 * @param {Array<Object>} arr Array of source objects
 * @returns {Folktale<Task>}
 */
export const assignHandlers = (arr) => {
    return Task.waitAll(
        arr.map((x) => {
            return returnHandlers(x).chain((h) => {
                let _obj = {...x};
                _obj.handler = h;
                return Task.of(_obj);
            });
        })
    )
};

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
 * Return handler(s) for `src`.
 * Default handler(s) are given precedence over source-specified ones.
 * @param {Object} src Data source
 * @returns {Folktale<Task>}
 */
const returnHandlers = (src) => {
    return Task.task(
        (resolver) => {
        const handlers = src.dataType.reduce((a,c) => {
            typeof settings.defaults[c] !== "undefined" ? a.found.push(settings.defaults[c].handler)
                : typeof src.handler !== "undefined" ? a.found.push(src.handler)
                    : a.notFound.push(c);
            return a;
        }, new Object({found: [], notFound: []}));

        handlers.notFound.length > 0 ? resolver.reject("NOT FOUND") : resolver.resolve([...new Set(handlers.found.flat())]);
    });
};