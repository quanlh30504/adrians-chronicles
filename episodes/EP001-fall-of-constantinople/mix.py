"""EP001 audio mix, per Part: voice (Kokoro bm_george paragraph takes) + music bed (stock-audio fit of "Teller of the Tales") + provisional foley.
Usage:  python mix.py 1 [2 3]      -> audio/mix/part<N>-mix.wav (-14 LUFS two-pass) + part<N>-mix.mp3 + stems + timeline
Rules: knowledge/10 (music 20-24 dB under the voice, ducking, EQ), knowledge/02 (pauses), knowledge/08 (SFX from stock-audio).
SFX cues are PROVISIONAL (placed from the shot script); re-place them from events.json once the picture exists."""
import sys, os, json, io, subprocess, re
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt, lfilter
from scipy.ndimage import uniform_filter1d
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB', os.path.expanduser('~/lemo-opuscar'))
STOCK = os.path.expanduser('~/.claude/skills/stock-audio/scripts/stock_audio.py')
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
import sfx
from sfx import SR, add, norm, compress, limit, lp

AUD = os.path.join(HERE, 'audio'); MIXD = os.path.join(AUD, 'mix'); os.makedirs(MIXD, exist_ok=True)
MUSIC_SRC = os.path.join(HERE, 'assets', 'audio', 'music', 'incompetech-music-USUAN1400020-Teller-of-the-Tales.mp3')
SFXDIR = os.path.join(HERE, 'assets', 'audio', 'sfx')
MUS_REL_DB, DUCK_DB = -14.0, -8.0
CFG = {1: dict(V0=3.0, start=0), 2: dict(V0=1.2, start=64), 3: dict(V0=1.2, start=128)}
TAIL = 2.4                                            # seconds of music/room after the last word (handle + natural tail)
GAP = 1.0                                             # default paragraph gap (file 02: 0.9-1.2 s)
LONG = {'L04': 1.2, 'L10': 1.2, 'L14': 1.2, 'L18': 1.4, 'L19': 0.6, 'L26': 1.4, 'L35': 0.6, 'L40': 1.2, 'L41': 1.4, 'L43': 1.6}   # before a twist / open loop

def load_lines(n):
    L = json.load(io.open(os.path.join(AUD, f'part{n}', 'lines.json'), encoding='utf8')); out = []
    for l in L:
        x, sr = sf.read(os.path.join(AUD, f'part{n}', l['id'] + '.wav'))
        if x.ndim > 1: x = x.mean(1)
        x = resample_poly(x, SR, sr); x = norm(compress(norm(x, .9), thr=.22, ratio=3.0), .9)
        out.append((l['id'], x))
    return out

def sfx_lib():
    def L(num):
        fn = [f for f in os.listdir(SFXDIR) if f.startswith(f'mixkit-sfx-{num}-') and f.endswith('.wav')][0]
        x, r = sf.read(os.path.join(SFXDIR, fn))
        if x.ndim > 1: x = x.mean(1)
        if r != SR: x = resample_poly(x, SR, r)
        return norm(x, 1.0)
    return dict(pen=L(2367), scrib=L(2369), pencil=L(3194), page=L(1104), bigpage=L(1105), glass=L(154), whoosh=L(2623), tick=L(1061), wipe=L(3087), splash=L(1311), scrape=L(809))

def snip(rng, x, d):
    n = min(int(d * SR), len(x)); s0 = int(rng.random() * max(0, len(x) - n)); y = x[s0:s0 + n].copy(); f = min(len(y) // 4, int(0.02 * SR))
    y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f); return y

# provisional foley, from shots/part1-shots.md. ARCH = archive (light-table) windows inside a line, TURN = plate turns at the start of a line.
ARCH = {'L04': (0, 13), 'L06': (0, 9), 'L09': (21, 29), 'L11': (0, 10), 'L13': (14, 21)}
TURN = {'L02', 'L05', 'L09', 'L10', 'L12b', 'L14', 'L15', 'L19'}

def place_foley(buf, rng, S, lines_t, part):
    if part != 1: return
    for lid, t0, t1 in lines_t:
        d = t1 - t0
        if lid in TURN: add(buf, S['bigpage'] if lid in ('L05', 'L10') else S['page'], t0 + 0.05, 0.11, rng.uniform(-.3, .3))
        a = ARCH.get(lid)
        if a:
            add(buf, S['whoosh'][:int(0.9 * SR)] * np.hanning(int(0.9 * SR)) ** 0.7, t0 + a[0], 0.10)
            add(buf, S['glass'][int(0.4 * SR):int(1.3 * SR)] * np.linspace(1, 0, int(0.9 * SR)) ** 2, t0 + a[0] + 0.6, 0.06)
        # soft burin / pencil strokes through the engraved shots; silent in the last 1.6 s of L01, L18 and in archive windows
        tt = t0 + 0.4; end = t1 - (1.6 if lid in ('L01', 'L18') else 0.3)
        rate = 3.0 if (lid == 'L01' and tt < t0 + 7) else 1.1
        while tt < end:
            if not (a and t0 + a[0] <= tt <= t0 + a[1]):
                pool = [S['pen'], S['scrib'], S['pencil']][rng.integers(3)]
                add(buf, snip(rng, pool, rng.uniform(0.25, 0.55)), tt, (0.13 if rate > 2 else 0.06) * rng.uniform(.6, 1), rng.uniform(-.3, .3))
            tt += rng.exponential(1 / rate)
    # the workroom clock for the Hagia Sophia evening (L04-L05) only
    for lid, t0, t1 in lines_t:
        if lid in ('L04', 'L05'):
            for k in range(int(t1 - t0)): add(buf, S['tick'][:int(0.25 * SR)], t0 + k + 0.5, 0.035, -0.5)

def envelope(vfull):
    """voice activity 0..1: fast attack, 0.6 s release, computed at 1 kHz and upsampled"""
    blk = SR // 1000; n = len(vfull) // blk
    act = (vfull[:n * blk].reshape(n, blk).max(1) > 0.02).astype(float)
    att = uniform_filter1d(act, 50)
    a = np.exp(-1 / (0.6 * 1000)); rel = lfilter([1 - a], [1, -a], act)
    e = np.clip(np.maximum(att, rel), 0, 1)
    return np.interp(np.arange(len(vfull)) / blk, np.arange(n), e)

def lufs(path):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=framelog=quiet', '-f', 'null', '-'], capture_output=True, text=True)
    m = re.findall(r'I:\s+(-?\d+\.\d+) LUFS', r.stderr); return float(m[-1]) if m else None

def mix_part(n):
    cfg = CFG[n]; lines = load_lines(n); rng = np.random.default_rng(1453 + n); S = sfx_lib()
    t = cfg['V0']; placed = []
    for lid, x in lines:
        d = len(x) / SR; placed.append((lid, t, t + d, x)); t += d + LONG.get(lid, GAP)
    DUR = placed[-1][2] + TAIL
    buf = np.zeros((int(DUR * SR) + SR, 2))
    vfull = np.zeros(len(buf)); vst = np.zeros((len(buf), 2))
    for lid, a, b, x in placed:
        add(vst, x, a, 1.0, 0.0); vfull[int(a * SR):int(a * SR) + len(x)] = np.maximum(vfull[int(a * SR):int(a * SR) + len(x)], np.abs(x))
    add(buf, vst[:, 0], 0, 1.0, 0.0)
    # music: stock-audio fit (loop-crossfade), a different start per Part
    bed_wav = os.path.join(MIXD, f'bed_part{n}.wav')
    subprocess.run([sys.executable, '-X', 'utf8', STOCK, 'fit', MUSIC_SRC, bed_wav, '--duration', f'{DUR:.2f}', '--start', str(cfg['start']), '--fade-in', '1.5', '--fade-out', '3', '--crossfade', '4'], check=True, capture_output=True)
    bed, bsr = sf.read(bed_wav); bed = bed.reshape(len(bed), -1)
    if bed.shape[1] == 1: bed = np.repeat(bed, 2, 1)
    if bsr != SR: bed = resample_poly(bed, SR, bsr, axis=0)
    bed = bed[:len(buf)]; bed = np.pad(bed, ((0, len(buf) - len(bed)), (0, 0)))
    for c in range(2):
        x = bed[:, c]
        x = sosfilt(butter(2, 120, 'high', fs=SR, output='sos'), x)
        x = x - 0.30 * sosfilt(butter(2, [1000, 4000], 'band', fs=SR, output='sos'), x)
        bed[:, c] = sosfilt(butter(2, 12000, 'low', fs=SR, output='sos'), x)
    voiced = vfull > 0.02
    voice_rms = float(np.sqrt(np.mean(np.square(vst[:, 0][voiced]))))
    bed_rms = float(np.sqrt(np.mean(np.square(bed[np.abs(bed) > 1e-4]))))
    gain = voice_rms * 10 ** (MUS_REL_DB / 20) / bed_rms
    env = envelope(vfull); duck = 1 - (1 - 10 ** (DUCK_DB / 20)) * env
    # two deliberate dips (L18 → L19 pause and before the Part ends) keep the music from rising into the twist
    mus = bed * gain * duck[:, None]
    sfx_buf = np.zeros_like(buf); place_foley(sfx_buf, rng, S, [(a, b, c) for a, b, c, _ in placed] if False else [(i, a, b) for i, a, b, _ in placed], n)
    room = lp(sfx.brown(DUR + 1), 900) * 0.006; sfx_buf[:len(room), 0] += room[:len(buf)]; sfx_buf[:len(room), 1] += room[:len(buf)]
    buf += mus + sfx_buf
    for c in range(2): buf[:, c] = limit(buf[:, c], .93)
    buf = buf[:int(DUR * SR)]
    raw = os.path.join(MIXD, f'part{n}-raw.wav'); sf.write(raw, buf.astype(np.float32), SR)
    sf.write(os.path.join(MIXD, f'stem_voice_p{n}.wav'), vst[:len(buf)].astype(np.float32), SR)
    sf.write(os.path.join(MIXD, f'stem_music_p{n}.wav'), mus[:len(buf)].astype(np.float32), SR)
    sf.write(os.path.join(MIXD, f'stem_music_voiced_p{n}.wav'), (mus[:len(buf)] * voiced[:len(buf), None]).astype(np.float32), SR)
    json.dump([dict(id=i, t0=round(a, 3), t1=round(b, 3)) for i, a, b, _ in placed], io.open(os.path.join(AUD, f'part{n}', 'timeline.json'), 'w', encoding='utf8'), indent=0)
    # master: two-pass loudnorm to -14 LUFS, TP -1.2
    out = os.path.join(MIXD, f'part{n}-mix.wav')
    p1 = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', raw, '-af', 'loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    j = json.loads(p1[p1.rfind('{'):p1.rfind('}') + 1])
    af = f"loudnorm=I=-14:TP=-1.2:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af', af, '-ar', '48000', '-ac', '2', out], check=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', out, '-codec:a', 'libmp3lame', '-b:a', '128k', os.path.join(MIXD, f'part{n}-mix.mp3')], check=True)
    lv, lm = lufs(os.path.join(MIXD, f'stem_voice_p{n}.wav')), lufs(os.path.join(MIXD, f'stem_music_voiced_p{n}.wav'))
    res = dict(part=n, dur_s=round(DUR, 2), master_lufs=lufs(out), voice_lufs=lv, music_under_voice_lufs=lm, gap_LU=round(lv - lm, 1), voice_rms=round(voice_rms, 4), bed_rms=round(bed_rms, 4))
    json.dump(res, io.open(os.path.join(MIXD, f'part{n}-metrics.json'), 'w'), indent=1); print(res)

if __name__ == '__main__':
    for a in (sys.argv[1:] or ['1']): mix_part(int(a))
