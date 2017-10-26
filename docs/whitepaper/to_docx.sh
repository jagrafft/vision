#env /bin/bash

pandoc \
    -s \
    -S \
    --filter pandoc-citeproc \
    -o visionAV.docx \
    visionAV.md