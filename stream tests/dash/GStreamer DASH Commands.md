## Single File
### H.264
gst-launch-1.0 -e rtspsrc timeout=5 location="rtsp://vision:simportal99@192.168.0.231:554/cam/realmonitor?channel=1&subtype=0" ! rtph264depay ! video/x-h264,width=1280,height=720,framerate=25/1 ! queue ! avdec_h264 ! queue ! x264enc key-int-max=60 speed-preset=veryfast tune=zerolatency ! queue ! h264parse ! queue ! mp4mux ! filesink location="203-1280x720.mp4"

### AAC (test)
// device="alsa_input.pci-0000_00_1f.3.analog-stereo"
gst-launch-1.0 pulsesrc ! audioconvert ! audio/x-raw,format=S16LE,rate=48000,channels=2 ! queue ! fdkaacenc bitrate=96000 ! queue ! aacparse ! queue ! mp4mux ! filesink location="pulse-96k.m4a"

## Segments
### H.264
gst-launch-1.0 -e rtspsrc timeout=5 location="rtsp://vision:simportal99@192.168.0.231:554/cam/realmonitor?channel=1&subtype=0" ! rtph264depay ! video/x-h264,width=1280,height=720,framerate=25/1 ! queue ! avdec_h264 ! queue ! x264enc key-int-max=60 speed-preset=veryfast tune=zerolatency ! queue ! h264parse ! queue ! splitmuxsink max-size-time=1000000000 muxer=mp4mux location="%03d_203-1280x720.mp4"

### AAC (test)
// device="alsa_input.pci-0000_00_1f.3.analog-stereo"
gst-launch-1.0 pulsesrc ! audioconvert ! audio/x-raw,format=S16LE,rate=48000,channels=2 ! queue ! fdkaacenc bitrate=96000 ! queue ! aacparse ! queue ! splitmuxsink max-size-time=1000000000 muxer=mp4mux location="%03d_pulse.m4a"