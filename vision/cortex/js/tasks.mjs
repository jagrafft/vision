/*jslint es6*/
// import pm2 from "pm2";
// import R from "ramda";
// import Result from "folktale/result";
import Task from "folktale/concurrency/task";
// import xs from "xstream";
// import WS from "ws";

/**
 * Retry `task`, fail after `n` attempts.
 * @param {Folktale<Task>} task `Folktale<Task>` to retry.
 * @param {number} n Number of attempts to make before declaring failure.
 * @returns {Folktale<Task>}
 */
// export const retry = (task, n) => {};

/**
 * Send message to WebSocket client.
 * @param {WebSocket<Client>} ws WebSocket object representing client.
 * @param {string} msg Stringified JSON conforming to *vision* specification.
 * @returns {Folktale<Task>}
 */
export const wsSend = (ws, msg) => {
    return Task.task(
        (resolver) => {
            resolver.cleanup(() => {
                // log
                console.log(`LOG: wsSend() cleanup`);
            });
            resolver.onCancelled(() => {
                // log
                console.log("LOG: wsSend() cancelled");
            });
            resolver.resolve(ws.send(msg));
        },
    );
};