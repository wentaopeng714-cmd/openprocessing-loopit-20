from pathlib import Path
import re, json, zipfile, hashlib
R=Path(__file__).parent
S=R/'studies'
manifest=json.loads((S/'manifest.json').read_text())
stand=S/'standalone';stand.mkdir(exist_ok=True)
for e in manifest:
 p=S/e['slug'];html=(p/'index.html').read_text()
 html=html.replace('<link rel="stylesheet" href="../assets/studio.css?v=4">','<style>'+(S/'assets/studio.css').read_text()+'</style>')
 for src in re.findall(r'<script src="([^"]+)"[^>]*></script>',html):
  path=(p/src.split('?')[0]).resolve()
  code=path.read_text().replace('</script','<\\/script')
  html=html.replace(f'<script src="{src}"></script>','<script>'+code+'</script>')
 html=html.replace('<a href="../" aria-label="Back to studies">←</a>','')
 (stand/(e['slug']+'.html')).write_text(html)
readme='''# Three direct OpenProcessing remixes

This is a three-study direction prototype, not a replacement or completion of the previous twenty-study collection.

- Liquid Light: Jason Labbe, Magical trail shader, https://openprocessing.org/@theRussetPotato/835887. CC BY-SA 3.0. Keeps the source weighted light accumulation and particle primitive, with an adapted inverse-square falloff, surface lighting, touch emission, modes and lifetime control.
- Living Fibres: David April, Hairy Colorful Patches, https://openprocessing.org/@dsa157/3026685. CC BY-NC-SA 3.0. Keeps the source Perlin vector field, particles and colour-batched trails. Adds a painted vector field, lingering swirls and mobile tuning.
- Particle Atelier: Vamoss, inspired by Felix Auer, Particle Plotter, https://openprocessing.org/sketch/751983. CC BY-SA 3.0. Keeps the differential equations and RK4 integrator. Adds paper/pigment art direction, brush-centred fields, deliberate mode selection, finite lifetimes and undo.

License links: https://creativecommons.org/licenses/by-sa/3.0/ and https://creativecommons.org/licenses/by-nc-sa/3.0/. Preserve each author's attribution, license and modification notices when distributing derivatives. Living Fibres has a noncommercial license.

Open a file in studies/standalone/ directly to play offline. Each standalone embeds p5.js and its own code. Or serve the directory and open studies/index.html for the live gallery. Original files are preserved in each study's original/ folder.

p5.js is included under LGPL-2.1; the complete license is in vendor/P5-LICENSE.txt. Study code does not use the previous collection's shared art engine.

Verified: all three launch in the browser; real desktop and 390 × 844 drag interactions; selected colour/motion controls; English UI; no artwork source-code links; no console errors in tested scenes; standalone HTML and ZIP integrity checks. Long-press and simultaneous touch are implemented; physical multi-touch hardware was not available for verification.
'''
(S/'README.md').write_text(readme)
with zipfile.ZipFile(R/'downloads/direct-remixes-3.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(S.rglob('*')):
  if p.is_file():
   arc='direct-remixes-3/studies/'+str(p.relative_to(S))
   if p==S/'index.html':z.writestr(arc,p.read_text().replace('../downloads/direct-remixes-3.zip','README.md').replace('Download studies ↓','Read guide ↓'))
   else:z.write(p,arc)
 z.write(R/'vendor/p5.min.js','direct-remixes-3/vendor/p5.min.js')
 z.write(R/'vendor/P5-LICENSE.txt','direct-remixes-3/vendor/P5-LICENSE.txt')
print('Packaged three direct-source studies and three offline standalone files.')
with zipfile.ZipFile(R/'downloads/direct-remixes-3.zip') as z:
 assert z.testzip() is None
for e in manifest:
 h=(stand/(e['slug']+'.html')).read_text();assert not re.search(r'<script src=|<link rel="stylesheet"',h)
 assert (S/e['slug']/'original/mySketch.js').exists()
print('Standalone assets embedded; original source preserved; ZIP integrity passed.')
