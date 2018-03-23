/*jslint es6*/
const {exec} = require("child_process");

const date = new Date();
const device = "alsa_input.pci-0000_00_1f.3.analog-stereo";
const prefix = "/home/simportal-tech/ffmpeg-webm/";

const cmd = prefix + "ffmpeg -y -f pulse -i " + device + " -c:a libopus -b:a 96k -g 150 -f webm ~/anes-audio-96k_" + date.getTime() + ".webm";

exec(cmd);
