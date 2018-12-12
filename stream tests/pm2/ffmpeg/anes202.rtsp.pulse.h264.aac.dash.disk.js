/*jslint es6*/
const {exec} = require("child_process");

const addr = "rtsp://192.168.1.202:554/axis-media/media.amp?profile=Quality";
const device = "alsa_input.pci-0000_00_1f.3.analog-stereo";
const bitrate_a = 96;

const segment_duration = 2;

const cmd = `ffmpeg -y -hide_banner -thread_queue_size 1024 -rtsp_transport tcp -f rtsp -r 25 -i "${addr}" -thread_queue_size 512 -f pulse -sample_rate 48k -channels 2 -i "${device}" -c:a libfdk_aac -b:a ${bitrate_a}k -keyint_min 30 -g 30 -seg_duration 2 -remove_at_exit 0 -use_template 0 -use_timeline 1 -streaming 0 -index_correction 0 -hls_playlist 0 -f dash manifest.mpd`;

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