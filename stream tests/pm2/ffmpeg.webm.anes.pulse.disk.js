/*jslint es6*/
const {exec} = require("child_process");

const device = "alsa_input.pci-0000_00_1f.3.analog-stereo";

const cmd = "ffmpeg -y -f pulse -i " + device + " -c:a libopus -b:a 96k -f webm ~/anes-audio-96k_" + date + ".webm";


exec(cmd);
