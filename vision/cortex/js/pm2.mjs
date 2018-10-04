/*jslint es6*/
import moment from "moment";
import pm2 from "pm2";
import Result from "folktale/result";
import Task from "folktale/concurrency/task";

/**
 * List *vision* processes managed by PM2.
 * @returns {Folktale<Task>}
 */
export const pm2list = () => {
    return Task.task(
        (resolver) => {
            pm2.connect((err) => {
                if (err) resolver.resolve(Result.Error(err));
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
                // log
                pm2.list((err, pdl) => {
                    if (err) resolver.resolve(Result.Error(err));
                    const l = pdl.map((p) => {
                        return {
                            id: p.pm_id,
                            name: p.name,
                            status: p.pm2_env.status,
                            created: p.pm2_env.created_at,
                            uptime: moment(p.pm2_env.created_at).fromNow(),
                            restarts: p.pm2_env.restart_time
                        }
                    });
                    console.log("list");
                    resolver.resolve(l);
                })
            });
        }
    );
};