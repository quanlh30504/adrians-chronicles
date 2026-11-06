"""Regression check: a subtitle's text must fade with its slip (text never darker than the layer alpha allows).
Run from anywhere (Git Bash: export MSYS_NO_PATHCONV=1 PYTHONUTF8=1):  python <project>/tools/check_subsync.py <project>
For every subtitle it renders stills at the fade-in and fade-out, with and without subtitles (?nosub=1), and requires for every pixel in
the subtitle area:   with_sub >= base*(1-a)*0.7 + 20*a - slack    where a is the layer alpha predicted from film.js timing.
If the text is drawn at full opacity on a fading slip, the text pixels (~20) fall far below that bound -> FAIL (exit 1)."""
import re, subprocess, sys, os
from PIL import Image
proj = os.path.abspath(sys.argv[1]); lib = os.environ.get('LIB', os.path.expanduser('~/lemo-opuscar'))
src = open(os.path.join(proj, 'film.js'), encoding='utf-8').read()
subs = [(float(a), float(b)) for a, b in re.findall(r"\{ t0: ([\d.]+), t1: ([\d.]+), text:", src)]
seg = lambda t, a, b: max(0.0, min(1.0, (t - a) / (b - a)))
pts = []
for i, (t0, t1) in enumerate(subs):
    end = min(t1 + 0.6, subs[i + 1][0] - 0.05) if i + 1 < len(subs) else t1 + 0.6
    for t in (t0 + 0.05, t0 + 0.12, end - 0.05, end - 0.12):
        pts.append((round(t, 2), min(seg(t, t0, t0 + 0.25), 1 - seg(t, end - 0.2, end))))
out = os.path.join(proj, 'out', 'subsync'); os.makedirs(out, exist_ok=True)
def still(prefix, q):
    cmd = ['node', os.path.join(lib, 'core/render/still.mjs'), proj, *[str(p[0]) for p in pts], '--out', out, '--prefix', prefix]
    if q: cmd += ['--q', q]
    subprocess.run(cmd, check=True, capture_output=True)
still('w_', ''); still('b_', 'nosub=1')
bad = 0
for t, a in pts:
    w = Image.open(os.path.join(out, f'w_{t:g}.jpg')).convert('L').crop((300, 930, 1620, 1075)); b = Image.open(os.path.join(out, f'b_{t:g}.jpg')).convert('L').crop((300, 930, 1620, 1075))
    worst = 0
    for pw, pb in zip(w.getdata(), b.getdata()):
        bound = pb * (1 - a) * 0.7 + 20 * a - 22
        worst = max(worst, bound - pw)           # how far below the allowed floor the pixel is
    ok = worst <= 0
    print('OK  ' if ok else 'FAIL', f't={t}', f'alpha={a:.2f}', f'worst_violation={worst:.0f}')
    bad += (not ok)
print('subtitle/slip sync:', 'PASS' if not bad else f'FAIL ({bad} frames)'); sys.exit(1 if bad else 0)
