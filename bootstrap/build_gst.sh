#!/bin/sh

# Builds and installs GStreamer $GST_RELEASE.x
# Targeted for and tested on Ubuntu 16.04 LTS
# last updated 14.02.2108

if [ `id -u` -ne 0 ] ; then
    echo "MUST run as root."
    exit 1
else
    BUILD_DIR="$HOME/gstreamer-build"
    GST_RELEASE=1.14
    NUM_PROCS=`getconf _NPROCESSORS_ONLN`
    UBUNTU_CODENAME=`lsb_release --codename | cut -f2`

    BUILD_DEPS='
        alsa-base
        autoconf
        automake
        autopoint
        bison
        ca-certificates
        flex
        g++
        gettext
        git
        gtk-doc-tools
        libglib2.0-dev
        liborc-dev
        libsoup2.4-dev
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

    echo deb http://us.archive.ubuntu.com/ubuntu/ $UBUNTU_CODENAME multiverse >> /etc/apt/sources.list
	echo deb-src http://us.archive.ubuntu.com/ubuntu/ $UBUNTU_CODENAME multiverse >> /etc/apt/sources.list
    echo deb http://us.archive.ubuntu.com/ubuntu/ $UBUNTU_CODENAME-updates multiverse >> /etc/apt/sources.list
	echo deb-src http://us.archive.ubuntu.com/ubuntu/ $UBUNTU_CODENAME-updates multiverse >> /etc/apt/sources.list

    # INSTALL system upgrades, dependencies
	apt update
	apt upgrade --yes --no-install-recommends
	apt install --yes --no-install-recommends $BUILD_DEPS $PLUGINS

    mkdir -p $BUILD_DIR
    cd $BUILD_DIR

    # BUILD gstreamer
    git clone https://github.com/GStreamer/gstreamer.git
    cd gstreamer/
    git checkout $GST_RELEASE
    sh autogen.sh
    make -j $NUM_PROCS
    make install
    cd plugins/
    make install
    export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib
    
    cd $BUILD_DIR

    # BUILD gst-plugins-base
    git clone https://github.com/GStreamer/gst-plugins-base.git
    cd gst-plugins-base/
    git checkout $GST_RELEASE
    sh autogen.sh
    make -j $NUM_PROCS
    make install

    cd $BUILD_DIR

    # BUILD gst-plugins-good
    git clone https://github.com/GStreamer/gst-plugins-good.git
    cd gst-plugins-good/
    git checkout $GST_RELEASE
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