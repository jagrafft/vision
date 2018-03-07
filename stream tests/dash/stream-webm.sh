#!/bin/bash

L

# Video Only
#ffmpeg -thread_queue_size 512 -f mjpeg -r 25 -i http://192.168.1.201/mjpg/1/video.mjpg -map 0:0 -c:v libvpx-vp9 -pix_fmt yuv420p -keyint_min 15 -g 30 ${VP9_LIVE_PARAMS} -b:v 300k -f webm_chunk -header "/var/www/html/dash/anes_video_100.hdr" -chunk_start_index 1 /var/www/html/dash/anes_video_100_%d.chk
#ffmpeg -thread_queue_size 512 -f rtsp -rtsp_transport tcp -r 15 -i rtsp://192.168.1.201:554/axis-media/media.amp?streamprofile=Streaming -map 0:0 -c:v libvpx-vp9 -pix_fmt yuv420p -s 640x360 -keyint_min 15 -g 30 ${VP9_LIVE_PARAMS} -b:v 300k -f webm_chunk -header "/var/www/html/dash/anes_video_100.hdr" -chunk_start_index 1 /var/www/html/dash/anes_video_100_%d.chk

# Audio and Video
#ffmpeg -thread_queue_size 512 -f mjpeg -r 25 -i http://192.168.1.201/mjpg/1/video.mjpg -thread_queue_size 2048 -f alsa -i pulse -map 0:0 -c:v libvpx-vp9 -pix_fmt yuv420p -s 640x360 -keyint_min 15 -g 30 ${VP9_LIVE_PARAMS} -b:v 150k -f webm_chunk -header "/var/www/html/dash/anes_video_100.hdr" -chunk_start_index 1 /var/www/html/dash/anes_video_100_%d.chk -map 1:0 -c:a libopus -b:a 16k -f webm_chunk -audio_chunk_duration 1500 -header /var/www/html/dash/anes_audio_100.hdr -chunk_start_index 1 /var/www/html/dash/anes_audio_100_%d.chk

## Produces audio and video chunks at same rate
ffmpeg -thread_queue_size 512 -f rtsp -rtsp_transport tcp -r 15 -i rtsp://192.168.1.201:554/axis-media/media.amp?streamprofile=Streaming -thread_queue_size 1024 -f alsa -i pulse -map 0:0 -c:v libvpx-vp9 -pix_fmt yuv420p -keyint_min 15 -g 15 ${VP9_LIVE_PARAMS} -b:v 300k -f webm_chunk -header "/var/www/html/dash/anes_video_100.hdr" -chunk_start_index 1 /var/www/html/dash/anes_video_100_%d.chk -map 1:0 -c:a libopus -b:a 12k -f webm_chunk -audio_chunk_duration 1000 -header /var/www/html/dash/anes_audio_100.hdr -chunk_start_index 1 /var/www/html/dash/anes_audio_100_%d.chk

### Least lag so far (~ <= 3sec), still no audio
ffmpeg -thread_queue_size 512 -f mjpeg -r 25 -i http://192.168.1.201/mjpg/1/video.mjpg -thread_queue_size 2048 -f alsa -i pulse -map 0:0 -c:v libvpx-vp9 -pix_fmt yuv420p -keyint_min 60 -g 60 ${VP9_LIVE_PARAMS} -b:v 300k -f webm_chunk -header "/var/www/html/dash/anes_video_100.hdr" -chunk_start_index 1 /var/www/html/dash/anes_video_100_%d.chk -map 1:0 -c:a libopus -b:a 12k -f webm_chunk -audio_chunk_duration 2000 -header /var/www/html/dash/anes_audio_100.hdr -chunk_start_index 1 /var/www/html/dash/anes_audio_100_%d.chk
