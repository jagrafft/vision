if [ `id -u` -ne 0 ]; then
    echo "Must run as root"
    exit 1
else
    apt-add-repository multiverse
    apt update
    apt upgrade --yes
    apt autoremove --yes
fi