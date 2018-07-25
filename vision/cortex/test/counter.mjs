/*jslint es6*/
import {exec} from "child_process";

const cmd =``;

exec(cmd, { maxBuffer: 134217728 }, (err, stdout, stderr) => {
    if (err) {
        console.err(err);
    }
    console.log(cmd);
    console.log(stdout);
    console.err(stderr);
});

process.on("SIGINT", () => {
    process.exit(0);
});