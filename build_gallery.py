# coding: utf-8
from pathlib import Path
import json,html
r=Path(__file__).parent;M=json.loads((r/'art-manifest.json').read_text())
cards=[]
for i,m in enumerate(M):
 cards.append(f'''<a class="card {'large' if i<2 else ''}" href="art/{m['slug']}/" data-kind="{m['kind']}" data-category="{m['category']}" aria-label="进入{m['name']}" style="--paper:{m['bg']};--ink:{m['accent']}"><div class="picture"><canvas aria-label="{m['name']}的动态画面"></canvas><span class="number">{i+1:02d} / 20</span><span class="enter">触摸进入 ↗</span></div><div class="caption"><h2>{m['name']}</h2><span class="cat">{m['category']}</span></div><p>{m['description']}</p></a>''')
page='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="20 个可触摸的交互艺术小世界。人像、山水、动物和生活物件，没有倒计时，慢慢玩。"><title>触景 · 20 个可触摸的艺术小世界</title><link rel="stylesheet" href="assets/art/gallery.css"></head><body><header><a href="./" class="brand">触景<small>TOUCHING THE QUIET</small></a><nav><a href="#works">作品集</a><a class="download" href="downloads/touch-art-20.zip" download>带走 20 个作品 ↓</a></nav></header><main><section class="intro"><div><div class="eyebrow">AN INTERACTIVE ART COLLECTION · VOL. 02</div><h1>手指经过，<br>世界<em>轻轻改变。</em></h1></div><aside><p class="quote">把一点时间，<br>还给不赶路的自己。</p><p>一张脸、一座山、一尾鱼，或一杯热茶。<br>点触、拨动、揉开，再等它慢慢重组。<br>没有分数，不用通关，想玩多久都可以。</p><div class="rule">20 种造型 · 20 种色彩 · 多点触摸 · 保存此刻</div></aside></section><section class="gallery" id="works"><div class="toolbar"><div class="filters" aria-label="按题材浏览">FILTERS</div><span id="count">20 PIECES · TAKE YOUR TIME</span></div><div class="grid">CARDS</div></section></main><footer><div>触景 / Touching the Quiet · 2026<br>形状与构图重新创作；粒子弹性模型改编自 OpenProcessing 的 Mouse Twitch。</div><div class="links"><a href="ART-CREDITS.md">来源与许可 ↗</a><a href="archive/games-v1.html">上一版小游戏 ↗</a><a href="https://github.com/wentaopeng714-cmd/openprocessing-loopit-20">GitHub ↗</a></div></footer><script src="assets/art/engine.js"></script><script src="assets/art/gallery.js"></script></body></html>'''
filters=''.join(f'<button data-filter="{x}" class="{"active" if x=="全部" else ""}">{x}</button>' for x in ['全部','人物','自然','动物','生活','抽象'])
(r/'index.html').write_text(page.replace('FILTERS',filters).replace('CARDS','\n'.join(cards)))
(r/'ART-CREDITS.md').write_text('''# 触景 v2 · 来源与许可

这次重做以持续互动的粒子艺术为重点。20 个新题材的形状、构图、背景、色彩、材质和界面由本项目重新创作；不是从 OpenProcessing 下载的人脸、山水、动物或静物成品。原版的 Games 和 Particles 各 10 个下载与改编仍保留，入口为 archive/games-v1.html。

新作品的回位弹簧、惯性阻尼和触摸排斥机制改编自 **Mouse Twitch / maks**：https://openprocessing.org/@maksss/3026808 。原始代码位于 originals/12-particle-twitch/mySketch。为更平稳的触屏响应调整了物理参数，添加多点触摸、持续环境运动、展开与重组、主题变化、暂停、沉浸和图片保存。

这 20 个作品的改编按 **CC BY-NC-SA 3.0** 提供：https://creativecommons.org/licenses/by-nc-sa/3.0/ 。须署名、非商业使用，后续改编使用相同许可。页面与下载包均保留此说明。旧版作品按 CREDITS.md 各自许可提供。
''')
print('新版艺术作品集已生成')
