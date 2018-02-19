#!/bin/bash

VP9_LIVE_PARAMS="-speed 6 -tile-columns 4 -frame-parallel 1 -threads 8 -static-thresh 0 -max-intra-rate 300 -deadline realtime -lag-in-frames 0 -error-resilient 1"

# Video Only
ffmpeg -thread_queue_size 512 -f rtsp -rtsp_transport tcp -r 15 -i rtsp://192.168.1.201:554/axis-media/media.amp?streamprofile=Streaming -map 0:0 -pix_fmt yuv420p -c:v libvpx-vp9 -keyint_min 15 -g 30 ${VP9_LIVE_PARAMS} -b:v 300k -f webm_chunk -header "/var/www/html/dash/anes_video_100.hdr" -chunk_start_index 1 /var/www/html/dash/anes_video_100_%d.chk

# Audio and Video
#ffmpeg -thread_queue_size 512 -f rtsp -rtsp_transport tcp -r 15 -i rtsp://192.168.1.201:554/axis-media/media.amp?streamprofile=Streaming -thread_queue_size 512 -f alsa -i pulse -map 0:0 -pix_fmt yuv420p -c:v libvpx-vp9 -keyint_min 15 -g 30 ${VP9_LIVE_PARAMS} -b:v 150k -f webm_chunk -header "/var/www/html/dash/anes_video_100.hdr" -chunk_start_index 1 /var/www/html/dash/anes_video_100_%d.chk -map 1:0 -c:a libopus -b:a 16k -f webm_chunk -audio_chunk_duration 2000 -header /var/www/html/dash/anes_audio_100.hdr -chunk_start_index 1 /var/www/html/dash/anes_audio_100_%d.chk
