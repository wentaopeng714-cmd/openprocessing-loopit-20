from pathlib import Path
import json,re,urllib.request,urllib.parse,concurrent.futures,hashlib
ROOT=Path(__file__).parent
M=json.loads((ROOT/'manifest.json').read_text())
def get(url):
 with urllib.request.urlopen(url,timeout=40) as r: return r.read()
def fetch(m):
 base=f"https://preview.openprocessing.org/sketch/{m['id']}/preview/false/"
 folder=ROOT/'originals'/m['slug'];folder.mkdir(parents=True,exist_ok=True)
 
 html='';files=[]
 if m['id'] in ['3012059','3026673']:
  raw=get(base+'index.html');html=raw.decode();(folder/'index.html').write_bytes(raw);files.append('index.html')
 else:
  names=['mySketch.js'] if m['id']=='3016942' else (['mySketch','Grid','Snake','Tupel','Food'] if m['id']=='3021406' else ['mySketch'])
  for name in names:
   (folder/name).write_bytes(get(base+name));files.append(name)
 if 'Sorry, you have been blocked' in html: raise RuntimeError('Blocked '+m['slug'])

 for src in re.findall(r'<script[^>]+src=[\"\']([^\"\']+)',html):
  if not urllib.parse.urlparse(src).scheme and not src.startswith('//'):
   path=urllib.parse.unquote(src.split('?')[0]);dest=folder/path
   if '..' in Path(path).parts: raise RuntimeError('Unsafe path')
   dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(get(urllib.parse.urljoin(base,src)));files.append(path)
 m['sourceFiles']=files;m['sourceSha256']={p:hashlib.sha256((folder/p).read_bytes()).hexdigest() for p in files}
 print(m['slug'],files,flush=True)
 return m
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: result=list(pool.map(fetch,M))
(ROOT/'manifest.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
