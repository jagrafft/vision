#env /bin/bash

pandoc \
    --filter pandoc-citeproc \
    -f markdown+smart ./src/architecture.md \
    -o visionAV_Architecture.docx