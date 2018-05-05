/*jslint es6*/
const {exec} = require("child_process");

const name = "ANES_203";
const width = 1280;
const height = 720;
const segment_duration = "1"; // s

const addr = "rtsp://192.168.1.203:554/axis-media/media.amp?profile=Quality";
const outfile = `${process.cwd()}/testRecs/%03d_${name}-${width}x${height}.mp4`;

const cmd = `ffmpeg -y -hide_banner -thread_queue_size 1024 -rtsp_transport tcp -f rtsp -r 30 -i "${addr}" -c:v libx264 -keyint_min 60 -g 6- -preset veryfast -tune zerolatency -an -f segment -segment_time ${segment_duration} "${outfile}"`;

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