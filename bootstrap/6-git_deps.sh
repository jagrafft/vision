if [ `id -u` -ne 0 ]; then  
    git clone https://github.com/FFmpeg/FFmpeg.git
    cd FFmpeg/
    git checkout release/4.0
    cd ..

    sources=( "gstreamer" "gst-plugins-base" "gst-plugins-good" "gst-plugins-bad" "gst-plugins-ugly" )
    for src in ${sources[@]}
    do
        git clone https://github.com/GStreamer/${src}.git
        cd ${src}
        git checkout 1.14
        cd ..
    done
    cd ..
else
    echo "Must NOT run as root"
    exit 1
fi

# sh autoget.sh > ../${src}.config.txt

# ./configure --enable-gpl --enable-libass --enable-libfdk-aac --enable-libfreetype --enable-libmp3lame --enable-libopus --enable-libvorbis --enable-libvpx --enable-libx264 --enable-libx265 --enable-nonfree > ../FFmpeg.config.txt
