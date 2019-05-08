import tape from "tape";
import WebSocket from "ws";

import settings from "./settings.json";

const ws = (addr) => {
    return new Promise((resolve, reject) => {
        const server = new WebSocket(addr);
        server.on("error", (err) => reject(err));
        server.on("open", () => resolve(server));
    })
};

const wsSend = (server, msg) => {
    return new Promise((resolve, reject) => {
        server.send(msg);
        server.on("error", (err) => reject(err));
        server.on("message", (x) => resolve(x));
    }).finally(() => server.close());
};

ws(settings.addrs.cortex)
    .then((server) => wsSend(server, JSON.stringify({key: "devices", req: "find", val: "group"})))
    .then((x) => console.log(x));

// Test 1
// tape("check devices in NeDB", (f) => {});

// Test 2
// tape("", (f) => {});