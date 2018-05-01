## Segments
### RTSP
ffmpeg -y -hide_banner -thread_queue_size 1024 -rtsp_transport tcp -f rtsp -r 30 -i "rtsp://192.168.1.201:554/axis-media/media.amp?profile=Quality" -c:v libx264 -preset veryfast -tune zerolatency -b:v 312k -maxrate 312k -bufsize 156k -keyint_min 60 -g 60 -an -f segment -segment_time 2 "anes201-%03d.mp4"

### RTSP + PULSE
ffmpeg -y -hide_banner -thread_queue_size 1024 -rtsp_transport tcp -f rtsp -r 30 -i "rtsp://192.168.1.201:554/axis-media/media.amp?profile=Quality" -c:v libx264 -preset veryfast -tune zerolatency -b:v 312k -maxrate 312k -bufsize 156k -keyint_min 60 -g 60 -an -f segment -segment_time 2 "anes201-%03d.mp4" | ffmpeg -y -hide_banner -thread_queue_size 512 -f pulse -sample_rate 48k -channels 2 -frame_size 2 -i "alsa_input.pci-0000_00_1f.3.analog-stereo" -c:a libfdk_aac -b:a 96k -keyint_min 60 -g 60 -an -f segment -segment_time 2 "audio-%03d.m4a"

## DASH Manifest
ffmpeg -y -hide_banner -thread_queue_size 1024 -rtsp_transport tcp -f rtsp -r 30 -i "rtsp://192.168.1.201:554/axis-media/media.amp?profile=Quality" -c:v libx264 -preset veryfast -tune zerolatency -b:v 312k -maxrate 312k -bufsize 156k -keyint_min 150 -g 150 -an -window_size 5 -use_timeline 0 -use_template 1 -adaptation_sets "id=0,streams=v" -f dash w00t.mpd

## WebM
ffmpeg -y -i video0.webm -c:v libvpx-vp9 -pix_fmt yuv420p -s 1280x720 -b:v 250k -keyint_min 150 -g 150 -tile-columns 4 -frame-parallel 1 -an -f webm -dash 1 video.webm

ffmpeg -y -i audio0.webm -c:a libopus -b:a 96k -vn -f webm -dash 1 audio.webm

ffmpeg -y -f webm_dash_manifest -i foot.webm -f webm_dash_manifest -i audio.webm -c copy -map 0 -map 1 -f webm_dash_manifest -adaptation_sets "id=0,streams=0 id=1,streams=1" manifest.mpd