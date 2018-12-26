import Logger from "nedb-logger";
import moment from "moment";
import Task from "folktale/concurrency/task";

/**
 * Logger for *vision*
 * @const {NeDB<Logger>}
 */
const logstore = new Logger({filename: `./${process.env.DB_DIR_PATH}/logs.db`, autoload: true});

/**
 * Write log event to NeDB datastore
 * @param {Object} ev Object containing event description
 * @param {string} evType Type of event
 * @param {string} out Outcome
 * @returns {Folktale<Task>}
 */
export const logEvent = (ev, evType, out) => {
    return Task.task(
        (resolver) => {
            resolver.cleanup(() => {
                if (process.env.VERBOSE_LOGGING) {
                    logstore.insert({t: moment().format("x"), type: evType, outcome: out, event: ev}, (err) => {
                        (err) ? console.error(err) : console.log("logEvent CLEANUP written to log");
                    });
                }
            });

            resolver.onCancelled(() => {
                console.log("logEvent CANCELLED");
            });

            logstore.insert({t: moment().format("x"), type: evType, outcome: out, event: ev}, (err) => {
                (err) ? resolver.reject(err) : resolver.resolve({result: "OK"});
            });
        }
    );
};