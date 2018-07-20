/*jslint es6*/
"use strict";
import {adapt} from '@cycle/run/lib/adapt';
import xs from "xstream";

export const makeWSdriver = () => {
    const ws = new WebSocket("ws://localhost:12131");

    const wsDriver = (out_) => {
        out_.addListener({
            next: (o) => {
                // ws.send(o);
                console.log(o);
            },
            error: (e) => {console.error(e)},
            complete: () => {
                console.log("out_ complete");
            }
        });

        const in_ = xs.create({
            start: listener => {
                ws.onmessage = (msg) => {
                    const j = JSON.parse(msg.data);
                    listener.next(j);
                };
            },
            stop: () => {
                ws.close();
            }
        });
        return adapt(in_);
    };
    return wsDriver;
};