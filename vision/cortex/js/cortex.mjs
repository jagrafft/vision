/*jslint es6*/
import Datastore from "nedb";
import moment from "moment";
import Result from "folktale/result";
import Task from "folktale/concurrency/task";
import WS from "ws";

import {find} from "./db";
import {pm2list} from "./pm2";
import {reply} from "../../ray/packet";
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
 * Send message to WebSocket client.
 * @param {WebSocket<Client>} ws WebSocket object representing client.
 * @param {string} msg Stringified JSON conforming to *vision* specification.
 */
export const wsSend = (ws, msg) => {
    return Task.task(
        (resolver) => {
            resolver.cleanup(() => {
                // log
                console.log("LOG: wsSend() cleanup");
            });
            resolver.onCancelled(() => {
                // log
                console.log("LOG: wsSend() cancelled");
            });
            // log
            resolver.resolve(ws.send(msg));
        }
    );
};

/**
 * Vets client request packets by switching on `json.req`, invoking methods for those recognized and returning some type of result.
 * @param {JSON} json Client request packet conforming to *vision* specification.
 * @returns {(Folktale<Result.Error<string>> | Folktale<Result.Ok<string>>)}
 */
const vetPacket = (json) => {
    switch (json.req) {
    case "find":
        return Result.Ok(find(db, json.val));
    case "insert":
        return new Result.Error("Request not yet implemented");
    case "record":
        return new Result.Error("Request not yet implemented");
    case "remove":
        return new Result.Error("Request not yet implemented");
    case "status":
        return new Result.Ok(Task.of(moment().format("X")));
    case "stop":
        return new Result.Error("Request not yet implemented");
    case "update":
        return new Result.Error("Request not yet implemented");
    default:
        return new Result.Error(`Not recognized: ${json.req}`);
    }
};

/**
 * WebSocket connection handler. Passes incoming messages to `vetPacket`.
 */
wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        const json = JSON.parse(msg);
        console.log(json);
        const res = vetPacket(json);

        res.matchWith({
            Ok: ({ value }) => value.chain((v) => wsSend(ws, reply(json.key, v, "OK"))).run(),
            Error: ({ value }) => ws.send(reply(json.key, value, "ERROR"))
        });
    });
});

/**
 * Pushes PM2 status updates to clients.
 * @function setInterval
 */
setInterval(() => {
    pm2list().run().promise().then((l) => {
        wss.clients.forEach((c) => wsSend(c, reply("status", JSON.stringify(l), "OK")).run());
    });
}, 5000);