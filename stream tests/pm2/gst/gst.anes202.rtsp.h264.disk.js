/*jslint es6*/
const {exec} = require("child_process");

const name = "ANES_201";
const width = 1280;
const height = 720;
const addr = "rtsp://192.168.1.201:554/axis-media/media.amp?profile=Quality";
const outfile = `${process.cwd()}/testRecs/${Date.now()}-${name}-${width}x${height}.mp4`;

const cmd = `gst-launch-1.0 -e rtspsrc timeout=10 drop_on_latency=TRUE location="${addr}" ! queue ! rtph264depay ! video/x-h264,width=1280,height=720,framerate=25/1 ! h264parse ! mp4mux ! filesink location="${outfile}"`;

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
