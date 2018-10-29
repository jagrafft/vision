if [ `id -u` -ne 0 ]; then
    echo "Must run as root"
    exit 1
else
    apt install --yes libass-dev libfdk-aac1 libfdk-aac-dev libflac-dev libfreetype6-dev libmp3lame0 libmp3lame-dev libopus0 libopus-dev libpulse-dev libsdl1.2-dev libva-dev libvdpau-dev libvorbis-dev libvpx5 libvpx-dev libx264-152 libx264-dev libx265-146 libx265-dev
fi