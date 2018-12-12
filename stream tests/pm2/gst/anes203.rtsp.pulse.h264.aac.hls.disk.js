/*jslint es6*/
const {exec} = require("child_process");

const width = 1280;
const height = 720;
const device = "alsa_input.pci-0000_00_1f.3.analog-stereo";
const bitrate = "96000";
const max_files = "9000";
const duration = "1"; // seconds
const addr = "rtsp://192.168.1.203:554/axis-media/media.amp?profile=Quality";

const cmd =`gst-launch-1.0 rtspsrc location="${addr}" ! queue ! rtph264depay ! video/x-h264,width=${width},height=${height},framerate=30/1 ! h264parse ! mux. pulsesrc device="${device}" ! audioconvert ! avenc_aac bitrate=${bitrate} ! mux. mpegtsmux name=mux ! hlssink max-files=${max_files} playlist-length=${max_files} target-duration=${duration}`;

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
        exec(`echo "#EXT-X-ENDLIST" >> playlist.m3u8; sed -i '6s/$/#EXT-X-PLAYLIST-TYPE:VOD/' playlist.m3u8`);
        process.exit(0);
    }, 1200);
});