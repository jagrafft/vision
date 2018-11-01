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
 * Create PM2 options `Object` from `obj`
 * @param {Object} dev Device information
 * @param {String} path File out path
 * @param {String} hand Handler for `dev`
 * @returns {Object}
 */
export const pm2opts = (dev, path, hand) => {
    // Add unique identifier to `name`? ---> `ses._id`
    const name = (dev.label || dev[dev.dataType[1]].label)
        .replace(/[!@#$%^&\*()\-=_+|;':",.\[\]{}<\\/>?']/g, " ")
        .trim()
        .replace(/\s\s+/g, " ")
        .replace(/\s/g, "_");

    // console.log(name);
    const def = settings.defaults.pm2;
    return new Object({
        name: name,
        script: hand,
        args: [
            dev,
        ],
        cwd: path,
        output: `./${path}-out.log`,
        error: `./${path}-error.log`,
        minUptime: def.minUptime,
        restartDelay: def.restartDelay,
        log_type: def.log_type,
        log_data_format: def.log_date_format,
        autorestart: def.autorestart
    });
    // return {};
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

                pm2.start(opts, (err) => {
                    if (err) {
                        logEvent(err, "pm2start", "ERROR").run();
                        resolver.reject("ERROR");
                    }
                    logEvent(opts, "pm2start", "OK").run();
                    resolver.resolve("OK");
                });
            });
        }
    )
};