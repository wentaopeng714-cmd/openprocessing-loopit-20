# coding: utf-8
from pathlib import Path
import json,html,zipfile,re
R=Path(__file__).parent
rows=[
('01-visage','face','浮光 · 人像','PORTRAIT IN GOLD','人物','拨开金色轮廓，让一张脸在光里散开、再慢慢浮现。','指尖描摹五官 · 长按拨散 · 双击换一张脸','换一张脸','#24151b','#edbd91'),
('02-shan-shui','ink','山水之间','A QUIET LANDSCAPE','自然','手指作风，揉开山脊。纸上的山水会缓缓回到自己的位置。','拖动揉开山线 · 留下淡墨 · 松手让山归位','换一阵风','#eee9dc','#375b52'),
('03-koi-pond','koi','锦鲤游园','THREE LITTLE WISHES','动物','三尾锦鲤绕着水心游动。点一滴水，搅动它们的轨迹。','点触泛起涟漪 · 拖动拨水 · 多指一起搅动','换一种鱼色','#153e42','#f8b881'),
('04-petal-breath','bloom','花的呼吸','A BLOOM THAT LISTENS','自然','层层花瓣慢慢呼吸。把手指放在花心，花瓣会向四周舒展。','拖动梳理花瓣 · 长按花心 · 松手重新盛开','换一束花','#f6e8ed','#ae416f'),
('05-aurora-silk','aurora','极光丝带','NORTHERN THREADS','抽象','把极光当作柔软的丝绸，掀起一角，看颜色顺着指尖流动。','拖动拉开光帘 · 双指拨动 · 放开继续漂流','换一道极光','#101d35','#9beaca'),
('06-steaming-tea','tea','一杯热茶','SLOW AFTERNOON','生活','一只茶杯，一缕蒸汽。拨动升起的雾，给忙碌的下午一点空白。','拂过蒸汽 · 描摹杯沿 · 长按轻轻搅动','换一杯茶','#e6ddcc','#694d3a'),
('07-blue-cat','cat','蓝猫的午后','THE CAT NEXT DOOR','动物','蓝色的猫安静地坐着。揉揉它的耳朵和胡须，线条会轻轻弹回来。','揉耳朵 · 拨胡须 · 松手让它重新坐好','换一种蓝','#dae9f3','#335b8a'),
('08-jellyfish','jelly','透明来客','BENEATH THE QUIET SEA','动物','三只水母浮在紫色深海。拖动触须，看它们像纱一样慢慢摆动。','拉动触须 · 多指拨动 · 点触水母伞','换一片深海','#241b50','#d6c5fc'),
('09-woven-color','fabric','织一块颜色','A HANDWOVEN DAY','生活','朱红、金黄和青绿交织在一起。手指穿过经纬，织出自己的起伏。','拖动揉开经纬 · 双指拉扯 · 留下短暂笔迹','换一块织物','#f7e9c8','#bd5235'),
('10-desert-lines','dunes','沙丘慢慢','SOFT LAND, SOFT LIGHT','自然','杏色天空下，沙丘像层叠的纸。沿山脊推一推，地形会柔软地变化。','沿沙脊拖动 · 长按吹散 · 松手复原','换一道日光','#f5d8b6','#9d594c'),
('11-butterfly','butterfly','停在夜里的蝶','A SMALL BLUE NIGHT','动物','蓝金色翅膀在夜色中呼吸。拨开翅上的细纹，让它像星尘一样飞散。','轻触翅膀 · 拖动细纹 · 双指展开','换一只蝶','#142d51','#d8dbb1'),
('12-rain-window','rain','雨落窗前','LET IT RAIN','生活','窗外是朦胧的绿，窗内是一盆小植物。用手指擦出一条路，让雨继续落。','划过玻璃 · 拨动雨丝 · 摸摸窗边的叶子','换一场雨','#e1e5d7','#53674a'),
('13-vinyl','vinyl','唱片的纹路','TURN SLOWLY','生活','不用声音也能看见旋律。轻轻拨动旋转的唱片，把同心圆揉成新的节奏。','拖动唱片沟槽 · 长按扰动 · 点触留一圈光','换一张唱片','#251a31','#ddb7ed'),
('14-autumn-tree','tree','一树秋天','THE GOLDEN HOUR','自然','一棵金色的树在纸上轻摇。拖动枝叶，像把一阵风握在手里。','扫过树冠 · 推动枝叶 · 松手等风停','换一季叶色','#faf0d4','#986526'),
('15-moon-water','moon','月落水面','KEEP A LITTLE MOON','自然','一轮颗粒质地的月亮，和很轻的水纹。伸手，把月光揉成散落的银沙。','拨动月面 · 描摹月沿 · 拂过倒影','换一种月光','#202630','#e1d8c7'),
('16-citrus-table','fruit','橘子与盘子','LITTLE THINGS ON THE TABLE','生活','暖色橘子躺在绿色盘子里。拨动果肉与盘沿，让日常物件变成可以玩的静物画。','揉开橘瓣 · 描盘沿 · 拨动叶片','换一盘颜色','#fff2d8','#ad5838'),
('17-paper-crane','crane','纸鹤停留','A FOLD, A WISH','生活','一只米白纸鹤停在砖红色空间里。沿着折痕拉一拉，把平面的纸揉成风。','沿折痕拖动 · 推开翅膀 · 松手重新折好','换一张纸','#ad5650','#fff0da'),
('18-pocket-galaxy','galaxy','口袋星系','A UNIVERSE IN YOUR HAND','抽象','三条星臂缓缓旋转。长按拨开星群，松手看它们重新聚成一座小宇宙。','长按拨散星群 · 拖动掀起星尘 · 多指一起玩','换一片星色','#180d29','#e8bbdb'),
('19-evening-lamp','lamp','留一盏灯','HOME AFTER DARK','生活','灯罩、灯光和一块安静的桌面。触摸暖色光线，让家的轮廓变得柔软。','轻触灯罩 · 拉动暖光 · 描摹灯脚','换一盏灯光','#302425','#f4c993'),
('20-tidal-lines','ocean','潮汐的线','THE SEA TAKES ITS TIME','自然','青色海浪一层层靠近。手指穿过海面，留下一条很快被潮汐抚平的线。','推开波纹 · 顺着海浪拖动 · 松手让潮水继续','换一道潮汐','#d7eeee','#317e88')]
M=[]
for i,(slug,kind,name,en,cat,desc,hint,change,bg,accent) in enumerate(rows):
 m=dict(slug=slug,kind=kind,name=name,english=en,category=cat,description=desc,hint=hint,change=change,bg=bg,accent=accent,source='https://openprocessing.org/@maksss/3026808',sourceTitle='Mouse Twitch',author='maks',license='CC BY-NC-SA 3.0',licenseUrl='https://creativecommons.org/licenses/by-nc-sa/3.0/')
 M.append(m);p=R/'art'/slug;p.mkdir(parents=True,exist_ok=True)
 js=json.dumps(m,ensure_ascii=False)
 page='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>NAME · 触景</title><link rel="stylesheet" href="../../assets/art/viewer.css"></head><body style="--paper:BG;--ink:ACCENT"><canvas id="art" aria-label="NAME，触摸画面互动"></canvas><header>
<a class="back" href="../../" aria-label="返回作品集">←</a><div><span>ENGLISH</span><h1>NAME</h1></div><button id="quiet" aria-label="隐藏界面，沉浸观看">⛶</button></header><div id="notice" aria-live="polite">HINT</div><footer><div class="tools"><button id="change">CHANGE</button><button id="release" aria-pressed="false">散开</button><button id="pause" aria-pressed="false">静止</button><button id="reset">复原</button></div><div class="details"><span>无目标 · 慢慢玩</span><button id="save">保存这一刻 ↓</button><a href="../../downloads/SLUG.zip">源码 ↓</a></div></footer><button id="restore" aria-label="显示界面" hidden>＋</button><script>window.ART=META;</script><script src="../../assets/art/engine.js"></script><script src="../../assets/art/viewer.js"></script></body></html>'''
 for a,b in [('META',js),('NAME',name),('ENGLISH',en),('CHANGE',change),('SLUG',slug),('BG',bg),('ACCENT',accent),('HINT',hint)]:page=page.replace(a,b)
 (p/'index.html').write_text(page)
 (p/'README.md').write_text(f'# {name}\n\n{desc}\n\n操作：{hint}。没有得分、倒计时或结束状态，可反复互动。支持多点触摸、形态散开与重组、主题变化、静止观看及保存画面。\n\n粒子回位、阻尼惯性及按压排斥模型改编自 [{m["sourceTitle"]} / {m["author"]}]({m["source"]})。人物、山水、动植物和生活物件的造型、构图、色彩、页面及新手势是本项目新创作，不是原网站对应题材的导出。全部改编保留 [CC BY-NC-SA 3.0]({m["licenseUrl"]})。原版保存在 originals/12-particle-twitch/。\n')
(R/'art-manifest.json').write_text(json.dumps(M,ensure_ascii=False,indent=2))
# Old gallery remains usable as a secondary entrance.
p=R/'archive/games-v1.html';s=p.read_text();s=s.replace('<head>','<head><base href="../">',1) if '<base ' not in s else s;p.write_text(s)
print('20 个持续互动艺术页面已生成')
