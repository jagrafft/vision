/*jslint es6*/
const {exec} = require("child_process");

const name = "ANES_201";
const width = 1280;
const height = 720;
const addr = "rtsp://192.168.1.201:554/axis-media/media.amp?profile=Quality";
const outfile = `${process.cwd()}/testRecs/${Date.now()}-${name}-${width}x${height}.mp4`;

const cmd = `ffmpeg -y -thread_queue_size 1024 -rtsp_transport tcp -f rtsp -r 30 -i "${addr}" -c:v libx264 -an -f mp4 "${outfile}"`;

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