import json,sys,re,difflib
from faster_whisper import WhisperModel
m=WhisperModel("base.en",device="cpu",compute_type="int8")
L=json.load(open('lines.json',encoding='utf-8'));out=[];bad=[]
norm=lambda s:re.sub(r'[^a-z0-9 ]','',s.lower().replace('-',' '))
for l in L:
    segs,_=m.transcribe(l['id']+'.wav',language='en',beam_size=1)
    h=' '.join(s.text for s in segs); r=difflib.SequenceMatcher(None,norm(l['display']),norm(h)).ratio()
    out.append({'id':l['id'],'ratio':round(r,3),'heard':h.strip()})
    if r<0.9: bad.append((l['id'],round(r,2),l['display'][:70],h.strip()[:70]))
json.dump(out,open('asr.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('mean',round(sum(o['ratio'] for o in out)/len(out),3),'low:',len(bad))
for b in bad: print(b)
