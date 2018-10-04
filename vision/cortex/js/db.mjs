/*jslint es6*/
// import Result from "folktale/result";
import Task from "folktale/concurrency/task";

import "../../ray/group";
import {prune} from "../../ray/packet";

/**
 * Perform NeDB `find` operation inside a `Folktale<Task>` monad.
 * @param {NeDB<Datastore>} db Datastore to query.
 * @param {JSON} qry Query that conforms to *vision* specification for `find`.
 * @returns {Folktale<Task>}
 */
export function find(db, qry) {
    return Task.task(
        (resolver) => {
            db.find(qry).sort({dataType: 1}).exec((err, res) => {
                (err) ? Task.rejected(err) : resolver.resolve(prune(res).groupByKey("dataType"));
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

// Insert && Update => upsert: true
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