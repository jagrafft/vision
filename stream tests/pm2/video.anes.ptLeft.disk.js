/*jslint es6*/
const {exec} = require("child_process");

const addr = "rtsp://192.168.1.201:554/axis-media/media.amp?streamprofile=Balanced";
const date = new Date();
const prefix = "~/ffmpeg-webm/";

const cmd = "ffmpeg -y -thread_queue_size 2048 -f rtsp -rtsp_transport tcp -r 15 -i " + addr + " -c:v libvpx-vp9 -pix_fmt yuv420p -keyint_min 150 -g 150 -f webm -threads 2 ~/anes-video-201-1280x720_" + date.getTime() + ".webm";

exec(cmd);
