"""EP001 Part mix: voice lines on the timeline + Teller of the Tales (ducked) + SFX placed on the picture's events.
usage: mix_part.py <part> [music_start_s]   → audio/v2/mix/partN-mix.wav (48 kHz stereo, pre-loudnorm), stems alongside"""
import sys, os, json, subprocess
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB = os.path.expanduser('~/lemo-opuscar'); sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
import sfx
from sfx import SR, add, norm, compress, limit
PART = int(sys.argv[1]); MSTART = float(sys.argv[2]) if len(sys.argv) > 2 else 12.0 * (PART - 1)
AD = os.path.join(ROOT, 'audio', 'v2'); OUT = os.path.join(AD, 'mix'); os.makedirs(OUT, exist_ok=True)
TL = json.load(open(os.path.join(ROOT, 'pu' if PART == 1 else f'pu{PART}', 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(ROOT, 'pu' if PART == 1 else f'pu{PART}', 'events.json'), encoding='utf-8'))['ev']
DUR = TL['end']; N = int(DUR * SR)
rng = np.random.default_rng(1453 + PART)

# ------------------------------------------------ voice: each line on its start time, speech-RMS levelled so no character jumps out
def rd(path):
    x, r = sf.read(path)
    if x.ndim > 1: x = x.mean(1)
    return resample_poly(x, SR, r) if r != SR else x
voice = np.zeros(N)
TARGET = 10 ** (-21.5 / 20)
for l in TL['lines']:
    x = rd(os.path.join(AD, f'part{PART}', l['id'] + '.wav'))
    thr = 0.02 * np.max(np.abs(x)); idx = np.where(np.abs(x) > thr)[0]
    if len(idx): x = x[max(0, idx[0] - int(.03 * SR)): idx[-1] + int(.12 * SR)]
    act = x[np.abs(x) > 0.03 * np.max(np.abs(x))]; rms = np.sqrt(np.mean(act ** 2)) + 1e-9
    g = np.clip(TARGET / rms, .4, 2.5); x = x * g
    f = int(.01 * SR); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    s = int(l['t0'] * SR); e = min(N, s + len(x)); voice[s:e] += x[:e - s]
voice = compress(voice, thr=.2, ratio=2.5); voice = limit(voice, .92) if 'limit' in dir(sfx) else voice
# voice envelope for ducking (0..1)
env = np.abs(voice); k = int(.05 * SR); env = np.convolve(env, np.ones(k) / k, mode='same')
speak = (env > 0.02).astype(float)
def smooth(a, att, rel):
    out = np.zeros_like(a); y = 0.0; ca = np.exp(-1 / (att * SR)); cr = np.exp(-1 / (rel * SR))
    for i in range(len(a)):
        c = ca if a[i] > y else cr; y = c * y + (1 - c) * a[i]; out[i] = y
    return out
duck = smooth(speak[::48], .05, .6)            # 1 kHz control rate
duck = np.interp(np.arange(N), np.arange(len(duck)) * 48, duck)

# ------------------------------------------------ music bed (loop of Teller of the Tales, crossfaded; hp 120 Hz, notch 1–4 kHz, lp 12 kHz)
mp3 = os.path.join(ROOT, 'assets', 'audio', 'music', 'incompetech-music-USUAN1400020-Teller-of-the-Tales.mp3')
tmp = os.path.join(OUT, '_music.wav'); subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', str(SR), tmp], check=True)
m = sf.read(tmp)[0]; XF = int(4 * SR)
def loop(m, n, start):
    m = np.roll(m, -int(start * SR)); out = m.copy()
    while len(out) < n + XF:
        a = out[-XF:] * np.linspace(1, 0, XF) ** .5; b = m[:XF] * np.linspace(0, 1, XF) ** .5
        out = np.concatenate([out[:-XF], a + b, m[XF:]])
    return out[:n]
mus = loop(m, N, MSTART)
sos = butter(2, 120, 'hp', fs=SR, output='sos'); mus = sosfilt(sos, mus)
sos = butter(2, 12000, 'lp', fs=SR, output='sos'); mus = sosfilt(sos, mus)
mid = sosfilt(butter(2, [1000, 4000], 'bp', fs=SR, output='sos'), mus); mus = mus - .35 * mid
mus = mus / (np.sqrt(np.mean(mus ** 2)) + 1e-9)
vrms = np.sqrt(np.mean(voice[speak > 0] ** 2))
base = vrms * 10 ** (-14 / 20)                     # in the gaps music sits 14 dB under speech; under speech a further −8 dB (≈ −22 dB, file 10)
gain = base * (1 - duck * (1 - 10 ** (-8 / 20)))
t = np.arange(N) / SR
open_boost = 1 + 2.2 * np.clip(1 - t / 9.0, 0, 1)   # the opening (book on the desk, no voice): music lifted, easing down by 9 s
fade = np.clip((DUR - t) / 3.0, 0, 1) * np.clip(t / 1.5, 0, 1)
music = mus * gain * open_boost * fade

# ------------------------------------------------ SFX on events
SD = os.path.join(ROOT, 'assets', 'audio', 'sfx')
def L(num):
    fn = [f for f in os.listdir(SD) if f.startswith(f'mixkit-sfx-{num}-') and f.endswith('.wav')][0]
    return norm(rd(os.path.join(SD, fn)), 1.0)
def cut(x, d, s=0.0):
    n = int(d * SR); y = x[int(s * SR): int(s * SR) + n].copy(); y = np.pad(y, (0, n - len(y))) if len(y) < n else y; f = min(len(y) // 3, int(.03 * SR)); y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f); return y
S = {k: L(v) for k, v in dict(page=1104, bigpage=1105, whoosh=2623, splash=1311, drip=1879, sweep=3087, tick=1061, scribble=2369, scrape=809, clink=154,
    boom1=1690, boom2=1704, bell=617, bellhit=619, hamw=830, hamm=833, door=190, creak=337, march=461, mud=753, cow=1743, sword=2160).items()}
g = lambda db: vrms * 10 ** (db / 20)               # sfx level relative to speech RMS
placed = []
def put(x, t0, db, pan=0.0):
    placed.append((t0, x, g(db), pan))
for e in EV:
    ty, t0 = e['type'], e['t']
    if ty == 'pop': put(cut(S['page'], .5), t0, -13, rng.uniform(-.3, .3))
    elif ty == 'bookopen': put(S['bigpage'], t0 + .2, -9); put(cut(S['creak'], 1.6), t0, -17)
    elif ty == 'hooves': put(cut(S['march'], 3.2, 1.0) * np.hanning(int(3.2 * SR)) ** .5, t0, -20)
    elif ty == 'sea': put(cut(S['splash'], 1.4, .3) * np.hanning(int(1.4 * SR)), t0, -22)
    elif ty == 'ladders': put(cut(S['hamw'], .5), t0, -18); put(cut(S['hamw'], .5, .1), t0 + .6, -20)
    elif ty == 'creak': put(cut(S['door'], 2.6), t0, -15)
    elif ty == 'flagfall': put(S['whoosh'][:int(1.4 * SR)], t0, -16)
    elif ty in ('paper', 'scroll'): put(cut(S['scribble'], .9), t0, -19)
    elif ty == 'crunch': put(cut(S['page'], .25, .15), t0, -22)
    elif ty == 'bell': put(cut(S['bell'], 3.0) * np.linspace(1, 0, int(3.0 * SR)) ** 1.2, t0, -17)
    elif ty == 'shout': pass
    elif ty == 'crowd': put(cut(S['march'], 5.0, 1.5) * np.hanning(int(5.0 * SR)) ** .6, t0, -24)
    elif ty == 'water': put(cut(S['drip'], 2.5), t0, -22)
    elif ty == 'hammer': put(cut(S['hamm'] if rng.random() < .5 else S['hamw'], .55), t0, -15, rng.uniform(-.3, .3))
    elif ty == 'cannon': put(cut(S['boom1'], 2.4) * np.linspace(1, 0, int(2.4 * SR)) ** .8, t0, -11)
    elif ty == 'splash': put(cut(S['splash'], 1.2), t0, -15)
    elif ty == 'cart': put(cut(S['creak'], 2.4), t0, -22)
    elif ty == 'boom': put(cut(S['boom2'], 1.8) * np.linspace(1, 0, int(1.8 * SR)), t0, -16)
    elif ty == 'oxen':
        for k in range(4): put(cut(S['cow'], .35), t0 + k * .9, -22, rng.uniform(-.4, .4))
    elif ty == 'thud': put(S['mud'], t0, -13)
    elif ty == 'whoosh': put(S['whoosh'][:int(1.4 * SR)], t0, -18)
    elif ty == 'chain': put(cut(S['scrape'], 1.2), t0, -19)
    elif ty == 'crackle': put(cut(S['sweep'], 2.0) * np.hanning(int(2.0 * SR)), t0, -19)
    elif ty == 'dig': put(cut(S['scrape'], .6, .1), t0, -20); put(cut(S['hamw'], .4), t0 + 1.1, -22)
    elif ty == 'thunder': put(cut(S['boom2'], 2.6) * np.linspace(1, 0, int(2.6 * SR)), t0, -15)
    elif ty == 'drum': put(cut(S['boom2'], 1.0) * np.linspace(1, 0, int(1.0 * SR)), t0, -27)
    elif ty == 'hoof': put(cut(S['march'], 2.0, 2.0) * np.hanning(int(2.0 * SR)), t0, -23)
    elif ty == 'march': put(cut(S['march'], 3.5, .5) * np.hanning(int(3.5 * SR)), t0, -22)
    elif ty == 'bookclose': put(S['bigpage'], t0, -10); put(cut(S['creak'], 1.4), t0 + .3, -18)
sfxbus = np.zeros((N, 2))
for t0, x, a, pan in placed:
    if t0 < 0 or t0 * SR >= N: continue
    add(sfxbus, x, t0, a, pan)
# SFX duck under the voice a little (they must never cover a word)
sd = (1 - .45 * duck)[:, None]; sfxbus *= sd

mix = np.zeros((N, 2)); mix[:, 0] += voice + music + sfxbus[:, 0]; mix[:, 1] += voice + music + sfxbus[:, 1]
mix = limit(mix, .95) if 'limit' in dir(sfx) else np.clip(mix, -.95, .95)
sf.write(os.path.join(OUT, f'part{PART}-premix.wav'), mix, SR, subtype='PCM_24')
for nm, a in (('voice', voice), ('music', music)): sf.write(os.path.join(OUT, f'part{PART}-stem-{nm}.wav'), a, SR, subtype='PCM_24')
# final: −14 LUFS master (file 05)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(OUT, f'part{PART}-premix.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', os.path.join(OUT, f'part{PART}-mix.wav')], check=True)
print('mixed', DUR, 's  events', len(EV), 'sfx placed', len(placed), 'voice rms', round(20 * np.log10(vrms), 1), 'dBFS')
