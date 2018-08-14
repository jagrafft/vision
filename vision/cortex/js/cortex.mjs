/*jslint es6*/
import Datastore from "nedb";
import moment from "moment";
import Result from "folktale/result";
import Task from "folktale/concurrency/task";
import WS from "ws";

import {reply} from "../../ray/packet";
import {find} from "./db";
import settings from "./resources/settings.json";

/**
 * Persistent NeDB datastore with automatic loading.
 * @const {NeDB<Datastore>}
 */
export const db = new Datastore({filename: `./${settings.defaults.db}/cortex.db`, autoload: true});

/**
 * WebSocket Server for Cortex.
 * @const {WebSocket<Server>}
 */
const wss = new WS.Server({
    maxPayload: 20480,  // 20kb
    port: 12131
});

/**
 * WebSocket connection handler. Passes incoming messages to `vetmsg`.
 */
wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        const json = JSON.parse(msg);
        console.log(json);
        const res = vetmsg(json, ws);

        res.matchWith({
            // Ok:     ({ value }) => ws.send(reply(json.key, value, "OK")),
            // Error:  ({ value }) => ws.send(reply(json.key, value, "ERROR"))
            Ok:     ({ value }) => value.run(),
            Error:  ({ value }) => ws.send(reply(json.req, value, "ERROR"))
        });
    });
});

/**
 * Pushes PM2 status updates to clients. **REFACTOR LIKELY**
 * @function setInterval
 */
setInterval(() => {
    wss.clients.forEach((c) => c.send(reply("status", moment().format("X"), "OK")));
}, 5000);

/**
 * Vets client request packets by switching on `json.req`, invoking methods for those recognized and returning some type of result.
 * @param {JSON} json Client request packet conforming to *vision* specification.
 * @param {WebSocket<Client>} ws WebSocket object representing the client **DEPRECATION LIKELY**
 * @returns {(Folktale<Result.Error<string>> | Folktale<Result.Ok<string>>)}
 */
// function vetmsg(json) {
function vetmsg(json, ws) {
    switch (json.req) {
    case "find":
        // return find(db, json.val);
        return new Result.Ok(find(db, json.val, ws));
    case "insert":
        return new Result.Error("Request not yet implemented");
    case "remove":
        return new Result.Error("Request not yet implemented");
    case "start":
        return new Result.Error("Request not yet implemented");
    case "status":
        // return new Result.Ok(Task.of(moment().format("X")));
        return new Result.Ok(Task.of(ws.send(reply(json.req, moment().format("X"), "OK"))));
    case "stop":
        return new Result.Error("Request not yet implemented");
    case "update":
        return new Result.Error("Request not yet implemented");
    default:
        return new Result.Error(`request "${json.req}" not recognized`);
    }
}