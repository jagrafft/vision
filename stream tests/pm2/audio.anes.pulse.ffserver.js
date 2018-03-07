/*jslint es6 */
const {exec} = require("child_process");

exec("ffmpeg -f alsa -i pulse http://localhost:13000/audio0.ffm");