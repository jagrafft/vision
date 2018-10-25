/*jslint es6*/
import Task from "folktale/concurrency/task";

import "../../neurons/group";
import {logEvent} from "./logger";

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
                err ? resolver.reject(err) : resolver.resolve(res);
            });
        }
    );
}

export function insert(db, obj) {
    return Task.task(
        (resolver) => {
            resolver.cleanup(() => {
                logEvent(obj, "insert", "CLEANUP");
            });
            resolver.onCancelled(() => {
                logEvent(obj, "insert", "CANCELLED");
            });
            db.insert(obj, (err, res) => {
                err ? resolver.reject(err) : resolver.resolve(res);
            })
        }
    );
}

export function remove(db, qry) {
    return Task.task(
        (resolver) => {
            resolver.cleanup(() => {
                logEvent(qry, "insert", "CLEANUP");
            });
            resolver.onCancelled(() => {
                logEvent(qry, "insert", "CANCELLED");
            });
            // `query` provided by req
            db.remove(qry, {multi: true}, (err, n) => {
                err ? resolver.reject(err) : resolver.resolve(n);
            })
        }
    );
}

/**
 * Update `obj` in `db` based on the results of `qry`
 * @param {NeDB<Datastore>} db Datastore to query
 * @param qry Query that conforms to *vision* specification for `find`
 * @param obj Object to insert or update
 * @returns {Folktale<Task>}
 */
export function update(db, qry, obj) {
    return Task.task(
        (resolver) => {
            resolver.cleanup(() => {
                logEvent(qry, "upsert", "CLEANUP");
            });
            resolver.onCancelled(() => {
                logEvent(qry, "upsert", "CLEANUP");
            });
            db.update(qry, obj, {multi: true, upsert: false, returnUpdatedDocs: true}, (err, n) => {
                (err) ? resolver.reject(err) : resolver.resolve(n);
            });
        }
    );
}