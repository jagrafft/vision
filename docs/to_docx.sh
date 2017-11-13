#env /bin/bash
pandoc \
    --filter pandoc-citeproc \
    -f markdown+smart ./architecture/src/architecture.md \
    -o vision_Architecture.docx

pandoc \
    --filter pandoc-citeproc \
    -f markdown+smart ./whitepaper/src/whitepaper.md \
    -o vision_WhitePaper.docx