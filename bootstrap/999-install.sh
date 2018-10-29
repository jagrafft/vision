if [ `id -u` -ne 0 ]; then
    echo "Must run as root"
    exit 1
else
    sources=( "FFmpeg" "gstreamer" "gst-plugins-base" "gst-plugins-good" "gst-plugins-bad" "gst-plugins-ugly" )
    
    for src in ${sources[@]}
    do
        cd ${src}
        make install
        cd ..
    done
fi
