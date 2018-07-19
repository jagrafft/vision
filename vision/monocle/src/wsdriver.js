/*jslint es6*/
"use strict";
import xs from "xstream";

export const wsDriver = () => {
    return xs.create({
        start: listener => {
            const ws = new WebSocket("ws://localhost:12131");

            ws.onerror = (err) => {
                listener.error(err)
            }

            ws.onmessage = (msg) => {
                const j = JSON.parse(msg.data);
                listener.next(j)
            }

            ws.onopen = () => {
                ws.send(JSON.stringify({
                    req: "queryDevices",
                    val: {}
                }))
            }
        },
        stop: () => {
            this.ws.close();
        }
    });
};