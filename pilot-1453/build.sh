#!/bin/sh
# Rebuild the pilot: sh build.sh   (Git Bash on Windows: export MSYS_NO_PATHCONV=1 first)
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
cd "$LIB"
export PYTHONUTF8=1 PYTHONIOENCODING=utf-8
# 1. voice: Kokoro bm_george (en-gb, speed 0.78), one paragraph take; whisper check + word timings
.venv/bin/python core/tts/tts.py "$HERE/lines.json" "$HERE/out/voice"
.venv/bin/python core/tts/asr_check.py "$HERE/lines.json" "$HERE/out/voice" --lang en || true   # the year is read as words, heard as digits: the only expected diff
# 2. picture events -> events.json, then the mix
node core/render/events.mjs "$HERE"
.venv/bin/python "$HERE/mix.py"
# 3. frames and master (-14 LUFS)
.venv/bin/python "$HERE/tools/check_subsync.py" "$HERE"   # gate: subtitle text must fade with its slip
node core/render/video.mjs "$HERE" --fps 24 --workers 2 --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/pilot-1453.mp4" 24
node core/render/still.mjs "$HERE" 33 --out "$HERE/out/still" --prefix poster_ && cp "$HERE/out/still/poster_33.jpg" "$HERE/poster.jpg"
