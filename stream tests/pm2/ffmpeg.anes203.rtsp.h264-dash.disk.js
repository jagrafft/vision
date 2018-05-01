/*jslint es6*/
const {exec} = require("child_process");

const name = "ANES_201";
const width = 1280;
const height = 720;
const addr = "rtsp://192.168.1.203:554/axis-media/media.amp?profile=Quality";
const bitrate_v = 312;

const outfile = `${process.cwd()}/testRecs/${Date.now()}-${name}-${width}x${height}.mp4`;

const cmd = ``;

exec(cmd, { maxBuffer: 134217728 }, (error, stdout, stderr) => {
    if (error) {
        console.error(error);
    }
    console.log(cmd);
    console.log(stdout);
    console.error(stderr);
});

process.on("SIGINT", () => {
    setTimeout(() => {
        process.exit(0);
    }, 1200);
});