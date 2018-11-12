import Task from "folktale/concurrency/task";

import {logEvent} from "./logger";

/**
 * Monad for NeDB `find` operation
 * @param {NeDB<Datastore>} db Datastore to query
 * @param {Object} qry NeDB query to execute
 * @returns {Folktale<Task>}
 */
export function neFind(db, qry) {
    return Task.task(
        (resolver) => {
            resolver.cleanup(() => {
                logEvent(qry, "neFind", "CLEANUP").run();
            });

            resolver.onCancelled(() => {
                logEvent(qry, "neFind", "CANCELLED").run();
            });

            db.find(qry).sort({dataType: 1}).exec((err, res) => {
                err ? resolver.reject(err) : resolver.resolve(res);
            });
        }
    );
}

/**
 * Monad for NeDB `insert` operation
 * @param {NeDB<Datastore>} db Datastore for insertion
 * @param obj Object for insertion
 * @returns {Folktale<Task>}
 */
export function neInsert(db, obj) {
    return Task.task(
        (resolver) => {
            resolver.cleanup(() => {
                logEvent(obj, "neInsert", "CLEANUP").run();
            });

            resolver.onCancelled(() => {
                logEvent(obj, "neInsert", "CANCELLED").run();
            });

            db.insert(obj, (err, res) => {
                err ? resolver.reject(err) : resolver.resolve(res);
            })
        }
    );
}

/**
 * Monad for NeDB `remove` operation
 * @param {NeDB<Datastore>} db Datastore for removal
 * @param {Object} qry NeDB query to for object to be removed
 * @returns {Folktale<Task>}
 */
export function neRemove(db, qry) {
    return Task.task(
        (resolver) => {
            resolver.cleanup(() => {
                logEvent(qry, "neRemove", "CLEANUP").run();
            });

            resolver.onCancelled(() => {
                logEvent(qry, "neRemove", "CANCELLED").run();
            });

            db.remove(qry, {multi: true}, (err, n) => {
                err ? resolver.reject(err) : resolver.resolve(n);
            })
        }
    );
}

/**
 * Monad for NeDB `update` operation
 * @param {NeDB<Datastore>} db Datastore to update
 * @param qry NeDB query for object to be updated
 * @param obj Object for update
 * @returns {Folktale<Task>}
 */
export function neUpdate(db, qry, obj) {
    return Task.task(
        (resolver) => {
            resolver.cleanup(() => {
                logEvent(qry, "neUpdate", "CLEANUP").run();
            });

            resolver.onCancelled(() => {
                logEvent(qry, "neUpdate", "CLEANUP").run();
            });

            db.update(qry, obj, {multi: true, upsert: false, returnUpdatedDocs: true}, (err, n) => {
                (err) ? resolver.reject(err) : resolver.resolve(n);
            });
        }
    );
}