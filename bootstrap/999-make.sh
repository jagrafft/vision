if [ `id -u` -ne 0 ]; then
    sources=( "FFmpeg" "gstreamer" "gst-plugins-base" "gst-plugins-good" "gst-plugins-bad" "gst-plugins-ugly" )
    
    for src in ${sources[@]}
    do
        cd ${src}
        make -j`nproc`
        cd ..
    done
else
    echo "Must NOT run as root"
    exit 1
fi
