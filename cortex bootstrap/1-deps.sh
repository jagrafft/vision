if [[ `id -u` -ne 0 ]]; then
    echo "Must run as root"
    exit 1
else
    apt update
    apt upgrade --yes
    apt autoremove --yes

    apt install --yes \
        autoconf \
        automake \
        bison \
        build-essential \
        bzip2 \
        cmake \
        curl \
        flex \
        git \
        git-core \
        gtk-doc-tools \
        nasm \
        nettle-dev \
        pkg-config \
        python \
        python-dev \
        python-numpy \
        python3 \
        python3-dev \
        python3-numpy \
        sed \
        terminator \
        texinfo \
        wget \
        vlc \
        yacc \
        yasm \
        zlib1g-dev

    apt install \
        json-glib \
        libbz2-dev \
        libdc1394-22-dev \
        libglib-dev \
        libgtk2.0-dev \
        libjasper-dev \
        libjpeg-dev \
        libjson-glib-dev \
        libnice-dev \
        libpng-dev \
        libsoup-dev \
        libsoup2.4-dev \
        libssl-dev \
        libswscale \
        libswscale-dev \
        libtbb2 \
        libtbb-dev \
        libtiff-dev \
        libtool \
        libxcb-shm0-dev \
        libxcb-xfixes0-dev \
        libxcb1-dev

    apt install \
        libass-dev \
        libfdk-aac \
        libfdk-aac-dev \
        libflac-dev \
        libfreetype-dev \
        libfreetype6-dev \
        libmp3lame \
        libmp3lame-dev \
        libopus \
        libopus-dev \
        libpulse-dev \
        libsdl2-dev \
        libva-dev \
        libvdpau-dev \
        libvorbis-dev \
        libvpx \
        libvpx-dev \
        libx264 \
        libx264-dev \
        libx265 \
        libx265-dev

    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    apt install --yes nodejs

    apt update
    apt upgrade --yes
    apt autoremove --yes
fi