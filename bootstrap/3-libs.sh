if [ `id -u` -ne 0 ]; then
    echo "Must run as root"
    exit 1
else
    apt install --yes json-glib-tools libjson-glib-1.0-0 libjson-glib-dev libbz2-dev libcurl4 libdc1394-22-dev libglib2.0-dev libgtk2.0-dev libjasperreports-java libjpeg-dev libjson-glib-dev libnice-dev libpng-dev libsoup2.4-dev libssl-dev libswscale4 libswscale-dev libtbb2 libtbb-dev libtiff-dev libtool libxcb-shm0-dev libxcb-xfixes0-dev libxcb1-dev
fi
