# coding: utf-8
from pathlib import Path
import json,zipfile
r=Path(__file__).parent;M=json.loads((r/'art-manifest.json').read_text());single=r/'standalone-art';single.mkdir(exist_ok=True)
for m in M:
 slug=m['slug'];p=r/'art'/slug;s=(p/'index.html').read_text()
 s=s.replace('<link rel="stylesheet" href="../../assets/art/viewer.css">','<style>'+(r/'assets/art/viewer.css').read_text()+'</style>')
 for f in ['engine.js','viewer.js']:
  code=(r/'assets/art'/f).read_text().replace('</script','<\\/script')
  s=s.replace(f'<script src="../../assets/art/{f}"></script>','<script>'+code+'</script>')
 s=s.replace('href="../../" aria-label="返回作品集"','href="#" style="display:none" aria-label="独立作品"').replace(f'href="../../downloads/{slug}.zip"','href="SOURCE.md"')
 s=s.replace('<button id="save">','<button id="save">')
 (single/(slug+'.html')).write_text(s)
 with zipfile.ZipFile(r/'downloads'/(slug+'.zip'),'w',zipfile.ZIP_DEFLATED) as z:
  z.write(single/(slug+'.html'),slug+'/index.html')
  z.write(p/'README.md',slug+'/SOURCE.md')
  for f in ['engine.js','viewer.js','viewer.css']:z.write(r/'assets/art'/f,slug+'/source/'+f)
  z.write(r/'originals/12-particle-twitch/mySketch',slug+'/original/Mouse-Twitch.js')
  z.write(r/'ART-CREDITS.md',slug+'/LICENSE.md')
with zipfile.ZipFile(r/'downloads/touch-art-20.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in r.rglob('*'):
  if not p.is_file():continue
  rel=p.relative_to(r)
  if any(x in ['.git','downloads','qa','__pycache__'] for x in rel.parts) or p.name=='.DS_Store':continue
  if rel.as_posix()=='index.html':
   offline=p.read_text().replace('href="downloads/touch-art-20.zip" download','href="README.md"').replace('带走 20 个作品 ↓','使用说明 ↗')
   z.writestr('touch-art-20/index.html',offline)
  else:z.write(p,'touch-art-20/'+rel.as_posix())
 for p in (r/'downloads').glob('*.zip'):
  if p.name not in ['touch-art-20.zip','loopit-20.zip']:z.write(p,'touch-art-20/downloads/'+p.name)
 # The full bundle's own download button is replaced with source navigation in offline use.
print('20 个独立艺术 HTML、20 个单独 ZIP、完整艺术 ZIP 已生成')
