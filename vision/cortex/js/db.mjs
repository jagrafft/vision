/*jslint es6*/
import Task from "folktale/concurrency/task";

/**
 * Group object by key.
 * @param {string} k Key to group by.
 * @returns {Object<Object>}
 */
Array.prototype.groupBy = function(k) {
    return this.reduce((g, ob) => {
        const v = ob[k];
        if (typeof g[v] === "undefined") g[v] = [];
        g[v].push(ob);
        return g;
    }, {});
}

/**
 * Returns JSON packet which conforms to *vision* specifications.
 * @param {string} req Client request.
 * @param {*} res Result of operation performed at client's request. *Should be JSON serializable.*
 * @returns {string} Stringified JSON packet.
 */
const visionReply = (req, res) => JSON.stringify({req: req, res: res});

/**
 * Strip array of objects returned by NeDB operation of key-value pairs used only by Cortex.
 * @param {Array<Object>} arr Array of objects containing results of an NeDB operation.
 */
function pruneNeRes(arr) {
    return arr.map((x) => {
        let r = {
            id: x._id,
            dataType: x.dataType,
            label: x.label,
            location: x.location
        };

        if (typeof x.stream !== "undefined") {
            r.stream = {
                address: x.address,
                path: x.stream.path,
                protocol: x.stream.protocol
            };
        }
        return r;
    });
}

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
                const _res = visionReply(json.val.group, (err) ? err : pruneNeRes(res).groupBy("dataType"));
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