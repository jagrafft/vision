#!/bin/sh

# Clones, builds, then installs FFmpeg release/3.4 branch for use as a
# *vision* backend service. Targeted for and tested on Ubuntu 16.04 LTS.
# last updated 

if [ `id -u` -ne 0 ] ; then
    echo "MUST run as root."
    exit 1
else
    BUILD_DIR="$HOME/ffmpeg-build"
    # DECKLINK_LIBS="$HOME/.../include/"
    FFMPEG_RELEASE=3.4
    NUM_PROCS=`getconf _NPROCESSORS_ONLN`

    BUILD_DEPS='
        alsa-base
        autoconf
        automake
        build-essential
        ca-certificates
        cmake
        git
        openssl
        pkg-config
        pulseaudio
        texi2html
        texinfo
        yasm
        zlib1g-dev
    '

    AV_LIBS='
        libasound2-dev
        libogg-dev
        libopus-dev
        libpulse-dev
        libsdl1.2-dev
        libssl-dev
        libtool
        libva-dev
        libvdpau-dev
        libvorbis-dev
        libvpx-dev
    '

    echo deb http://us.archive.ubuntu.com/ubuntu/ zesty multiverse >> /etc/apt/sources.list
	echo deb-src http://us.archive.ubuntu.com/ubuntu/ zesty multiverse >> /etc/apt/sources.list
    echo deb http://us.archive.ubuntu.com/ubuntu/ zesty-updates multiverse >> /etc/apt/sources.list
	echo deb-src http://us.archive.ubuntu.com/ubuntu/ zesty-updates multiverse >> /etc/apt/sources.list
    
    apt-get update
    apt-get upgrade --yes --no-install-recommends
    apt-get install --yes --no-install-recommends $BUILD_DEPS $AV_LIBS
    
    git clone https://github.com/FFmpeg/FFmpeg.git $BUILD_DIR
    cd $BUILD_DIR

    git checkout release/$FFMPEG_RELEASE
    
    ./configure
            --pkg-config-flags="--static"
            --disable-ffplay
            --disable-ffserver
            --disable-doc
            --disable-gpl
            --disable-htmlpages
            --disable-manpages
            --disable-nonfree
            --disable-podpages
            --disable-txtpages
            --enable-libopus
            --enable-libpulse
            --enable-libvorbis
            --enable-libvpx
            # --enable-decklink
            # --extra-cflags=-I$DECKLINK_LIBS
            # --extra-ldflags=-L$DECKLINK_LIBS
    make -j $NUM_PROCS
    make install
    
    apt-get autoremove --yes
fi