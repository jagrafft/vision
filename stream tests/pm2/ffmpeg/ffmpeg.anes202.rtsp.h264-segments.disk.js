/*jslint es6*/
const {exec} = require("child_process");

const name = "ANES_202";
const width = 1280;
const height = 720;
const segment_duration = "1"; // s

const addr = "rtsp://192.168.1.202:554/axis-media/media.amp?profile=Quality";
const outfile = `${process.cwd()}/testRecs/%03d_${name}-${width}x${height}.mp4`;

const cmd = `ffmpeg -y -hide_banner -thread_queue_size 1024 -rtsp_transport tcp -f rtsp -r 30 -i "${addr}" -c:v libx264 -preset veryfast -tune zerolatency -g 60 -an -f segment -segment_time ${segment_duration} "${outfile}"`;

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