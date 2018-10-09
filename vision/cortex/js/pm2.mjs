/*jslint es6*/
import {logEvent} from "./logger";
import moment from "moment";
import pm2 from "pm2";
import Task from "folktale/concurrency/task";

/**
 * Delete *vision* processes managed by PM2.
 * @param {Array<string>} ids PM2 ids to delete.
 * @returns {Folktale<Task>}
 */
export const pm2delete = (ids) => {
    return Task.task(
        (resolver) => {
            pm2.connect((err) => {
                if (err) resolver.reject(err);
                resolver.cleanup(() => {
                    // log?
                    console.log("LOG: pm2delete() cleanup");
                    pm2.disconnect();
                });
                resolver.onCancelled(() => {
                    // log?
                    console.log("LOG: pm2delete() cancelled");
                    pm2.disconnect();
                });
                ids.forEach((id) => {
                    let errs = [];
                    pm2.delete(id, (err) => {
                        // What to do with errors?
                        if (err) {
                            errs.push(err);
                            logEvent(err, "delete", "ERROR");
                        }
                        logEvent(id, "delete", "OK");
                        // update NeDB entry
                        return pm2.disconnect();
                    });
                });
                // if errs !empty ...?
                resolver.resolve(errs);
            });
        }
    )
};

/**
 * List *vision* processes managed by PM2.
 * @returns {Folktale<Task>}
 */
export const pm2list = () => {
    return Task.task(
        (resolver) => {
            pm2.connect((err) => {
                if (err) resolver.reject(err);
                resolver.cleanup(() => {
                    // log?
                    console.log("LOG: pm2List() cleanup");
                    pm2.disconnect();
                });
                resolver.onCancelled(() => {
                    // log?
                    console.log("LOG: pm2List() cancelled");
                    pm2.disconnect();
                });
                pm2.list((err, pdl) => {
                    if (err) {
                        resolver.reject(err);
                    } else {
                        const l = pdl.map((p) => {
                            const ut = moment(p.pm2_env.created_at).fromNow();
                            return {
                                id: p.pm_id,
                                name: p.name,
                                status: p.pm2_env.status,
                                created: p.pm2_env.created_at,
                                uptime: ut.slice(0, ut.length - 4),
                                restarts: p.pm2_env.restart_time
                            }
                        });
                        resolver.resolve(l);
                    }
                })
            });
        }
    );
};

/**
 * Start *vision* process via PM2.
 * @param {Array<string>} ids Device ids to start PM2 processes for.
 * @returns {Folktale<Task>}
 */
export const pm2start = (ids) => {
    return Task.task(
        (resolver) => {
            pm2.connect((err) => {
                if (err) resolver.reject(err);
                resolver.cleanup(() => {
                    // log?
                    console.log("LOG: pm2start() cleanup");
                    pm2.disconnect();
                });
                resolver.onCancelled(() => {
                    // log?
                    console.log("LOG: pm2start() cancelled");
                    pm2.disconnect();
                });
                ids.forEach((id) => {
                    let started = [];
                    pm2.start({
                        // options...
                    },
                    (err) => {
                        if (err) {
                            logEvent(err, "start", "ERROR");
                            resolver.reject(err);
                        }
                        logEvent(id, "start", "OK");
                        started.push(id);
                        // update NeDB entry
                        return pm2.disconnect();
                    });
                });
                // if errs !empty ...?
                resolver.resolve(started);
            });
        }
    )
};