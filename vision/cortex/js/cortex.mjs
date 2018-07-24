/*jslint es6*/
import Datastore from "nedb";
import moment from "moment";
import Task from "folktale/concurrency/task";
import WS from "ws";

import settings from "./resources/settings.json";

const wss = new WS.Server({
    maxPayload: 20480,  // 20kb
    port: 12131
});

const devices = new Datastore({filename: `./${settings.defaults.db}/devices.db`, autoload: true});

function groupBy(arr, k) {
    return arr.reduce((g, ob) => {
        const v = ob[k];
        if (typeof g[v] === "undefined") g[v] = [];
        g[v].push(ob);
        return g;
    }, {});
};

function query(db, req, ws) {
    Task.task(
        (resolver) => {
            db.find(req.val, (err, res) => {
                if (err) console.error(err);
                resolver.resolve(
                    ws.send(JSON.stringify({
                        req: req.req,
                        res: groupBy(prune(res), "dataType")
                    })
                )
            )});
        }
    );
}

function prune(o) {
    const m = o.map((x) => {
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
    return m;
}

wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        function vet(req) {
            switch (req) {
                case "create":
                    return "NOT ALLOWED";
                case "data":
                    return "NOT YET IMPLEMENTED";
                case "delete":
                    return "NOT ALLOWED";
                case "devices":
                    query(devices, json, ws).run();
                    return null;
                case "status":
                    return `status~~~! ${Date.now()}`;
                case "record":
                    return "NOT YET IMPLEMENTED";
                case "stop":
                    return "NOT YET IMPLEMENTED";
                case "update":
                    return "NOT ALLOWED";
                default:
                    return `${json.req} not recognized`;
            }
        };

        const json = JSON.parse(msg);
        console.log(json);
        const res = vet(json.req);

        if (res !== null) {
            ws.send(JSON.stringify({
                req: json.req,
                res: res
            }));
        }
    });
});

// Feeds back PM2 status
setInterval(() => {
    wss.clients.forEach((c) => {
        c.send(JSON.stringify({req: "status", res: moment().format("X")}));
    });
}, 5000);
