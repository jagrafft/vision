
ffmpeg -y -i video0.webm -c:v libvpx-vp9 -pix_fmt yuv420p -s 1280x720 -b:v 250k -keyint_min 150 -g 150 -tile-columns 4 -frame-parallel 1 -an -f webm -dash 1 video.webm

ffmpeg -y -i audio0.webm -c:a libopus -b:a 96k -vn -f webm -dash 1 audio.web

ffmpeg -y -f webm_dash_manifest -i foot.webm -f webm_dash_manifest -i audio.webm -c copy -map 0 -map 1 -f webm_dash_manifest -adaptation_sets "id=0,streams=0 id=1,streams=1" manifest.mpd
