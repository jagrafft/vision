/*jslint es6*/
const {exec} = require("child_process");

console.log("gst.video.anes.201.disk.js start");

const name = "ANES_201";
const width = 1280;
const height = 720;
const addr = "rtsp://192.168.1.201:554/axis-media/media.amp?profile=Quality";
const outfile = `${process.cwd()}/testRecs/${Date.now()}-${name}-${width}x${height}.mp4`;

const cmd = `gst-launch -e rtspsrc location="${addr}" ! rtph264depay ! video/x-h264,width=${width},height=${height} ! avdec_h264 ! queue ! x264enc ! mp4mux ! filesink location=${outfile}`;

console.log(cmd);
exec(cmd);

process.on("SIGINT", () => {
    setTimeout(() => {
        process.exit(0);
    }, 1200);
});
