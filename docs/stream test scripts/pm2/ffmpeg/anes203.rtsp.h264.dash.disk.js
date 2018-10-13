/*jslint es6*/
const {exec} = require("child_process");

const name = "ANES_203";
const addr = "rtsp://192.168.1.203:554/axis-media/media.amp?profile=Quality";
const segment_duration = 2;

const cmd = `mkdir ${name}; cd ${name}; ffmpeg -y -hide_banner -thread_queue_size 1024 -rtsp_transport tcp -f rtsp -r 25 -i "${addr}" -keyint_min 30 -g 30 -an -seg_duration ${segment_duration} -remove_at_exit 0 -use_template 0 -use_timeline 1 -streaming 0 -index_correction 0 -hls_playlist 0 -f dash manifest.mpd`;

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