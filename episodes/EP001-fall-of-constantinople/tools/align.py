"""Align script sentences to the voice (Whisper word timings) and cut subtitle chunks.
   python tools/align.py <project> <part>   ->  timing/part<N>.json  {lines:[{id,t0,t1,sentences:[{i,text,t0,t1}]}], subs:[{t0,t1,text}]}
Absolute times come from audio/part<N>/timeline.json (written by mix.py)."""
import sys, os, re, io, json, difflib
proj = os.path.abspath(sys.argv[1]); part = int(sys.argv[2])
A = os.path.join(proj, 'audio', f'part{part}')
script = io.open(os.path.join(proj, 'script.md'), encoding='utf8').read()
lines = json.load(io.open(os.path.join(A, 'lines.json'), encoding='utf8'))
words = json.load(io.open(os.path.join(A, 'words.json'), encoding='utf8'))
tl = {x['id']: x for x in json.load(io.open(os.path.join(A, 'timeline.json'), encoding='utf8'))}
NUMW = {'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12}
DIGITS = [  # (regex on the script text, replacement) — years and key counts become digits on screen (file 02)
    (r'\btwelve oh four\b', '1204'), (r'\bfourteen oh four\b', '1404'), (r'\bfourteen thirty-two\b', '1432'), (r'\bfourteen forty-eight\b', '1448'),
    (r'\bfourteen forty-nine\b', '1449'), (r'\bfourteen-fifty\b', '1450'), (r'\bfourteen fifty-one\b', '1451'), (r'\bfourteen fifty-two\b', '1452'),
    (r'\bfourteen fifty-three\b', '1453'), (r'\bseven thousand\b', '7,000'), (r'\beighty thousand\b', '80,000'), (r'\btwenty-one-year-old\b', '21-year-old'),
    (r'\bsixty feet\b', '60 feet'), (r'\btwenty-five feet\b', '25 feet'), (r'\bforty feet\b', '40 feet'), (r'\bsix hundred and sixty meters\b', '660 meters'),
    (r'\bfour thousand, nine hundred and eighty-three\b', '4,983'), (r'\bfourteen miles\b', '14 miles'),
]
def disp(s):
    for a, b in DIGITS: s = re.sub(a, b, s, flags=re.I)
    return s
def sentences(text):
    return [s.strip() for s in re.split(r'(?<=[.!?])\s+(?=[A-Z"“‘])', text.strip()) if s.strip()]
def toks(s): return re.findall(r"[a-z']+", s.lower().replace('-', ' ').replace('’', "'"))
out_lines = []; subs = []
for l in lines:
    lid = l['id']; txt = (l.get('asr') or l['text']); base = tl[lid]['t0']
    S = sentences(txt)
    st = [t for s in S for t in toks(s)]                                 # script tokens (flat)
    W = [(re.sub(r"[^a-z']", '', w.lower().replace('-', ' ')), max(0.0, s), max(0.0, e)) for w, s, e in words[lid]]
    wt = [w for w, _, _ in W]
    sm = difflib.SequenceMatcher(None, st, wt, autojunk=False); tstart = [None] * len(st); tend = [None] * len(st)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n): tstart[a + k] = W[b + k][1]; tend[a + k] = W[b + k][2]
    # fill gaps by interpolation between known neighbours (names and numbers Whisper heard differently)
    known = [i for i, v in enumerate(tstart) if v is not None]
    if not known: raise SystemExit(f'{lid}: nothing matched')
    for i in range(len(st)):
        if tstart[i] is None:
            p = max([k for k in known if k < i], default=None); q = min([k for k in known if k > i], default=None)
            if p is None: tstart[i] = tend[i] = tstart[q]
            elif q is None: tstart[i] = tend[i] = tend[p]
            else: f = (i - p) / (q - p); tstart[i] = tend[i] = tend[p] + (tstart[q] - tend[p]) * f
    # Whisper sometimes skips a clause; spans that came out shorter than 0.12 s/word are re-spread over the gap by word count
    nt = len(st); lo = 0.0
    spans = []; k = 0
    for s in S:
        n = len(toks(s)); spans.append((k, k + n - 1)); k += n
    ok = [tend[b] - tstart[a] >= 0.12 * (b - a + 1) for a, b in spans]
    i = 0
    while i < len(spans):
        if ok[i]: i += 1; continue
        j = i
        while j < len(spans) and not ok[j]: j += 1
        t_lo = tend[spans[i - 1][1]] if i > 0 else tstart[spans[i][0]]
        t_hi = tstart[spans[j][0]] if j < len(spans) else tend[spans[-1][1]]
        tot = sum(b - a + 1 for a, b in spans[i:j]) or 1; cur = t_lo
        for q in range(i, j):
            a, b = spans[q]; d = (t_hi - t_lo) * (b - a + 1) / tot
            for z in range(a, b + 1): f = (z - a) / max(1, b - a + 1); tstart[z] = cur + d * f; tend[z] = cur + d * min(1, f + 1 / max(1, b - a + 1))
            cur += d
        i = j
    sents = []; k = 0
    for si, s in enumerate(S):
        n = len(toks(s)); a, b = k, k + n - 1; k += n
        sents.append(dict(i=si, text=s, t0=round(base + tstart[a], 3), t1=round(base + tend[b], 3)))
    out_lines.append(dict(id=lid, t0=tl[lid]['t0'], t1=tl[lid]['t1'], sentences=sents))
    # subtitle chunks: whole sentence when <= 13 words, otherwise cut at the comma nearest the middle
    for s in sents:
        ws = s['text'].split()
        parts = [ws]
        if len(ws) > 13:
            commas = [i for i, w in enumerate(ws[:-1]) if (w.endswith(',') or w.endswith(';') or w.endswith(':') or w.endswith('—')) and 4 <= i + 1 <= len(ws) - 4]
            cut = min(commas, key=lambda i: abs(i + 1 - len(ws) / 2)) + 1 if commas else len(ws) // 2
            parts = [ws[:cut], ws[cut:]]
        # time each part by token position inside the sentence
        n_all = len(toks(s['text'])); k0 = sum(len(toks(x['text'])) for x in sents[:s['i']])
        c = 0
        for p in parts:
            m = len(toks(' '.join(p))); a, b = k0 + c, k0 + c + max(m, 1) - 1; c += m
            subs.append(dict(t0=round(base + tstart[a], 3), t1=round(base + tend[min(b, len(st) - 1)], 3), text=disp(' '.join(p))))
os.makedirs(os.path.join(proj, 'timing'), exist_ok=True)
json.dump(dict(part=part, lines=out_lines, subs=subs), io.open(os.path.join(proj, 'timing', f'part{part}.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(f'part {part}: {len(out_lines)} lines, {sum(len(l["sentences"]) for l in out_lines)} sentences, {len(subs)} subtitle chunks; ends {out_lines[-1]["t1"]}s')
