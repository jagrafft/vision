import Datastore from "nedb";
import Task from "folktale/concurrency/task";
import WS from "ws";

import "../../neurons/group";
import {createDir, newSession, pairSources} from "./misc";
import {logEvent} from "./logger";
import {neFind, neInsert} from "./db";
import {pm2list, pm2opts, pm2start} from "./pm2";
import {prune, reply} from "../../neurons/packet";
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
                logEvent(msg, "wsSend", "CANCELLED").run();
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
        return Task.task((resolver) => {
            let obj = {};
            obj[json.val] = json.key;
            resolver.resolve(obj);
        }).chain((obj) => {
            return neFind(db, obj);
        }).chain((res) => {
            return Task.of(prune(res).groupByKey("dataType"));
        });
    case "insert":
        return Task.rejected("Request not yet implemented");
    case "record":
        switch (json.key) {
        case "start":
            return Task.task((resolver) => {
                resolver.resolve(
                    newSession(
                        json.val.label.trim().replace(/\s\s+/g, " "),
                        json.val.ids,
                        "INITIATED"
                    )
                );
            }).chain((obj) => {
                return Task.waitAll([
                    // TODO Reduce return values for `createDir` to two (2)
                    // TODO Move createDir? (to accommodate subdirectories)
                    createDir(`${obj.path}/${settings.defaults.logDir}`),               // 0: {err, EXISTS, OK}
                    neFind(db, {_id: {$in: json.val.ids}}),                             // 1: array of objects
                    neInsert(db, obj)                                                   // 2: inserted object(s)
                ]);
            }).chain((arr) => {
                if (arr[0] == "OK") {
                    // TODO Implement handler assignment (passed by monocle)
                    // TODO Check to see if default handler dataTypes are appropriate for given device (PM2 param creation?)
                    // TODO Make change if not (PM2 param creation?)
                    // TODO Refactor to n -> m pairing (!video/audio...)
                    // TODO create directories for devices matching `handler.dataType` where `handler.multiFile` is `true`

                    const handler = "http-live-stream.mjs";
                    const dType = settings.handlers[handler].dataType;
                    
                    const locGroup = arr[1].groupByKey("location");
                    const [single, paired] = Object.keys(locGroup)
                        .reduce((a,c) => {
                            const grp = locGroup[c].groupByKey("dataType");
                            ((x) => x[0] && x[1])(dType.map((x) => x in grp)) ? a[1].push(locGroup[c]) : a[0].push(locGroup[c]);
                            return a;
                        }, [[], []])
                        .map((x) => x.flat());

                    const pairs = paired.groupByKey("dataType");

                    const pm2procs = (typeof(pairs.video) !== "undefined" ? pairs.video.reduce((a,c,i) => {
                        const l = pairs.audio.length;
                        a.push([i > l ? pairs.audio[i] : pairs.audio[l - 1], c]);
                        return a;
                    }, []) : []).concat(single);

                    return Task.of([
                        arr[0],
                        pm2procs,
                        arr[2]
                    ]);
                    // return Task.waitAll(tasks);
                } else {
                    return Task.rejected(arr[0]);
                }
            });
        case "stop":
            // json.val.ids holds **PM2** identifiers
            return Task.rejected("Request not yet implemented");
        default:
            return Task.rejected("Key not recognized");
        }
    case "remove":
        return Task.rejected("Request not yet implemented");
    case "status":
        return Task.of("STATUS, YO!");
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
        logEvent(json, "request", "RECEIVED").run();
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
            logEvent(v, "autoStatus", "CANCELLED").run();
        },
        onRejected: (v) => {
            logEvent(v, "autoStatus", "REJECTED").run();
        },
        onResolved: (v) => {
            const rep = reply("status", JSON.stringify(v), "OK");
            // logEvent(rep, "autoStatus", "OK").run();
            wss.clients.forEach((c) => wsSend(c, rep).run());
        }
    });
}, 5000);