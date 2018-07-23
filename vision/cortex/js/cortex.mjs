/*jslint es6*/

import Datastore from "nedb";
import moment from "moment";
import WS from "ws";

import filters from "./filters";
// import record from "./record":
import settings from "./resources/settings.json";

const wss = new WS.Server({
    maxPayload: 20480,  // 20kb
    port: 12131
});

const db = new Datastore({filename: `./${settings.defaults.db}/cortex-ne.db`, autoload: true});

wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        const vet = (c) => {
            switch (c) {
                // case "connect":
                    // return "OK";
                case "create":
                    return "NOT ALLOWED";
                case "delete":
                    return "NOT ALLOWED";
                case "devices":
                    db.find(json.val, (err, res) => {
                        if (err) console.error(err);
                        ws.send(JSON.stringify({
                            id: json.id,
                            req: json.req,
                            res: filters.devices(res)
                        }));
                    });
                    return null;
                case "status":
                    return `status~~~! ${Date.now()}`;
                case "record":
                    return "NOT YET IMPLEMENTED";
                case "recordings":
                    return "NOT YET IMPLEMENTED";
                case "status":
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