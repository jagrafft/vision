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
                    logEvent(err, "delete", "CLEANUP");
                    pm2.disconnect();
                });
                resolver.onCancelled(() => {
                    logEvent(err, "delete", "CANCELLED");
                    pm2.disconnect();
                });
                ids.forEach((id) => {
                    let errs = [];
                    pm2.delete(id, (err) => {
                        if (err) {
                            errs.push(err);
                            logEvent(err, "delete", "ERROR");
                        }
                        logEvent(id, "delete", "OK");
                        // create NeDB entry? (seems like the wrong place)
                        return pm2.disconnect();
                    });
                });
                // How to handle partial sets?
                // resolve(errs) || reject(errs)?
                errs.length > 0 ? resolver.resolve(errs) : resolver.resolve("OK");
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
                    logEvent(err, "list", "CLEANUP");
                    pm2.disconnect();
                });
                resolver.onCancelled(() => {
                    logEvent(err, "list", "CANCELLED");
                    pm2.disconnect();
                });
                pm2.list((err, pdl) => {
                    if (err) {
                        logEvent(err, "list", "ERROR");
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
 * @param {Array<string>} cmds Commands to start PM2 processes for.
 * @returns {Folktale<Task>}
 */
export const pm2start = (cmds) => {
    return Task.task(
        (resolver) => {
            pm2.connect((err) => {
                if (err) resolver.reject(err);
                resolver.cleanup(() => {
                    logEvent(err, "start", "CLEANUP");
                    pm2.disconnect();
                });
                resolver.onCancelled(() => {
                    logEvent(err, "start", "CANCELLED");
                    pm2.disconnect();
                });
                cmds.forEach((cmd) => {
                    let errs = [];
                    pm2.start({
                        // options...
                    },
                    (err) => {
                        if (err) {
                            logEvent(err, "start", "ERROR");
                            errs.push(err);
                        }
                        logEvent(cmd, "start", "OK");
                        return pm2.disconnect();
                    });
                });
                // How to handle partial sets?
                // resolve(errs) || reject(errs)?
                errs.length > 0 ? resolver.resolve(errs) : resolver.resolve("OK");
            });
        }
    )
};