/*jslint es6*/
import moment from "moment";
import pm2 from "pm2";
import Task from "folktale/concurrency/task";

import {logEvent} from "./logger";
import settings from "./resources/settings.json";

/**
 * Monad for PM2 delete
 * @param {String} id PM2 id to delete
 * @returns {Folktale<Task>}
 */
export const pm2delete = (id) => {
    return Task.task(
        (resolver) => {
            pm2.connect((err) => {
                if (err) resolver.reject(err);

                resolver.cleanup(() => {
                    logEvent(err, "pm2delete", "CLEANUP").run();
                    pm2.disconnect();
                });

                resolver.onCancelled(() => {
                    logEvent(err, "pm2delete", "CANCELLED").run();
                    pm2.disconnect();
                });

                pm2.delete(id, (err) => {
                    if (err) {
                        logEvent(err, "pm2delete", "ERROR").run();
                        resolver.reject(err);
                    }
                    logEvent(id, "pm2delete", "OK").run();
                    resolver.resolve("OK");
                });
            });
        }
    )
};

/**
 * Monad for PM2 list
 * @returns {Folktale<Task>}
 */
export const pm2list = () => {
    return Task.task(
        (resolver) => {
            pm2.connect((err) => {
                if (err) resolver.reject(err);

                resolver.cleanup(() => {
                    if (settings.defaults.verbose) logEvent(err, "pm2list", "CLEANUP").run();
                    pm2.disconnect();
                });

                resolver.onCancelled(() => {
                    logEvent(err, "pm2list", "CANCELLED").run();
                    pm2.disconnect();
                });

                pm2.list((err, pdl) => {
                    if (err) {
                        logEvent(err, "pm2list", "ERROR").run();
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
 * Monad for PM2 start
 * @param {Object} params PM2 parameters for process
 * @returns {Folktale<Task>}
 */
export const pm2start = (opts) => {
    return Task.task(
        (resolver) => {
            pm2.connect((err) => {
                if (err) resolver.reject(err);

                resolver.cleanup(() => {
                    logEvent(err, "pm2start", "CLEANUP").run();
                    pm2.disconnect();
                });

                resolver.onCancelled(() => {
                    logEvent(err, "pm2start", "CANCELLED").run();
                    pm2.disconnect();
                });

                pm2.start(params, (err) => {
                    if (err) {
                        logEvent(err, "pm2start", "ERROR").run();
                        resolver.reject("ERROR");
                    }
                    logEvent(cmd, "pm2start", "OK").run();
                    resolver.resolve("OK");
                });
            });
        }
    )
};