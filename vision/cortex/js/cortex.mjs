/*jslint es6*/
import Datastore from "nedb";
import moment from "moment";
import Result from "folktale/result";
import Task from "folktale/concurrency/task";
import WS from "ws";

import {nefind} from "./db";
import settings from "./resources/settings.json";
import {reply} from "../../ray/packet";

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
 * @param {WebSocket<Client>} ws WebSocket object representing the client
 * @returns {Folktale<Result>} `Error || Ok`
 */
function vetmsg(json, ws) {
    switch (json.req) {
    case "find":
        return new Result.Ok(nefind(db, json, ws));
    case "insert":
        return new Result.Error("NOT YET IMPLEMENTED");
    case "remove":
        return new Result.Error("NOT YET IMPLEMENTED");
    case "start":
        return new Result.Error("NOT YET IMPLEMENTED");
    case "status":
        return new Result.Ok(Task.task((resolver) => resolver.resolve(ws.send(reply(json.req, moment().format("X"), "OK")))));
    case "stop":
        return new Result.Error("NOT YET IMPLEMENTED");
    case "update":
        return new Result.Error("NOT YET IMPLEMENTED");
    default:
        return new Result.Error(`request "${json.req}" not recognized`);
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
        // const rep = R.partial(reply, [json.req]);

        res.matchWith({
            Ok:     ({ value }) => value.run(), //ws.send(reply(..., ..., "OK"))
            Error:  ({ value }) => ws.send(reply(json.req, value, "ERROR"))
        });
    });
});

/**
 * `setInterval` method to push status updates to clients. **Very likely to be refactored.**
 */
setInterval(() => {
    wss.clients.forEach((c) => c.send(reply("status", moment().format("X"), "OK")));
}, 5000);