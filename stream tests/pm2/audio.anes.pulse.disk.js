/*jslint es6*/
const {exec} = require("child_process");

const date = new Date();
const device = "pulse -i alsa_input.pci-0000_00_1f.3.analog-stereo";
const prefix = "~/ffmpeg-webm/";

const cmd = prefix + "ffmpeg -y -f " + device + " -filter:a \"volume=2\" -c:a libopus -b:a 96k -threads 2 ~/anes-audio-96k_" + date.getTime() + ".webm";

exec(cmd);