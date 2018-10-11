if [[ `id -u` -ne 0 ]]; then
    git clone https://github.com/FFmpeg/FFmpeg.git
    git clone https://github.com/GStreamer/gstreamer.git
    git clone https://github.com/GStreamer/gst-plugins-base.git
    git clone https://github.com/GStreamer/gst-plugins-bad.git
    git clone https://github.com/GStreamer/gst-plugins-good.git
    git clone https://github.com/GStreamer/gst-plugins-ugly.git

    cd ./FFmpeg/
    git checkout release/4.0
    ./configure \
        --enable-gpl \
        --enable-libass \
        --enable-libfdk-aac \
        --enable-libfreetype \
        --enable-libmp3lame \
        --enable-libopus \
        --enable-libvorbis \
        --enable-libvpx \
        --enable-libx264 \
        --enable-libx265 \
        --enable-nonfree
    make -j 8
    cd ..

    cd ./gstreamer/
    git checkout 1.14
    make clean
    make distclean
    sh autogen.sh
    make -j8

    cd ..

    cd ./gst-plugins-base/
    git checkout 1.14
    make clean
    make distclean
    sh autogen.sh
    make -j8

    cd ..

    cd ./gst-plugins-good/
    git checkout 1.14
    make clean
    make distclean
    sh autogen.sh
    make -j8

    cd ..

    cd ./gst-plugins-bad
    git checkout 1.14
    make clean
    make distclean
    sh autogen.sh
    make -j 8
    
    cd ..

    cd ./gst-plugins-ugly/
    git checkout 1.14
    make clean
    make distclean
    sh autogen.sh
    make -j 8
else
    echo "Must not run as root"
    exit 1
fi