/*jslint es6*/
import R from "ramda";
// import Result from "folktale/result";
import Task from "folktale/concurrency/task";

import "../../ray/group";
import {prune, reply} from "../../ray/packet";

/**
 * Perform NeDB `find` operation inside a `Folktale<Task>` monad.
 * @param {NeDB<Datastore>} db Datastore to query.
 * @param {JSON} json JSON packet which conforms to *vision* specification for `find`. **DEPRECATION LIKELY**
 * @param {JSON} qry Query that conforms to *vision* specification for `find`. **NOT YET IMPLEMENTED**
 * @param {WebSocket<Client>} client WebSocket client to send result to. **DEPRECATION LIKELY**
 * @returns {Folktale<Task>}
 */
// export function find(db, qry) {
export function find(db, json, client) {
    return Task.task(
        (resolver) => {
            // db.find(req).sort({dataType: 1}).exec((err, res) => {
            db.find(json.val).sort({dataType: 1}).exec((err, res) => {
                // (err) ? Task.rejected(err) : resolver.resolve(prune(res).groupByKey("dataType"));
                const _rep = R.partial(reply, [json.val.group]);
                const _res = (err) ? _rep(err, "ERROR") : _rep(prune(res).groupByKey("dataType"), "OK");
                resolver.resolve(client.send(_res));
            });
        }
    );
}

// export function remove(db, req) {
//     return Task.task(
//         (resolver) => {
//             // `query` provided by req
//             db.remove(query, {multi: true}, (err, n) => {
//                 resolver.resolve();
//             })
//         }
//     );
// }

// // Insert && Update(upsert: true)
// export function upsert(db, req) {
//     return Task.task(
//         (resolver) => {
//             // `query` and `update` provided by `req`
//             db.update(query, update, {multi: true, upsert: true, returnUpdatedDocs: true}, (err, n, doc, up) => {
//                 resolver.resolve()
//             });
//         }
//     );
// }