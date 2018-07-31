/*jslint es6*/
import Datastore from "nedb";
import moment from "moment";
import WS from "ws";

import {nefind} from "./db";
import settings from "./resources/settings.json";

/**
 * @type {}
 * @const
 */
const wss = new WS.Server({
    maxPayload: 20480,  // 20kb
    port: 12131
});

/**
 * @type {}
 * @const
 */
const db = new Datastore({filename: `./${settings.defaults.db}/cortex.db`, autoload: true});

wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        function vet(req) {
            switch (req) {
            case "find":
                nefind(db, json, ws).run();
                return null;
            case "insert":
                return "NOT YET IMPLEMENTED";
            case "status":
                return `status~~~! ${Date.now()}`;
            case "remove":
                return "NOT YET IMPLEMENTED";
            case "start":
                return "NOT YET IMPLEMENTED";
            case "stop":
                return "NOT YET IMPLEMENTED";
            case "update":
                return "NOT YET IMPLEMENTED";
            default:
                return `${json.req} not recognized`;
            }
        }

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
