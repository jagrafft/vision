/*jslint es6*/
const {exec} = require("child_process");

const name = "ANES_1f.3";
const bitrate = 96000;
const device = "alsa_input.pci-0000_00_1f.3.analog-stereo";

const outfile = `${process.cwd()}/testRecs/${Date.now()}-${name}-${bitrate}k.m4a`;

const cmd = `gst-launch-1.0 pulsesrc device="${device}" ! audioconvert ! audio/x-raw,format=S16LE,rate=48000,channels=2 ! avenc_aac bitrate=${bitrate} ! mp4mux ! filesink location="${outfile}"`;

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
