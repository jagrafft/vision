/*jslint es6*/
import Datastore from "nedb";
import moment from "moment";
import Task from "folktale/concurrency/task";
import WS from "ws";

import {find} from "./db";
import {logEvent} from "./logger";
import {pm2list} from "./pm2";
import {reply} from "../../neurons/packet";
import settings from "./resources/settings.json";

/**
 * Global datastore for *vision*
 * @const {NeDB<Datastore>}
 */
export const db = new Datastore({filename: `./${settings.defaults.db}/cortex.db`, autoload: true});

/**
 * WebSocket Server for Cortex
 * @const {WebSocket<Server>}
 */
const wss = new WS.Server({
    maxPayload: 20480,  // 20kb
    port: 12131
});

/**
 * Send message to WebSocket client
 * @param {WebSocket<Client>} ws WebSocket object representing client
 * @param {string} msg Stringified JSON conforming to *vision* specification
 * @returns {Folktale<Task>}
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
 * Vets request packets by switching on `json.req`, invoking methods for those recognized and returning some type of result
 * @param {JSON} json Request packet conforming to *vision* specification
 * @returns {Folktale<Task>}
 */
const vetPacket = (json) => {
    switch (json.req) {
    case "find":
        return find(db, json.val);
    case "insert":
        return Task.rejected("Request not yet implemented");
    case "record":
        return Task.rejected("Request not yet implemented");
    case "remove":
        return Task.rejected("Request not yet implemented");
    case "status":
        return Task.of(moment().format("X"));
    case "update":
        return Task.rejected("Request not yet implemented");
    default:
        return Task.rejected("Key not recognized");
    }
};

/**
 * WebSocket Server connection handler
 * @function wss.on
 */
wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        const json = JSON.parse(msg);
        logEvent(json, "request", "parsed").run();
        const res = vetPacket(json).run();

        // TODO Refactor and abstract
        res.listen({
            onCancelled: () => {
                console.log("Canceled, yo")
                const rep = reply(json.key, {}, "CANCELED");
                logEvent(rep, "reply", "canceled").run();
                wsSend(ws, rep).run();
            },
            onRejected: (v) => {
                console.log(`Rejected, yo: ${v}`);
                const rep = reply(json.key, v, "ERROR");
                logEvent(rep, "reply", "rejected").run();
                wsSend(ws, rep).run();
            },
            onResolved: (v) => {
                console.log(`Value, yo: ${v}`);
                const rep = reply(json.key, v, "OK");
                logEvent(rep, "reply", "success").run();
                wsSend(ws, rep).run();
            }
        });
    });
});

/**
 * Pushes PM2 status updates to clients
 * @function setInterval
 */
setInterval(() => {
    const status = pm2list().run();
    // TODO onCancelled and onRejected should do something
    status.listen({
        onCancelled: () => {
            console.log("auto-tick update cancelled");
        },
        onRejected: (v) => {
            console.log(`auto-tick update rejected: ${v}`);
        },
        onResolved: (v) => {
            console.log(`auto-tick update resolved: ${v}`);
            const rep = reply("status", JSON.stringify(v), "OK");
            logEvent(rep, "auto-status", "success");
            wss.clients.forEach((c) => wsSend(c, rep).run());
        }
    });
}, 5000);