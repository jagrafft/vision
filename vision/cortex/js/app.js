/*jslint es6*/
"use strict";

const Datastore = require("nedb");
const filters = require("./filters");
const moment = require("moment");
const path = require("path");
// const record = require("./record");
const WebSocket = require("ws");

const settings = require("./resources/settings.json");

const wss = new WebSocket.Server({port: 12131});

const p = path.join(__dirname, "..", settings.defaults.db);
const db = new Datastore({filename: `${p}/cortex-ne.db`, autoload: true});

wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        const json = JSON.parse(msg);
        console.log(`(wss) msg = ${msg}`);
        switch (json.req) {
            // case "create": return "NOT ALLOWED";
            // case "detele": return "NOT ALLOWED";
            // case "update": return "NOT ALLOWED";
            case "queryDevices":
                db.find(json.val, (err, res) => {
                    if (err) console.error(err);

                    ws.send(JSON.stringify({
                        req: json.req,
                        res: filters.devices(res)
                    }));
                });
                break;
            // case "queryRecords": return "NOT YET IMPLEMENTED";
            // case "record": return "NOT YET IMPLEMENTED";
            // case "stop": return "NOT YET IMPLEMENTED";
            default: return "NOT RECOGNIZED";
        }
    });
});

// Feeds back PM2 status
setInterval(() => {
    wss.clients.forEach((client) => {
        client.send(JSON.stringify({ w00t: moment().format("X") }));
    });
}, 5000);