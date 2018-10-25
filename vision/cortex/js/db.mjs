/*jslint es6*/
import Task from "folktale/concurrency/task";

import "../../neurons/group";
import {logEvent} from "./logger";
import {prune} from "../../neurons/packet";

/**
 * Perform NeDB `find` operation inside a `Folktale<Task>` monad
 * @param {NeDB<Datastore>} db Datastore to query
 * @param {JSON} qry Query that conforms to *vision* specification for `find`
 * @returns {Folktale<Task>}
 */
export function find(db, qry) {
    return Task.task(
        (resolver) => {
            resolver.cleanup(() => {
                logEvent(qry, "find", "CLEANUP");
            });
            resolver.onCancelled(() => {
                logEvent(qry, "find", "CANCELLED");
            });
            db.find(qry).sort({dataType: 1}).exec((err, res) => {
                err ? resolver.reject(err) : resolver.resolve(prune(res).groupByKey("dataType"));
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
/**
 * Insert or update ("upsert") `obj` into `db` based on the results of `qry`
 * @param {NeDB<Datastore>} db Datastore to query
 * @param qry Query that conforms to *vision* specification for `find`
 * @param obj Object to insert or update
 * @returns {Folktale<Task>}
 */
export function upsert(db, qry, obj) {
    return Task.task(
        (resolver) => {
            resolver.cleanup(() => {
                logEvent(qry, "upsert", "CLEANUP");
            });
            resolver.onCancelled(() => {
                logEvent(qry, "upsert", "CLEANUP");
            });
            db.update(qry, obj, {multi: true, upsert: true, returnUpdatedDocs: true}, (err, n, doc, up) => {
                (err) ? resolver.reject(err) : resolver.resolve({upsert: up, n: n, docs: doc});
            });
        }
    );
}