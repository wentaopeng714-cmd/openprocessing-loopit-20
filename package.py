from pathlib import Path
import json,re,zipfile
R=Path(__file__).parent
M=json.loads((R/'manifest.json').read_text())
DOWNLOADS=R/'downloads';DOWNLOADS.mkdir(exist_ok=True)
STANDALONE=R/'standalone';STANDALONE.mkdir(exist_ok=True)
for m in M:
 slug=m['slug'];folder=R/'games'/slug;html=(folder/'index.html').read_text()
 html=html.replace('<link rel="stylesheet" href="../../assets/lab.css">','<style>'+(R/'assets/lab.css').read_text()+'</style>')
 for src in ['../../assets/lab.js','../../vendor/p5.min.js','../../vendor/three.min.js','sketch.js']:
  path=(folder/src).resolve();tag='<script src="'+src+'"></script>'
  if tag in html:html=html.replace(tag,'<script>'+path.read_text().replace('</script','<\\/script')+'</script>')
 single=STANDALONE/(slug+'.html');single.write_text(html)
 with zipfile.ZipFile(DOWNLOADS/(slug+'.zip'),'w',zipfile.ZIP_DEFLATED) as z:
  z.write(single,slug+'/index.html')
  for p in folder.rglob('*'):
   if p.is_file() and p.name!='index.html':z.write(p,slug+'/enhanced/'+p.relative_to(folder).as_posix())
  for p in (R/'originals'/slug).rglob('*'):
   if p.is_file():z.write(p,slug+'/original/'+p.relative_to(R/'originals'/slug).as_posix())
  for p in (R/'vendor').glob('*LICENSE*'):z.write(p,slug+'/licenses/'+p.name)
with zipfile.ZipFile(DOWNLOADS/'loopit-20.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in R.rglob('*'):
  if not p.is_file() or p.parts[-1]=='.DS_Store':continue
  rel=p.relative_to(R)
  if any(x in ['.git','downloads','qa','__pycache__'] for x in rel.parts):continue
  z.write(p,'loopit-20/'+rel.as_posix())
 print('完整 ZIP：',DOWNLOADS/'loopit-20.zip','字节',z.fp.tell())
