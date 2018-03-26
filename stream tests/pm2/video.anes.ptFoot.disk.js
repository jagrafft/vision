/*jslint es6*/
const {exec} = require("child_process");

const addr = "rtsp://192.168.1.202:554/axis-media/media.amp?streamprofile=Balanced";
//const addr = "rtsp://192.168.1.202:554/axis-media/media.amp?streamprofile=Streaming";
//const date = new Date();
const size = "640x360";
const prefix = "/home/simportal-tech/ffmpeg-webm/";

// WebM VP9
// const cmd = prefix + "ffmpeg -y -thread_queue_size 2048 -f rtsp -rtsp_transport tcp -r 15 -i " + addr + " -pix_fmt yuv420p -c:v libvpx-vp9 -f webm ~/video0.webm";

// WebM DASH
//const cmd = prefix + "ffmpeg -y -thread_queue_size 2048 -f rtsp -rtsp_transport tcp -r 15 -i " + addr + " -c:v libvpx-vp9 -pix_fmt yuv420p -b:v 250k -s " + size + " -keyint_min 150 -g 150 -tile-columns 4 -frame-parallel 1 -an -f webm -dash 1 ~/anes-video-202_" + size + "_" + date.getTime() + ".webm";
const cmd = prefix + "ffmpeg -y -thread_queue_size 2048 -f rtsp -rtsp_transport tcp -r 15 -i " + addr + " -c:v libvpx-vp9 -pix_fmt yuv420p -b:v 250k -s " + size + " -keyint_min 150 -g 150 -tile-columns 4 -frame-parallel 1 -an -f webm -dash 1 ~/foot.webm";

exec(cmd);
//console.log(cmd);

