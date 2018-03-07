#!/bin/bash

# Video Only
#ffmpeg -y -f webm_dash_manifest -live 1 -i /var/www/html/dash/anes_video_100.hdr -c copy -map 0 -f webm_dash_manifest -live 1 -adaptation_sets "id=0,streams=0" -chunk_start_index 1 -time_shift_buffer_depth 3600 -minimum_update_period 3600 /var/www/html/dash/dash_anes.mpd

# Audio and Video
ffmpeg -y -f webm_dash_manifest -live 1 -i /var/www/html/dash/anes_video_100.hdr -f webm_dash_manifest -live 1 -i /var/www/html/dash/anes_audio_100.hdr -c copy -map 0 -map 1 -f webm_dash_manifest -live 1 -adaptation_sets "id=0,streams=0 id=1,streams=1" -chunk_start_index 1 -chunk_duration_ms 1000 -time_shift_buffer_depth 3600 -minimum_update_period 3600 /var/www/html/dash/dash_anes.mpd

# MJPEG
ffmpeg -y -f webm_dash_manifest -live 1 -i /var/www/html/dash/anes_video_100.hdr -f webm_dash_manifest -live 1 -i /var/www/html/dash/anes_audio_100.hdr -c copy -map 0 -map 1 -f webm_dash_manifest -live 1 -adaptation_sets "id=0,streams=0 id=1,streams=1" -chunk_start_index 1 -chunk_duration_ms 2000 -time_shift_buffer_depth 3600 -minimum_update_period 3600 /var/www/html/dash/dash_anes.mpd