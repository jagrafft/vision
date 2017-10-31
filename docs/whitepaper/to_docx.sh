#env /bin/bash

pandoc \
    --filter pandoc-citeproc \
    -f markdown+smart ./src/visionAV.md \
    -o visionAV.docx