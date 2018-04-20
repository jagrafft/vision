/*jslint es6*/
const {exec} = require("child_process");

const device = "alsa_input.pci-0000_00_1f.3.analog-stereo";

const cmd = `gst-launch-1.0 pulsesrc device="${device}" ! audioconvert ! audio/x-raw,format=S16LE,rate=48000,channels=2 ! pulsesink`;

exec(cmd);