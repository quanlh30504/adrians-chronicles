cd ~/lemo-opuscar
for p in 2 3; do D="E:/Adrian’s Chronicles/episodes/EP001-fall-of-constantinople/audio/v2/part$p"
 .venv/Scripts/python.exe core/tts/tts.py "$D/lines.json" "$D/" > "$D/tts.log" 2>&1; echo done >> "$D/tts.log"
 cd "$D" && .venv/Scripts/python.exe ../../../tools/asr_lines.py > asr.log 2>&1 || ~/lemo-opuscar/.venv/Scripts/python.exe ../../../tools/asr_lines.py > asr.log 2>&1; echo asrdone >> asr.log; cd ~/lemo-opuscar
done
echo alldone > "E:/Adrian’s Chronicles/episodes/EP001-fall-of-constantinople/audio/v2/p23.done"
