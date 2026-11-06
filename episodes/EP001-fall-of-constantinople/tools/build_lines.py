import re,json,sys
part=int(sys.argv[1])
t=open('script.md',encoding='utf-8').read()
seg=re.split(r'^=== PART \d ===',t,flags=re.M)[part]
V={ # speaker: (voice, speed, lang)
'NARRATOR':('bm_george',0.80,'en-gb'),'CONSTANTINE':('bm_fable',0.90,'en-gb'),'SPHRANTZES':('bm_daniel',0.95,'en-gb'),
'MEHMED':('am_liam',0.95,'en-us'),'HALIL':('am_echo',0.85,'en-us'),'URBAN':('am_adam',0.92,'en-us'),
'GIUSTINIANI':('am_fenrir',0.90,'en-us'),'NOTARAS':('am_eric',0.90,'en-us'),'GENNADIUS':('am_onyx',0.80,'en-us'),
'WITNESS':('am_michael',0.92,'en-us'),'CITIZEN':('am_michael',1.0,'en-us'),'VOICE':('am_michael',1.0,'en-us'),
'DIMITRI':('am_puck',1.0,'en-us'),'STAVROS':('bm_lewis',0.88,'en-gb'),
'ADVISOR':('am_echo',0.9,'en-us'),'COMMANDER':('am_echo',0.92,'en-us'),'BALTOGLU':('am_eric',0.9,'en-us'),
'JOHN GRANT':('am_fenrir',0.92,'en-us'),'DEFENDER':('am_michael',0.95,'en-us'),'SAILOR':('am_puck',0.95,'en-us'),'CAPTAIN':('am_onyx',0.9,'en-us')}
PH=[('Mehmed','Mehmet'),('Boghaz-kesen','Boaz-kessen'),('Hagia Sophia','Haya Sofia'),('Sphrantzes','Sfrantzes'),
('Mesoteichion','Mezo-tie-kee-on'),('Lycus','Likus'),('Palaiologos','Pa-lay-o-lo-gos'),('Edirne','Eh-deer-neh'),('Bosphorus','Bosforus'),('Babylon','Babbilon'),
('Giustiniani','Joostin-yah-nee'),('Qayser-i Rûm','Kaiser-ee Room'),('Gennadius','Jen-nay-dee-us'),('Kerkoporta','Kerko-porta'),('Notaras','No-tah-ras')]
lines=[];n=0
for raw in seg.splitlines():
    m=re.match(r'^([A-Z][A-Z ]+):\s*(.+)$',raw)
    if not m: continue
    sp,tx=m.group(1),re.sub(r'<!--.*?-->','',m.group(2)).strip()
    tx=re.sub(r'\s—\s[A-Z][A-Za-z ]+\.$','',tx) if sp=='WITNESS' else tx
    n+=1; v,s,l=V[sp]
    disp=tx
    for a,b in PH: tx=tx.replace(a,b)
    lines.append({'id':f'P{part}_{n:03d}_{sp.replace(" ","")}','speaker':sp,'text':tx,'display':disp,'voice':v,'speed':s,'lang':l})
json.dump(lines,open(f'audio/v2/part{part}/lines.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print(len(lines),'lines',sum(len(x['display'].split()) for x in lines),'words')
