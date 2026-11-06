#!/bin/bash
# unattended: render → mix → mux for Part 1,2,3, then the full cut. Logs to pipeline.log
export MSYS_NO_PATHCONV=1 PYTHONUTF8=1 LEMO_COLOR=bt709
R="/e/Adrian’s Chronicles/episodes/EP001-fall-of-constantinople"; RW="E:/Adrian’s Chronicles/episodes/EP001-fall-of-constantinople"
LIB=~/lemo-opuscar; PY=$LIB/.venv/Scripts/python.exe
mkdir -p "$R/parts"; LOG="$R/pipeline.log"; echo "start $(date)" > "$LOG"
for p in 1 2 3; do
  d=pu; [ $p -gt 1 ] && d=pu$p
  echo "== P$p render $(date)" >> "$LOG"
  rm -f "$R/$d/out/part$p-video.mp4"; mkdir -p "$R/$d/out"
  (cd $LIB && node core/render/video.mjs "$RW/$d" --fps 24 --workers 3 --out "$RW/$d/out/part$p-video.mp4" > "$R/$d/out/render.log" 2>&1)
  if [ ! -s "$R/$d/out/part$p-video.mp4" ]; then echo "P$p render FAILED" >> "$LOG"; continue; fi
  echo "== P$p mix $(date)" >> "$LOG"
  if [ $p -gt 1 ] || [ ! -s "$R/audio/v2/mix/part1-mix.wav" ]; then (cd "$R" && $PY tools/mix_part.py $p >> "$LOG" 2>&1); fi
  echo "== P$p mux $(date)" >> "$LOG"
  (cd $LIB && sh core/render/mux.sh "$RW/$d/out/part$p-video.mp4" "$RW/audio/v2/mix/part$p-mix.wav" "$RW/parts/EP001-P$p.mp4" 24 0 >> "$LOG" 2>&1)
  echo "P$p done $(date)" >> "$LOG"
done
echo "== full cut $(date)" >> "$LOG"
cd "$R/parts"
if [ -s EP001-P1.mp4 ] && [ -s EP001-P2.mp4 ] && [ -s EP001-P3.mp4 ]; then
  d1=$(ffprobe -v error -show_entries format=duration -of csv=p=0 EP001-P1.mp4); d2=$(ffprobe -v error -show_entries format=duration -of csv=p=0 EP001-P2.mp4)
  o1=$(python -c "print(round($d1-0.4,3))"); o2=$(python -c "print(round($d1+$d2-0.8,3))")
  ffmpeg -v error -y -i EP001-P1.mp4 -i EP001-P2.mp4 -i EP001-P3.mp4 -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.4:offset=$o1[v1];[v1][2:v]xfade=transition=fade:duration=0.4:offset=$o2[v];[0:a][1:a]acrossfade=d=0.4[a1];[a1][2:a]acrossfade=d=0.4[a]" -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k EP001-FULL.mp4 >> "$LOG" 2>&1
fi
echo "ALLDONE $(date)" >> "$LOG"
