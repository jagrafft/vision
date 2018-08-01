/*jslint es6*/
import Datastore from "nedb";
import moment from "moment";
import Result from "folktale/result";
import WS from "ws";

import {nefind} from "./db";
import settings from "./resources/settings.json";

/**
 * `WebSocket.Server` object
 * @const {WebSocket<Server>}
 */
const wss = new WS.Server({
    maxPayload: 20480,  // 20kb
    port: 12131
});

/**
 * Persistent NeDB datastore with automatic loading
 * @const {NeDB<Datastore>}
 */
const db = new Datastore({filename: `./${settings.defaults.db}/cortex.db`, autoload: true});

/**
 * Vets client request packets, invoking methods for those recognized and returning some type of result. **Very likely to be refactored.**
 * @param {JSON} json Client request packet
 * @param {WebSocket<Client>} client WebSocket object representing the client
 * @returns {Folktale<Result>} `Error || Ok` *NOT YET IMPLEMENTED*
 */
function vetmsg(json, client) {
    const ws = client;
    switch (json.req) {
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

/**
 * WebSocket connection handler.
 */
wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        const json = JSON.parse(msg);
        console.log(json);
        const res = vetmsg(json, ws);

        if (res !== null) {
            ws.send(JSON.stringify({
                req: json.req,
                res: res
            }));
        }
    });
});

/**
 * `setInterval` method to push status updates to clients. **Very likely to be refactored.**
 */
setInterval(() => {
    wss.clients.forEach((c) => {
        c.send(JSON.stringify({
            req: "status",
            res: moment().format("X")
        }));
    });
}, 5000);
