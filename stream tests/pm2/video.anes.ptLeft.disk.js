/*jslint es6*/
const {exec} = require("child_process");

const addr = "rtsp://192.168.1.201:554/axis-media/media.amp?streamprofile=Quality";
const date = new Date();
const prefix = "~/ffmpeg-webm/";

const cmd = prefix + "ffmpeg -y -f rtsp -rtsp_transport tcp -r 25 -i " + addr + " -c:v libvpx-vp9 -b:v 2M -pix_fmt yuv420p -threads 2 ~/anes-video-201-1280x720_" + date.getTime() + ".webm";

exec(cmd);