# FFmpeg CLI Command Tests
- last update 15.02.2018

## No conflicts or grossly obvious interrupts
ffmpeg -f alsa -i pulse -c:a libopus -b:a 16k pulse-test_0.opus // 5 simueltaneous feeds // no pipes

ffmpeg -y -loglevel panic -f rtsp -rtsp_transport tcp -r 15 -i rtsp://192.168.1.201:554/axis-media/media.amp?streamprofile=Streaming -f webm -g 25 -c:v libvpx-vp9 -crf 35 -b:v 0 test_0.webm | \
ffmpeg -y -loglevel panic -f rtsp -rtsp_transport tcp -r 15 -i rtsp://192.168.1.201:554/axis-media/media.amp?streamprofile=Streaming -f webm -g 25 -c:v libvpx-vp9 -crf 35 -b:v 0 test_1.webm | \
ffmpeg -y -loglevel panic -f rtsp -rtsp_transport tcp -r 15 -i rtsp://192.168.1.201:554/axis-media/media.amp?streamprofile=Streaming -f webm -g 25 -c:v libvpx-vp9 -crf 35 -b:v 0 test_2.webm | \
ffmpeg -f alsa -i pulse -c:a libopus -b:a 16k pulse-test_0.opus | \
ffmpeg -f alsa -i pulse -c:a libopus -b:a 16k pulse-test_1.opus | \
ffmpeg -f alsa -i pulse -c:a libopus -b:a 16k pulse-test_2.opus
