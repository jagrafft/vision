/*jslint es6*/
const child = require('child_process');

const cmd = 'gst-launch';
// const args = ['pulsesrc', 'device="alsa_input.pci-0000_00_1f.3.analog-stereo"', 'volume=7',
//     '!', 'queue', 'max-size-bytes=1000000', 'max-size-time=0',
//     '!', 'audio/x-raw,format=S16LE,rate=48000,channels=1',
//     '!', 'opusenc', 'bitrate=64000', //'bitrate-type=vbr',
//     '!', 'webmmux', 'name=m', 'streamable=true',
//     '!', 'tcpserversink', 'host=127.0.0.1', 'port=12001', 'sync-method=1'];

// const args = ['pulsesrc',
//     '!', 'audioconvert',
//     '!', 'opusenc',
//     '!', 'webmmux', 'name=mux',
//     '!', 'queue',
//     '!', 'tcpserversink', 'host=127.0.0.1', 'port=12001'];

const args = ['autoaudiosrc',
'!', 'audio/x-raw,format=S16LE,rate=48000,channels=1',
'!', 'opusenc', 'bitrate=64000',
//'!', 'oggmux',
'!', 'rtpopuspay',
'!', 'udpsink', 'host=127.0.0.1', 'port=13000'];

const gstreamer = child.spawn(cmd, args, {stdio: 'inherit'});

gstreamer.on('exit', function (code) {
    if (code != null) {
        console.log('GStreamer error, exit code ' + code);
    }
    process.exit();
});
