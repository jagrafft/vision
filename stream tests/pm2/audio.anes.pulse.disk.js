/*jslint es6*/
const {exec} = require("child_process");

//const date = new Date();
const device = "alsa_input.pci-0000_00_1f.3.analog-stereo";
const prefix = "/home/simportal-tech/ffmpeg-webm/";

// WebM Opus
//const cmd = prefix + "ffmpeg -y -f pulse -i " + device + " -c:a libopus -b:a 96k -f webm ~/anes-audio-96k_" + date + ".webm";

// WebM DASH
//const cmd = prefix + "ffmpeg -y -f pulse -i " + device + " -c:a libopus -b:a 96k -vn -f webm -dash 1 ~/anes-audio-96k_" + date + ".webm";
const cmd = prefix + "ffmpeg -y -f pulse -i " + device + " -c:a libopus -b:a 96k -vn -f webm -dash 1 audio.webm";

exec(cmd);
//console.log(cmd);