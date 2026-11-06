"""Pilot 1453 mix: voice (Kokoro bm_george) + engraver's-workroom foley + a sparse original plucked score. Writes out/mix.wav (48 kHz stereo)."""
import sys, os, json
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB', os.path.expanduser('~/lemo-opuscar'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
import sfx
from sfx import SR, add, bp, lp, hp, noise, norm, env_exp, t_, compress, limit

EVF = os.path.join(HERE, 'events.json')
ev = json.load(open(EVF, encoding='utf-8'))
DUR = ev['dur']; EV = ev['ev']
buf = np.zeros((int(DUR * SR), 2), dtype=np.float64)
rng = np.random.default_rng(1453)

# ---------------------------------------------------------------- voice (one paragraph take, starts at 3.0 s)
v, sr = sf.read(os.path.join(HERE, 'out', 'voice', 'p1.wav'))
if v.ndim > 1: v = v.mean(1)
v = resample_poly(v, SR, sr)
v = compress(norm(v, .9), thr=.22, ratio=3.0)
v = norm(v, .9)
V0 = 3.0
add(buf, v, V0, 1.0, 0.0)

# ---------------------------------------------------------------- foley: stock-audio (Mixkit SFX, no credit) placed on the picture's events
SFXDIR = os.path.join(HERE, 'assets', 'audio', 'sfx')
def L(num):
    fn = [f for f in os.listdir(SFXDIR) if f.startswith(f'mixkit-sfx-{num}-') and f.endswith('.wav')][0]
    x, r = sf.read(os.path.join(SFXDIR, fn))
    if x.ndim > 1: x = x.mean(1)
    if r != SR: x = resample_poly(x, SR, r)
    return norm(x, 1.0)
def snip(x, d, start=None):
    """a d-second piece of x with short fades (so repeated hits never click)"""
    n = int(d * SR); n = min(n, len(x)); s0 = int((rng.random() * max(0, len(x) - n)) if start is None else start * SR)
    y = x[s0:s0 + n].copy(); f = min(len(y) // 4, int(0.02 * SR)); y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f); return y
PEN, SCRIB, PENCIL = L(2367), L(2369), L(3194)       # pen / scribble / pencil on paper: the burin and the hatching
PAGE, BIGPAGE = L(1104), L(1105)                      # paper slip / sheet laid down
GLASS, WHOOSH, TICK = L(154), L(2623), L(1061)        # glass clink, loupe air, workroom clock
DRIP, SPLASH, WIPE, SCRAPE = L(1879), L(1311), L(3087), L(809)   # wet brush and water, metal scrape

# a quiet workroom: low brown-noise bed (synthetic room tone: Mixkit has none) + the clock from stock
room = lp(sfx.brown(DUR), 900) * 0.010
buf[:, 0] += room[:len(buf)]; buf[:, 1] += room[:len(buf)]
for k in range(int(DUR)):
    add(buf, TICK[:int(0.25 * SR)], k + 0.5, 0.05 if k % 2 == 0 else 0.035, -0.5)

def strokes(t0, t1, r0, r1, gain, pool):
    t = t0
    while t < t1:
        r = r0 + (r1 - r0) * (t - t0) / max(1e-6, t1 - t0)
        x = snip(pool[rng.integers(len(pool))], rng.uniform(0.25, 0.6))
        add(buf, x, t, gain * rng.uniform(0.6, 1.0), rng.uniform(-.3, .3)); t += rng.exponential(1 / r)

for e in EV:
    t, ty = e['t'], e['type']; u = e.get('until')
    if ty == 'burin' and u:
        strokes(t, u, 2.0, 3.0, 0.20, [PEN]); add(buf, SCRAPE[:int(0.5 * SR)], t + 0.1, 0.05, -0.2); add(buf, SCRAPE[int(0.5 * SR):int(0.9 * SR)], u, 0.04)
    elif ty == 'hatch' and u:
        strokes(t, u, 3.0, 9.0, 0.12, [SCRIB, PENCIL])
    elif ty == 'title':
        for k in range(8): add(buf, snip(PEN, 0.18), t + k * (e.get('dur', .9) / 8), 0.14, rng.uniform(-.3, .3))
    elif ty == 'ring':
        add(buf, GLASS[:int(0.7 * SR)] * np.linspace(1, 0, int(0.7 * SR)) ** 2, t, 0.10)
    elif ty == 'travel' and u:
        add(buf, PAGE, t, 0.14, -0.4)
    elif ty == 'land':
        add(buf, snip(PENCIL, 0.15, 0.1), t, 0.10, -0.4)
    elif ty == 'loupe' and u:
        d = max(0.6, u - t); w = WHOOSH[:int(d * SR)].copy(); w *= np.hanning(len(w)) ** 0.7
        add(buf, w, t, 0.12)
    elif ty == 'glass':
        add(buf, GLASS[int(0.4 * SR):int(1.3 * SR)] * np.linspace(1, 0, int(0.9 * SR)) ** 2, t - 0.1, 0.06)
    elif ty == 'wash' and u:
        for k in range(3): add(buf, snip(WIPE, 0.9, 0.05), t + k * (u - t) / 3, 0.12, rng.uniform(-.4, .4))
        add(buf, SPLASH[:int(0.5 * SR)] * np.linspace(1, 0, int(0.5 * SR)), t, 0.03, 0.2)
        for k in range(4): add(buf, snip(DRIP, 0.5), t + .3 + k * .55, 0.08, rng.uniform(-.5, .5))
add(buf, BIGPAGE, 26.55, 0.12, 0.2)    # the object is laid on the light table

# ---------------------------------------------------------------- music bed (knowledge/10): stock-audio track, fitted by `stock_audio.py fit`
# MUSIC=<fitted wav> python mix.py [OUT=<name>]   (a synthetic Karplus-Strong score was used in pilot v1-v5; replaced by a stock bed from v6)
from scipy.ndimage import uniform_filter1d
from scipy.signal import butter, sosfilt
MUSIC = os.environ.get('MUSIC')
MUS_REL_DB = float(os.environ.get('MUS_REL_DB', -14))     # music level in the pauses, relative to the voice's speech RMS
DUCK_DB = float(os.environ.get('DUCK_DB', -8))            # extra dip while the voice speaks  -> ~-22 dB under the voice
mus = np.zeros((len(buf), 2))
vfull = np.zeros(len(buf)); vv = np.abs(v)[:len(buf) - int(V0 * SR)]; vfull[int(V0 * SR):int(V0 * SR) + len(vv)] = vv
# voice activity envelope 0..1: fast attack, slow release (so the bed breathes back up in real pauses only)
act = (uniform_filter1d(vfull, int(0.05 * SR)) > 0.02).astype(float)
env = np.zeros_like(act); a_, r_ = np.exp(-1 / (0.05 * SR)), np.exp(-1 / (0.6 * SR)); e = 0.0
for i in range(len(act)):
    e = a_ * e + (1 - a_) * act[i] if act[i] > e else r_ * e + (1 - r_) * act[i]; env[i] = e
voiced = vfull > 0.02
voice_rms = float(np.sqrt(np.mean(np.square(v[np.abs(v) > 0.02]))))
if MUSIC:
    bed, bsr = sf.read(MUSIC)
    bed = bed.reshape(len(bed), -1)
    if bed.shape[1] == 1: bed = np.repeat(bed, 2, 1)
    if bsr != SR: bed = resample_poly(bed, SR, bsr, axis=0)
    bed = bed[:len(buf)]
    if len(bed) < len(buf): bed = np.pad(bed, ((0, len(buf) - len(bed)), (0, 0)))
    for c in range(2):
        x = bed[:, c]
        x = sosfilt(butter(2, 120, 'high', fs=SR, output='sos'), x)                 # keep the low end free for the voice
        x = x - 0.30 * sosfilt(butter(2, [1000, 4000], 'band', fs=SR, output='sos'), x)   # ~ -3 dB carve in the speech band
        x = sosfilt(butter(2, 12000, 'low', fs=SR, output='sos'), x)
        bed[:, c] = x
    bed_rms = float(np.sqrt(np.mean(np.square(bed[np.abs(bed) > 1e-4]))))
    gain = voice_rms * 10 ** (MUS_REL_DB / 20) / bed_rms
    duck = 1 - (1 - 10 ** (DUCK_DB / 20)) * env
    dip = np.ones(len(buf)); dip[int(25.0 * SR):int(26.5 * SR)] = 10 ** (-9 / 20)   # near-silence before the loupe lands
    dip = uniform_filter1d(dip, int(0.4 * SR))
    mus = bed * gain * (duck * dip)[:, None]
    print('music', os.path.basename(MUSIC), 'voice_rms %.3f bed_rms %.3f gain %.3f' % (voice_rms, bed_rms, gain))
buf += mus
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
vst = np.zeros((len(buf), 2)); add(vst, v, V0, 1.0, 0.0)
sf.write(os.path.join(HERE, 'out', 'stem_voice.wav'), vst.astype(np.float32), SR)
sf.write(os.path.join(HERE, 'out', 'stem_music.wav'), mus.astype(np.float32), SR)

# ---------------------------------------------------------------- master (mux does the final -14 LUFS pass)
for c in range(2): buf[:, c] = limit(buf[:, c], .93)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
OUTN = os.environ.get('OUT', 'mix') + '.wav'
sf.write(os.path.join(HERE, 'out', OUTN), buf.astype(np.float32), SR)
print('mix.wav', round(len(buf) / SR, 2), 's; peak', round(float(np.abs(buf).max()), 3))
