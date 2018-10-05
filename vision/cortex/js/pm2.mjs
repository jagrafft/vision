/*jslint es6*/
import moment from "moment";
import pm2 from "pm2";
import Task from "folktale/concurrency/task";

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
                    // log
                    console.log("LOG: pm2List() cleanup");
                    pm2.disconnect();
                });
                resolver.onCancelled(() => {
                    // log
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