/*jslint es6*/
const {exec} = require("child_process");

const addr = "";
const date = new Date();
const prefix = "~/ffmpeg-webm/";

const cmd = prefix + "ffmpeg -y -f ... -i " + addr + " -s 1280x720 -c:v libvpx-vp9 -b:v 2M -pix_fmt yuv420p -threads 2 ~/anes-video-decklink-1280x720_" + date.getTime() + ".webm";

exec(cmd);