#!/bin/sh

# Builds and installs GStreamer $GST_RELEASE.x
# Targeted for and tested on Ubuntu 16.04 LTS
# last updated 14.02.2108

if [ `id -u` -ne 0 ] ; then
    echo "MUST run as root."
    exit 1
else
    BUILD_DIR="$HOME/gstreamer-build"
    GST_RELEASE=1.12
    NUM_PROCS=`getconf _NPROCESSORS_ONLN`

    BUILD_DEPS='
        alsa-base
        autoconf
        automake
        autopoint
        bison
        flex
        g++
        gettext
        git
        gtk-doc-tools
        libglib2.0-dev
        liborc-dev
        libtool
        libxext-dev
        make
        pkg-config
        pulseaudio
    '

    PLUGINS='
        libasound2-dev
        libogg-dev
        libopus-dev
        libpulse-dev
        libvorbis-dev
        libvpx-dev
    '

    # INSTALL system upgrades, dependencies
	apt update
	apt upgrade --yes --no-install-recommends
	apt install --yes --no-install-recommends $BUILD_DEPS $PLUGINS

    mkdir $BUILD_DIR
    cd $BUILD_DIR

    # BUILD gstreamer
    git clone https://github.com/GStreamer/gstreamer.git
    cd gstreamer/
    checkout $GST_RELEASE
    sh autogen.sh
    make -j $NUM_PROCS
    make install
    cd plugins/
    make install
    export LD_LIBRARY_CONFIG=$LD_LIBRARY_CONFIG:/usr/local/lib
    
    cd $BUILD_DIR

    # BUILD gst-plugins-base
    git clone https://github.com/GStreamer/gst-plugins-base.git
    cd gst-plugins-base/
    checkout $GST_RELEASE
    sh autogen.sh
    make -j $NUM_PROCS
    make install

    cd $BUILD_DIR

    # BUILD gst-plugins-good
    git clone https://github.com/GStreamer/gst-plugins-good.git
    cd gst-plugins-good/
    checkout $GST_RELEASE
    sh autogen.sh
    make -j $NUM_PROCS
    make install

    ln -s /usr/local/bin/gst-device-monitor-1.0 /usr/local/bin/gst-device-monitor
    ln -s /usr/local/bin/gst-discoverer-1.0 /usr/local/bin/gst-discoverer
    ln -s /usr/local/bin/gst-inspect-1.0 /usr/local/bin/gst-inspect
    ln -s /usr/local/bin/gst-launch-1.0 /usr/local/bin/gst-launch
    ln -s /usr/local/bin/gst-play-1.0 /usr/local/bin/gst-play
    ln -s /usr/local/bin/gst-stats-1.0 /usr/local/bin/gst-stats
    ln -s /usr/local/bin/gst-typefind-1.0 /usr/local/bin/gst-typefind
fi