if [ `id -u` -ne 0 ]; then
    echo "Must run as root"
    exit 1
else
    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    apt install --yes nodejs

    apt update
    apt upgrade --yes
    apt autoremove --yes
fi