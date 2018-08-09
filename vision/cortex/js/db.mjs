/*jslint es6*/
import R from "ramda";
import Task from "folktale/concurrency/task";

import "../../ray/group";
import {prune, reply} from "../../ray/packet";

/**
 * Perform NeDB `find` operation inside a `Folktale<Task>` monad.
 * @param {NeDB<Datastore>} db Datastore to query.
 * @param {JSON} json JSON packet which conforms to *vision* specifications.
 * @param {WebSocket<Client>} client WebSocket client to send result to.
 */
export function nefind(db, json, client) {
    return Task.task(
        (resolver) => {
            db.find(json.val).sort({dataType: 1}).exec((err, res) => {
                const _rep = R.partial(reply, [json.val.group]);
                const _res = (err) ? _rep(err, "ERROR") : _rep(prune(res).groupByKey("dataType"), "OK");

                resolver.resolve(client.send(_res));
            });
        }
    );
}

// export function neinsert(db, req, ws) {
//     return Task.task(
//         (resolver) => {
//             db.insert(req.val, (err, res) => {
//                const _res = visionReply(req.req, (err) ? err : res);
//                resolver.resolve(ws.send(_res));
//             });
//         }
//     );
// }

// export function neremove(db, req, ws) {
//     return Task.task(
//         (resolver) => {
//             db.remove(req.val, (err, n) => {
//                 const _res = (err) ? err : `removed ${n}`;
//                 resolver.resolve(ws.send(_res));
//             })
//         }
//     );
// }

// export function neupdate(db, req, ws) {
//     return Task.task(
//         (resolver) => {
//             db.update();
//         }
//     );
// }