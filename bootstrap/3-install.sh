if [[ `id -u` -ne 0 ]]; then
    echo "Must run as root"
    exit 1
else
    cd ./FFmpeg/
    sudo make install

    cd ..

    cd ./gstreamer/
    sudo make install
    
    cd ..

    cd ./gst-plugins-base/
    sudo make install
    
    cd ..

    cd ./gst-plugins-good/
    sudo make install
    
    cd ..

    cd ./gst-plugins-bad/
    sudo make install
    
    cd ..

    cd ./gst-plugins-ugly/
    sudo make install
fi