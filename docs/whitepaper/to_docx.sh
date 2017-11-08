#env /bin/bash

pandoc \
    --filter pandoc-citeproc \
    -f markdown+smart ./src/whitepaper.md \
    -o vision_WhitePaper.docx