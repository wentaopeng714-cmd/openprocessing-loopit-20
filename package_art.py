# coding: utf-8
from pathlib import Path
import json,zipfile
r=Path(__file__).parent;M=json.loads((r/'art-manifest.json').read_text());single=r/'standalone-art';single.mkdir(exist_ok=True)
for m in M:
 slug=m['slug'];p=r/'art'/slug;s=(p/'index.html').read_text()
 s=s.replace('<link rel="stylesheet" href="../../assets/art/viewer.css?v=3">','<style>'+(r/'assets/art/viewer.css').read_text()+'</style>')
 for f in ['interactions.js','engine.js','viewer.js']:
  code=(r/'assets/art'/f).read_text().replace('</script','<\\/script')
  s=s.replace(f'<script src="../../assets/art/{f}?v=3"></script>','<script>'+code+'</script>')
 s=s.replace('href="../../" aria-label="Back to collection"','href="#" style="display:none" aria-label="Standalone study"')
 (single/(slug+'.html')).write_text(s)
 with zipfile.ZipFile(r/'downloads'/(slug+'.zip'),'w',zipfile.ZIP_DEFLATED) as z:
  z.write(single/(slug+'.html'),slug+'/index.html')
  z.write(p/'README.md',slug+'/README.md')
  for f in ['interactions.js','engine.js','viewer.js','viewer.css']:z.write(r/'assets/art'/f,slug+'/source/'+f)
  z.write(r/'originals/12-particle-twitch/mySketch',slug+'/original/Mouse-Twitch.js')
  z.write(r/'ART-CREDITS.md',slug+'/LICENSE.md')
with zipfile.ZipFile(r/'downloads/touch-art-20.zip','w',zipfile.ZIP_DEFLATED) as z:
 for dirname in ['art','assets/art','standalone-art']:
  for p in (r/dirname).rglob('*'):
   if p.is_file() and p.name!='.DS_Store':z.write(p,'quiet-play-20/'+p.relative_to(r).as_posix())
 for filename in ['README.md','ART-CREDITS.md','ART-VALIDATION.md','art-manifest.json','build_art.py','build_gallery.py','package_art.py']:
  z.write(r/filename,'quiet-play-20/'+filename)
 offline=(r/'index.html').read_text().replace('href="downloads/touch-art-20.zip" download','href="README.md"').replace('Download collection ↓','Read the guide ↗')
 z.writestr('quiet-play-20/index.html',offline)
 z.write(r/'originals/12-particle-twitch/mySketch','quiet-play-20/originals/Mouse-Twitch.js')
 for m in M:z.write(r/'downloads'/(m['slug']+'.zip'),'quiet-play-20/downloads/'+m['slug']+'.zip')
print('Packaged 20 English standalone studies and scene-specific source files.')
