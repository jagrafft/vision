#env /bin/bash

pandoc \
    --filter pandoc-citeproc \
    -f markdown+smart ./src/whitepaper.md \
    -o visionAV_WhitePaper.docx