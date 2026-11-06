import re, json, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p = os.path.join(R, 'pu', 'art.js'); t = open(p, encoding='utf-8').read()
if 'johngrant' not in t:
    t = t.replace("  mason: {", """  johngrant: { robe: '#5a6a4a', trim: '#cfa86a', skin: '#e8c09a', hat: 'helmet', hatCol: '#8a8f98', beard: '#a8453a', prop: 'hammer' },
  defender: { robe: '#4f7fb8', trim: '#e8c8a0', skin: '#ecc9a6', hat: 'cone', hatCol: '#aeb4bc', beard: null },
  baltoglu: { robe: '#2f5a8a', trim: '#e2ae3a', skin: '#e0b48a', hat: 'turbanG', hatCol: '#c93a3a', beard: '#2a2a2e' },
  advisor: { robe: '#6a5a8a', trim: '#cfd6dc', skin: '#e6bf98', hat: 'turbanW', hatCol: '#f4efe4', beard: '#9a9aa0' },
  commander: { robe: '#8a5a3a', trim: '#e2ae3a', skin: '#d8ae8a', hat: 'turbanG', hatCol: '#a8453a', beard: '#3a2a22' },
  sailor: { robe: '#e8e0d0', trim: '#4f7fb8', skin: '#ecc9a6', hat: 'capSoft', hatCol: '#4f7fb8', beard: null },
  captain: { robe: '#2a4a7a', trim: '#e2ae3a', skin: '#d8ae8a', hat: 'beret', hatCol: '#2a4a7a', beard: '#6a4a3a' },
  critobulus: { robe: '#3a6a5a', trim: '#cfa86a', skin: '#e0b48a', hat: 'capSoft', hatCol: '#3a6a5a', beard: '#5a4a3a', prop: 'scroll' },
  pusculus: { robe: '#7a4a6a', trim: '#e2ae3a', skin: '#e8c09a', hat: 'beret', hatCol: '#7a4a6a', beard: null },
  janissary: { robe: '#3d5f9a', trim: '#e2ae3a', skin: '#e0b48a', hat: 'bork', hatCol: '#fffdf2', beard: '#2a2a2e', prop: 'spear' },
  irregular: { robe: '#a8453a', trim: '#cfa86a', skin: '#d8ae8a', hat: 'turbanG', hatCol: '#cfa86a', beard: '#3a2a22' },
  mason: {""", 1)
    t = t.replace("    if (hat === 'cone')", """    if (hat === 'bork') { poly(x, [[cx - headR * .8, hy - headR * .3], [cx - headR * .75, top - h * .1], [cx + headR * .75, top - h * .1], [cx + headR * .8, hy - headR * .3]]); ink(x, hc, 6); poly(x, [[cx + headR * .2, hy - headR * .4], [cx + headR * 1.3, hy + headR * .5], [cx + headR * .9, hy + headR * .7], [cx + headR * .1, hy - headR * .2]]); ink(x, hc, 5); }
    if (hat === 'cone')""", 1)
    open(p, 'w', encoding='utf-8').write(t)
# witnesses in part 3 timeline: persona + label
p3 = os.path.join(R, 'pu3', 'timeline.json'); T = json.load(open(p3, encoding='utf-8'))
W = ['critobulus', 'leonard', 'ducas', 'pusculus', 'barbaro']; LB = ['CRITOBULUS', 'LEONARD OF CHIOS', 'DUCAS', 'PUSCULUS', 'BARBARO']
k = 0
for l in T['lines']:
    if l['speaker'] == 'WITNESS': l['as'] = W[k]; l['label'] = LB[k]; k += 1
json.dump(T, open(p3, 'w', encoding='utf-8'), ensure_ascii=False)
print('patched', k, 'witness lines')
