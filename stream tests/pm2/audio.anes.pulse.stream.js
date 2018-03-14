/*jslint es6*/
const cmd = 'gst-launch';
const args = ['pulsesrc', 'device="alsa_input.pci-0000_00_1f.3.analog-stereo"', 'volume=7',
    '!', 'audio/x-raw,rate=48000,channels=1',
    '!', 'opusenc', 'bitrate=64000', 'bitrate-type=vbr', 'complexity=2',
    '!', 'queue', 'leaky=1',
    '!', 'webmmux', 'name=m', 'streamable=true',
    '!', 'queue', 'leaky=1',
    '!', 'tcpserversink', 'host=127.0.0.1', 'port=12001', 'sync-method=2'];

const child = require('child_process');
const gstreamer = child.spawn(cmd, args, {stdio: 'inherit'});

gstreamer.on('exit', function (code) {
    if (code != null) {
        console.log('GStreamer error, exit code ' + code);
    }
    process.exit();
});

const express = require('express')
const app = express();
const http = require('http')
const httpServer = http.createServer(app);

app.get('/', function (req, res) {
    let date = new Date();

    res.writeHead(200, {
        'Date': date.toUTCString(),
        'Connection': 'close',
        'Cache-Control': 'private',
        'Content-Type': 'audio/webm;codecs=opus',
        'Server': 'vision-streamer/0.0.1',
    });

    const net = require('net');
    const socket = net.connect(12001, function () {
        socket.on('close', function (had_error) {
            res.end();
        });
        socket.on('data', function (data) {
            res.write(data);
        });
    });
    socket.on('error', function (error) {
        console.log(error);
    });
});

httpServer.listen(12000);