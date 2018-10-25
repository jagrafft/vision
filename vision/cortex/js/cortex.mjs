/*jslint es6*/
import Datastore from "nedb";
import moment from "moment";
import Task from "folktale/concurrency/task";
import WS from "ws";

import {createDir} from "./misc";
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
                logEvent(msg, "wsSend", "CLEANUP");
            });
            resolver.onCancelled(() => {
                logEvent(msg, "wsSend", "CANCELLED");
            });
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
        const obj = {};
        obj[json.val] = json.key;
        return find(db, obj);
    case "insert":
        return Task.rejected("Request not yet implemented");
    case "record":
        switch (json.key) {
        case "start":
            const created = moment().format("YYYY-MM-DD_HHmmss");
            const pth = `${settings.defaults.outputDir}/${json.val.label.replace(/ /g, "_")}-${created}`;
            // TODO createDir crashes on same directory
            createDir(`${pth}/logs`).run();
            return find(db, { _id: { $in: json.val.ids }});
        case "stop":
            // json.val.ids holds **PM2** identifiers
            return Task.rejected("Request not yet implemented");
        default:
            return Task.rejected("Key not recognized")
        }
    case "remove":
        return Task.rejected("Request not yet implemented");
    case "status":
        return Task.of(moment().format("X"));
    case "update":
        return Task.rejected("Request not yet implemented");
    default:
        return Task.rejected("Request not recognized");
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
                const rep = reply(json.key, {}, "CANCELED");
                logEvent(rep, "reply", "CANCELED").run();
                wsSend(ws, rep).run();
            },
            onRejected: (v) => {
                const rep = reply(json.key, v, "ERROR");
                logEvent(rep, "reply", "REJECTED").run();
                wsSend(ws, rep).run();
            },
            onResolved: (v) => {
                const rep = reply(json.key, v, "OK");
                logEvent(rep, "reply", "OK").run();
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
        onCancelled: (v) => {
            logEvent(v, "autoStatus", "CANCELLED");
        },
        onRejected: (v) => {
            logEvent(v, "autoStatus", "REJECTED");
        },
        onResolved: (v) => {
            const rep = reply("status", JSON.stringify(v), "OK");
            logEvent(rep, "autoStatus", "OK");
            wss.clients.forEach((c) => wsSend(c, rep).run());
        }
    });
}, 5000);