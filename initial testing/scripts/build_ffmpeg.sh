#!/bin/sh

# Clones, builds, then installs FFmpeg release/3.4 branch for use as a
# *vision* backend service. Targeted for and tested on Ubuntu 16.04 LTS.
# last updated 

if [ `id -u` -ne 0 ] ; then
    echo "MUST run as root."
    exit 1
else

fi