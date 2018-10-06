/*jslint es6*/
import Logger from "nedb-logger";
import moment from "moment";
import settings from "./resources/settings.json";
import Task from "folktale/concurrency/task";

/**
 * Logger for *vision*
 * @const {NeDB<Logger>}
 */
const logstore = new Logger({filename: `./${settings.defaults.db}/logs.db`, autoload: true});

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
                console.log("LOG: wsSend() cleanup");
            });
            resolver.onCancelled(() => {
                console.log("LOG: wsSend() cancelled");
            });
            logstore.insert({t: moment().format("x"), type: evType, outcome: out, event: ev}, (err) => {
                (err) ? resolver.reject(err) : resolver.resolve({result: "Success"});
            });
        }
    );
};