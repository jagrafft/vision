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
 * Update `obj` in `db` based on the results of `qry`
 * @param {NeDB<Datastore>} db Datastore to query
 * @param qry Query that conforms to *vision* specification for `find`
 * @param obj Object to insert or update
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