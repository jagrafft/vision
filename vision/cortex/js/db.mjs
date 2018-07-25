/*jslint es6*/
import Task from "folktale/concurrency/task";

Array.prototype.groupBy = function(k) {
    return this.reduce((g, ob) => {
        const v = ob[k];
        if (typeof g[v] === "undefined") g[v] = [];
        g[v].push(ob);
        return g;
    }, {});
}

const jstr = (req, res) => JSON.stringify({req: req, res: prune(res).groupBy("dataType")});

function prune(o) {
    return o.map((x) => {
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

export function find(db, req, ws) {
    return Task.task(
        (resolver) => {
            db.find(req.val).sort({dataType: 1}).exec((err, res) => {
                const _res = jstr(req.val.group, (err) ? err : res);
                resolver.resolve(ws.send(_res));
            });
        }
    );
}

// export function insert(db, req, ws) {
//     return Task.task(
//         (resolver) => {
//             db.insert(req.val, (err, res) => {
//                const _res = jstr(req.req, (err) ? err : res);
//                resolver.resolve(ws.send(_res));
//             });
//         }
//     );
// }

// export function remove(db, req, ws) {
//     return Task.task(
//         (resolver) => {
//             db.remove(req.val, (err, n) => {
//                 const _res = (err) ? err : `removed ${n}`;
//                 resolver.resolve(ws.send(_res));
//             })
//         }
//     );
// }

// export function update(db, req, ws) {
//     return Task.task(
//         (resolver) => {
//             db.update();
//         }
//     );
// }