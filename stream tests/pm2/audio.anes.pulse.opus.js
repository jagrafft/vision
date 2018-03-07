/*jslint es6 */
const {exec} = require("child_process");

exec("ffmpeg -y -f alsa -i pulse -c:a libopus -b:a 16k pulse.opus");
