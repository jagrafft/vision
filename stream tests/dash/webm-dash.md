# WebM DASH
- last update 16.02.2018
- [Instructions to do WebM live streaming via DASH](http://wiki.webmproject.org/adaptive-streaming/instructions-to-do-webm-live-streaming-via-dash)

## Create Streams
`export VP9_LIVE_PARAMS="-speed 6 -tile-columns 4 -frame-parallel 1 -threads 8 -static-thresh 0 -max-intra-rate 300 -deadline realtime -lag-in-frames 0 -error-resilient 1"`

```bash
ffmpeg \
  -thread_queue_size 2048 \
  -f rtsp -rtsp_transport tcp -r 15 -i rtsp://192.168.1.201:554/axis-media/media.amp?streamprofile=Streaming \
  -f alsa -i pulse \
  -map 0:0 \
  -pix_fmt yuv420p \
  -c:v libvpx-vp9 \
    -keyint_min 60 -g 60 ${VP9_LIVE_PARAMS} \
    -b:v 300k \
  -f webm_chunk \
    -header "/var/www/html/dash/glass_360.hdr" \
    -chunk_start_index 1 \
  /var/www/html/dash/glass_360_%d.chk \
  -map 1:0 \
  -c:a libopus \
    -b:a 16k \
  -f webm_chunk \
    -audio_chunk_duration 2000 \
    -header /var/www/html/dash/glass_171.hdr \
    -chunk_start_index 1 \
  /var/www/html/dash/glass_171_%d.chk
```

ffmpeg -f rtsp -i rtsp://192.168.1.201:554/axis-media/media.amp?streamprofile=Streaming -f alsa -i pulse -map 0:0 -pix_fmt yuv420p -c:v libvpx-vp9 -keyint_min 60 -g 60 ${VP9_LIVE_PARAMS} -b:v 3000k -f webm_chunk -header "/var/www/html/dash/anes_video_100.hdr" -chunk_start_index 1 /var/www/html/dash/anes_video_100_%d.chk -map 1:0 -c:a libopus -b:a 16k -f webm_chunk -audio_chunk_duration 2000 -header /var/www/html/dash/anes_audio_100.hdr -chunk_start_index 1 /var/www/html/dash/anes_audio_100_%d.chk

## Create Manifest
ffmpeg \
  -y \
  -f webm_dash_manifest -live 1 \
  -i /var/www/html/dash/glass_360.hdr \
  -f webm_dash_manifest -live 1 \
  -i /var/www/html/dash/glass_171.hdr \
  -c copy \
  -map 0 -map 1 \
  -f webm_dash_manifest -live 1 \
    -adaptation_sets "id=0,streams=0 id=1,streams=1" \
    -chunk_start_index 1 \
    -chunk_duration_ms 2000 \
    -time_shift_buffer_depth 7200 \
    -minimum_update_period 7200 \
  /var/www/html/dash/dash.mpd

ffmpeg -y -f webm_dash_manifest -live 1 -i /var/www/html/dash/anes_video_100.hdr -f webm_dash_manifest -live 1 -i /var/www/html/dash/anes_audio_100.hdr -c copy -map 0 -map 1 -f webm_dash_manifest -live 1 -adaptation_sets "id=0,streams=0 id=1,streams=1" -chunk_start_index 1 -chunk_duration_ms 2000 -time_shift_buffer_depth 7200 -minimum_update_period 7200 /var/www/html/dash/dash_anes.mpd
