# GStreamer CLI Command Tests
- last update 15.02.2018

## No conflicts or grossly obvious interrupts
gst-launch -e rtspsrc location=rtsp://192.168.1.202:554/axis-media/media.amp?Streamprofile=Streaming ! avidemux ! avimux ! filesink location=test.avi // large files

gst-launch playbin2 uri=rtsp://192.168.1.201:554/axis-media/media.amp?Streamprofile=Streaming

## Works with errors
gst-launch -e rtspsrc location=rtsp://192.168.1.201:554/axis-media/media.amp?Streamprofile=Streaming ! rtph264depay ! avdec_h264 ! avenc_mpeg4 ! mp4mux ! filesink location=test.mp4 // PTS

## Very slow
gst-launch filesrc location=test.mp4 ! decodebin ! videoconvert ! vp8enc ! webmmux ! filesink location=test-vp8e.webm -e

## Not observed to terminate
gst-launch filesrc location=test.mp4 ! decodebin ! videoconvert ! vp9enc ! webmmux ! filesink location=test-vp9e.webm -e