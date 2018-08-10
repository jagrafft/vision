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
 * Persistent NeDB datastore with automatic loading
 * @const {NeDB<Datastore>}
 */
export const db = new Datastore({filename: `./${settings.defaults.db}/cortex.db`, autoload: true});

/**
 * `WebSocket.Server` object
 * @const {WebSocket<Server>}
 */
const wss = new WS.Server({
    maxPayload: 20480,  // 20kb
    port: 12131
});

/**
 * @const Folktale<Task>
 */
// const wsIO = (ws) => Task.task((resolver) => {
    
// });

/**
 * WebSocket connection handler.
 */
wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        const json = JSON.parse(msg);
        console.log(json);
        const res = vetmsg(json, ws);

        res.matchWith({
            Ok:     ({ value }) => value.run(),
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

/**
 * Vets client request packets, invoking methods for those recognized and returning some type of result. **Very likely to be refactored.**
 * @param {JSON} json Client request packet
 * @param {WebSocket<Client>} ws WebSocket object representing the client
 * @returns {Folktale<Result.Error<..?>> || Folktale<Result.Ok<Folktale<Task>>>} `Error<..?> || Ok<Task>`
 */
// function vetmsg(json) {
function vetmsg(json, ws) {
    switch (json.req) {
    case "find":
        // return new Result.Ok(find(db, json.val));
        return new Result.Ok(find(db, json, ws));
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