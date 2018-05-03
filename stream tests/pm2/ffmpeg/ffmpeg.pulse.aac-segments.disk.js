/*jslint es6*/
const {exec} = require("child_process");

const name = "ANES_1f.3";
const bitrate = 96;
const device = "alsa_input.pci-0000_00_1f.3.analog-stereo";
const segment_duration = "1"; // s

const outfile = `${process.cwd()}/testRecs/%03d_${name}-${bitrate}k.m4a`;

const cmd = `ffmpeg -thread_queue_size 512 -f pulse -sample_rate 48k -channels 2 -frame_size 2 -i "${device}" -c:a libfdk_aac -b:a ${bitrate}k -vn -f segment -segment_time ${segment_duration} "${outfile}"`;

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
