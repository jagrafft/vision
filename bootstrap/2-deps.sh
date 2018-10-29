if [ `id -u` -ne 0 ]; then
    echo "Must run as root"
    exit 1
else
    apt install --yes autoconf automake bison build-essential bzip2 cmake curl flex git gtk-doc-tools nasm nettle-dev pkg-config python python-dev python-numpy python3 python3-dev python3-numpy sed terminator texinfo wget vim vlc yasm zlib1g-dev
fi