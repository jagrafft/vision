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
        const vet = (c) => {
            switch (c) {
                case "connect":
                    return "OK";
                case "create":
                    return "NOT ALLOWED";
                case "delete":
                    return "NOT ALLOWED";
                case "queryDevices":
                    db.find(json.val, (err, res) => {
                        if (err) console.error(err);

                        ws.send(JSON.stringify({
                            id: json.id,
                            req: json.req,
                            res: filters.devices(res)
                        }));
                    });
                    return null;
                case "queryRecords":
                    return "NOT YET IMPLEMENTED";
                case "record":
                    return "NOT YET IMPLEMENTED";
                case "status":
                    return null;
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
    wss.clients.forEach((client) => {
        client.send(JSON.stringify({ req: "status", res: moment().format("X") }));
    });
}, 5000);