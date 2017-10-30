#env /bin/bash

pandoc \
    -s \
    -S \
    --filter pandoc-citeproc \
    -o visionAV.docx \
    ./src/visionAV.md