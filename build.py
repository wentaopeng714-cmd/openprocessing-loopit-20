from pathlib import Path
import json,re,difflib,zipfile,shutil,hashlib
R=Path(__file__).parent;M=json.loads((R/'manifest.json').read_text())
ADAPTERS={
'01-neon-pong':r"""
let rally=0,previousDirection=1;
Lab.installP5({start(){playerpoints=robotpoints=0;},after(){if(speedy<0&&previousDirection>0&&ballY>300){rally++;Lab.toast(Math.abs(ballX-playerX)<14?'精准回击！':'回击 ×'+rally);}previousDirection=Math.sign(speedy)||previousDirection;Lab.score=playerpoints;if(playerpoints>=5)Lab.end(true,'你赢下了这场球拍对决！');if(robotpoints>=5)Lab.end(false,'对手先拿到 5 分，拖动球拍再挑战。');},actions:[{label:'加速发球',run(){if(Math.abs(speedy)>0&&ballY>100&&ballY<300){speedy=constrain(speedy*1.12,-5,5);Lab.toast('球速提升，注意落点！');}}}]});
""",
'02-flappy-bounce':r"""
let starsCaught=0;
Lab.installP5({after(){for(let p of pipes){if(!p._tuned){p._tuned=true;p.speed=3+Math.min(score*.15,2);p.gap=Math.max(120,160-score*3);p.bottomY=p.topHeight+p.gap;}let x=p.x+p.width/2,y=p.topHeight+p.gap/2;if(!p.coinGot){push();noStroke();fill('#ffdb62');circle(x,y,15);pop();if(dist(flappyBird.x,flappyBird.y,x,y)<26){p.coinGot=true;starsCaught++;Lab.toast('奖励星 +1 · 共 '+starsCaught+' 颗');}}}Lab.score=score;if(gameOver)Lab.end(false,'穿过 '+score+' 道管道，收集 '+starsCaught+' 颗奖励星。');else if(score>=10)Lab.end(true,'穿过 10 道管道！奖励星 '+starsCaught+' 颗。');}});
""",
'03-snake-quest':r"""
Lab.installP5({start(){grid.pause=false;grid.snake.speed=18;},after(){Lab.score=grid.snake.size-2;if(!grid.running)Lab.end(false,'吃到 '+Lab.score+' 份食物。留意自己的身体！');else if(Lab.score>=10)Lab.end(true,'十份食物收集完成，关卡 '+grid.level+'！');},release(x,y){let p=Lab.downPos;if(!p)return;let dx=x-p.x,dy=y-p.y;if(Math.max(Math.abs(dx),Math.abs(dy))>18)grid.snake.command(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up');},actions:[{label:'←',run(){grid.snake.command('left');}},{label:'↑',run(){grid.snake.command('up');}},{label:'↓',run(){grid.snake.command('down');}},{label:'→',run(){grid.snake.command('right');}}]});
""",
'04-rocket-run':r"""
let energyOrbs=[],shieldUntil=-1,shieldReady=0;const nativeCollide=collide;
collide=function(...a){if(Lab.elapsed<shieldUntil)return;nativeCollide(...a);};
Lab.installP5({before(){if(Lab.pointer.has&&death===0)rocketx=constrain(Lab.pointer.x,20,width-20);if(frameCount%100===0)energyOrbs.push({x:random(30,370),y:-20});},after(){for(let o of energyOrbs){o.y+=3;push();noFill();stroke('#97f6d0');strokeWeight(3);circle(o.x,o.y,18);pop();if(dist(o.x,o.y,rocketx,rockety)<26){o.y=500;score+=8;Lab.toast('能量 +8');}}energyOrbs=energyOrbs.filter(o=>o.y<440);if(Lab.elapsed<shieldUntil){push();noFill();stroke('#8ffbd0');strokeWeight(3);circle(rocketx,rockety-10,70);pop();}Lab.score=Math.floor(score);if(death===1)Lab.end(false,'坚持了 '+Math.floor(Lab.elapsed)+' 秒，得分 '+Lab.score+'。');else if(Lab.score>=150)Lab.end(true);},actions:[{label:'短时护盾',run(){if(Lab.elapsed<shieldReady){Lab.toast('护盾冷却中');return;}shieldUntil=Lab.elapsed+2;shieldReady=Lab.elapsed+8;Lab.toast('护盾保护 2 秒');}}]});
""",
'05-merge-battery':r"""
let lastDrop=-1,merges=0;const nativeHandle=handleBlobs;
handleBlobs=function(){let n=blobs.length;nativeHandle();if(blobs.length<n){merges+=n-blobs.length;Lab.toast('合并成功 ×'+merges);}};
Lab.installP5({start(){blobs=[];merges=0;spawnTimer=0;spawnInterval=100000000;score=0;},tap(x,y){if(y>290&&Lab.elapsed-lastDrop>.35&&blobs.length<55){blobs.push(new Blob(constrain(x,30,width-30),Math.min(y,350),30,spawnLevel));lastDrop=Lab.elapsed;}},release(x,y){if(x>100&&x<200&&y>200&&y<250)Lab.source.released?.();},after(){Lab.score=merges*10;if(Lab.score>=100)Lab.end(true,'完成了 10 次合并！');},actions:[{label:'投放电池',run(){if(Lab.elapsed-lastDrop>.35&&blobs.length<55){blobs.push(new Blob(Lab.pointer.x,320,30,spawnLevel));lastDrop=Lab.elapsed;}}}]});
""",
'06-infinite-clicker':r"""
let tappedAt=-5,tapCombo=0,totalEnergy=0;const nativeClick=mouseClicked;
mouseClicked=function(){let old=clicks;nativeClick();if(dist(mouseX,mouseY,width/2,height/2)<=50){tapCombo=Lab.elapsed-tappedAt<.65?Math.min(tapCombo+1,8):1;tappedAt=Lab.elapsed;let bonus=tapCombo>2?tapCombo:0;clicks+=bonus;totalEnergy+=Math.max(0,clicks-old);if(tapCombo>2)Lab.toast('连击 ×'+tapCombo+' · 能量 +'+bonus);}};
Lab.installP5({after(){Lab.score=Math.floor(totalEnergy+clicksPerSecond*Lab.elapsed);if(Lab.score>=500)Lab.end(true,'能量工坊达到目标！');},actions:[{label:'点击蓄能',run(){let x=mouseX,y=mouseY;window.mouseX=width/2;window.mouseY=height/2;Lab.source.clicked?.();window.mouseX=x;window.mouseY=y;}}]});
""",
'07-dot-chase':r"""
let dashUntil=0,dashReady=0;
Lab.installP5({start(){play=1;},before(){if(Lab.elapsed<dashUntil){player.x=constrain(Lab.pointer.x,12,width-12);player.y=constrain(Lab.pointer.y,12,height-12);}},after(){Lab.score=score;monster.speed=1+score*.11;if(play===2)Lab.end(false,'收集了 '+score+' 个彩点。下一次试试冲刺！');else if(score>=20)Lab.end(true);},actions:[{label:'冲刺',run(){if(Lab.elapsed<dashReady){Lab.toast('冲刺冷却中');return;}dashUntil=Lab.elapsed+1;dashReady=Lab.elapsed+5;Lab.toast('冲刺 1 秒！');}}]});
""",
'08-magnetorium':r"""
let foodsBefore=0;
Lab.installP5({start(){foodEaten=0;foodsBefore=0;},before(){magnetOn=Lab.pointer.down;},after(){if(freshFoodEaten+staleFoodEaten>foodsBefore){foodsBefore=freshFoodEaten+staleFoodEaten;Lab.toast('磁力球吸附成功');}Lab.score=foodsBefore*5;if(Lab.pointer.has&&dist(ballX,ballY,Lab.target.x,Lab.target.y)<ballSize/2+Lab.target.r){Lab.score+=0;Lab.extraMagnet=(Lab.extraMagnet||0)+10;Lab.resetTarget();Lab.toast('命中光圈 +10');}Lab.score+=Lab.extraMagnet||0;Lab.drawTarget();if(ballSize<=0)Lab.end(false);else if(Lab.score>=100)Lab.end(true);},actions:[{label:'轻刹车',run(){ballSpeedX*=.2;ballSpeedY*=.2;Lab.toast('惯性降低，重新瞄准');}}]});
""",
'09-grid-memory':r"""
let memoryRound=1,memoryCells=[],showUntil=0,wasShowing=false,mistakes=0;
function newPattern(){clicked=[];memoryCells=[];while(memoryCells.length<3+memoryRound){let n=Math.floor(Math.random()*100);if(!memoryCells.includes(n))memoryCells.push(n);}showUntil=Lab.elapsed+2.5;wasShowing=true;}
function submitPattern(){if(Lab.elapsed<showUntil)return;let chosen=[];for(let c=0;c<10;c++)for(let r=0;r<10;r++)if(clicked[c]?.[r])chosen.push(c*10+r);let ok=chosen.length===memoryCells.length&&chosen.every(n=>memoryCells.includes(n));if(ok){Lab.score+=10;Lab.toast('第 '+memoryRound+' 关完成');memoryRound++;if(memoryRound>5)Lab.end(true,'五关记忆挑战完成！');else newPattern();}else{mistakes++;Lab.toast('还有 '+(3-mistakes)+' 次机会');if(mistakes>=3)Lab.end(false,'选中的格子要与记忆图案完全一致。');else newPattern();}}
Lab.installP5({start(){newPattern();},before(){if(Lab.elapsed<showUntil){clicked=[];for(let n of memoryCells){let c=Math.floor(n/10),r=n%10;if(!clicked[c])clicked[c]=[];clicked[c][r]=true;}}else if(wasShowing){clicked=[];wasShowing=false;Lab.toast('轮到你复现图案');}},tap(x,y){if(Lab.elapsed<showUntil)return;let c=Math.floor(x/size),r=Math.floor(y/size);if(c<0||c>=10||r<0||r>=10)return;if(!clicked[c])clicked[c]=[];clicked[c][r]=!clicked[c][r];},actions:[{label:'提交图案',run:submitPattern}]});
""",
'10-explog-match':r"""
function pieceAction(type){if(state!=='PLAYING'||!currentPiece)return;if(type==='left'||type==='right'){let d=type==='left'?-1:1;if(!checkCollision(currentPiece.row,currentPiece.col+d,currentPiece.iro))currentPiece.col+=d;}else if(type==='rotate'){let r=(currentPiece.iro+1)%4;if(!checkCollision(currentPiece.row,currentPiece.col,r))currentPiece.iro=r;}else{while(currentPiece&&!checkCollision(currentPiece.row+1,currentPiece.col,currentPiece.iro)){currentPiece.row++;score+=2;}if(currentPiece)lockPiece();}}
Lab.installP5({after(){Lab.score=score;if(gameOver)Lab.end(false,'棋盘堆满了。用 2、3、8 等指数关系清除方块。');else if(score>=600||gameWon)Lab.end(true);},actions:[{label:'←',run(){pieceAction('left');}},{label:'旋转',run(){pieceAction('rotate');}},{label:'→',run(){pieceAction('right');}},{label:'快速落下',run(){pieceAction('drop');}}]});
""",
'11-particle-pop':r"""
Lab.installP5({after(){Lab.collect(particles,p=>p.pos,()=>true,1,12);Lab.drawTarget();},actions:[{label:'聚拢中心',run(){Lab.pointer.x=width/2;Lab.pointer.y=height/2;Lab.pointer.has=true;}}]});
""",
'12-particle-twitch':r"""
Lab.installP5({before(){if(Lab.pointer.down)for(let p of particles){let dx=p.pos.x-mouseX,dy=p.pos.y-mouseY,d=Math.hypot(dx,dy);if(d<130&&d>1)p.oldMove.add(dx/d*.22,dy/d*.22);}},after(){Lab.collect(particles,p=>p.pos,p=>Lab.pointer.down&&Math.hypot(p.pos.x-p.x0,p.pos.y-p.y0)>5,2,4);Lab.drawTarget();}});
""",
'13-sand-painter':r"""
function sandTarget(){let cells=grid.cells.flat();let cell=cells[Math.floor(Math.random()*cells.length)];Lab.epoch++;Lab.target={x:cell.center.x,y:cell.center.y,r:25,hits:0};}
Lab.installP5({fps:40,start(){sandTarget();},tap(){},after(){let friends=grid.cells.flat().flatMap(c=>c.friends);let old=Lab.target;Lab.collect(friends,p=>p.position,()=>Lab.pointer.down,2,4);if(Lab.target!==old)sandTarget();Lab.drawTarget();},actions:[{label:'换色',run(){cyclePalette();sandTarget();}}]});
""",
'14-color-flow':r"""
Lab.installP5({tap(){},after(){Lab.collect(particles,p=>p.position,()=>Lab.pointer.down,1,12);Lab.drawTarget();},actions:[{label:'切换调色板',run(){PALETTE_INDEX=(PALETTE_INDEX+1)%PALETTES.length;applyBackgroundColor();}}]});
""",
'16-starfield':r"""
let captureCombo=0,lastCatch=-5;
Lab.installP5({tap(x,y){let near=starField.stars.filter(s=>s.colored&&s.alpha>0&&dist(x,y,s.x,s.y)<28).sort((a,b)=>dist(x,y,a.x,a.y)-dist(x,y,b.x,b.y));if(near.length){near[0].alpha=0;captureCombo=Lab.elapsed-lastCatch<3?captureCombo+1:1;lastCatch=Lab.elapsed;Lab.toast('捕星 ×'+captureCombo);Lab.award(10);}else{captureCombo=0;Lab.toast('寻找带光圈的彩色星星');}},after(){push();noFill();stroke('#8df1cd');strokeWeight(1);for(let s of starField.stars)if(s.colored&&s.alpha>0)circle(s.x,s.y,30);pop();},actions:[{label:'反转星流',run(){starField.toggleDirection();Lab.toast(starField.inward?'星流向内':'星流向外');}}]});
""",
'17-attraction':r"""
Lab.installP5({before(){for(let v of vel)v.limit(7);},after(){Lab.collect(pos,p=>p,()=>Lab.pointer.down,1,12);Lab.drawTarget();},actions:[{label:'散开粒子',run(){for(let v of vel)v.set(random(-5,5),random(-5,5));Lab.toast('重新散开，用引力收集');}}]});
""",
'18-water-ripples':r"""
Lab.waves=[];
Lab.installP5({tap(x,y){Lab.waves.push({x:x-width/2,z:(y-height/2)*1.25,age:0});let beat=Lab.elapsed%1.4;let active=beat<.42;if(active&&Math.hypot(x-Lab.target.x,y-Lab.target.y)<Lab.target.r){Lab.toast('节奏命中！');Lab.award(10);Lab.resetTarget();}else Lab.toast(active?'点击光圈位置':'等光圈亮起再点击');},before(){for(let w of Lab.waves)w.age++;Lab.waves=Lab.waves.filter(w=>w.age<180);},after(){Lab.drawDomTarget(Lab.elapsed%1.4<.42);},actions:[{label:'激起水波',run(){Lab.waves.push({x:0,z:0,age:0});}}]});
""",
'19-bi-grid':r"""
let gridMode='vert',lastGridSpawn=-1;
function manualParticle(x,y){let p=new particle(x,y,gridMode);p.randWait=0;p._manual=true;particles.push(p);lastGridSpawn=Lab.elapsed;}
Lab.installP5({start(){particles=[];background(bColor);},tap(x,y){manualParticle(x,y);},before(){if(Lab.pointer.down&&Lab.elapsed-lastGridSpawn>.22)manualParticle(mouseX,mouseY);},after(){Lab.collect(particles,p=>p.pos,p=>p._manual&&!p._hit,10,1);for(let p of particles)if(p._labEpoch)p._hit=true;Lab.drawDomTarget();},actions:[{label:'切换横 / 纵',run(){gridMode=gridMode==='vert'?'hor':'vert';Lab.toast(gridMode==='vert'?'粉色粒子向下':'蓝色粒子向右');}}]});
""",
'20-mouse-followers':r"""
Lab.installP5({after(){Lab.collect(particles,p=>p.pos,()=>!Lab.pointer.down,1,16);Lab.drawTarget();},actions:[{label:'引导到光圈',run(){Lab.pointer.x=Lab.target.x;Lab.pointer.y=Lab.target.y;Lab.pointer.has=true;Lab.toast('目标已标记，松手引导粒子');}}]});
"""
}
GOALS=[5,10,10,150,100,500,20,100,50,600,80,40,40,80,80,100,80,50,60,100]
SECONDS=[90,60,90,60,90,60,60,30,80,120,45,45,60,45,45,45,45,45,45,45]
for i,m in enumerate(M):
 slug=m['slug'];orig=R/'originals'/slug;out=R/'games'/slug;out.mkdir(parents=True,exist_ok=True)
 if slug=='19-bi-grid':m['description']='点击释放横向或纵向双色粒子，让粒子穿过光圈；可切换方向。'
 if slug=='10-explog-match':m['description']='移动、旋转、落下数字方块；三个相邻数字满足指数关系即可消除，例如 2、3、8。新增手机按钮与分数挑战。'
 m['goal']=GOALS[i];m['seconds']=SECONDS[i]
 if slug=='10-explog-match':source=re.findall(r'<script>(.*?)</script>',(orig/'index.html').read_text(),re.S)[0]
 elif slug=='03-snake-quest':source='\n\n'.join((orig/p).read_text() for p in ['Tupel','Food','Snake','Grid','mySketch'])
 else:source=(orig/('mySketch.js' if slug in ['01-neon-pong','15-color-bursts'] else 'mySketch')).read_text()
 base=source
 if slug=='01-neon-pong':
  source=source.replace('frameRate(1000)','frameRate(60)').replace('\tkeyPressed();','').replace('(ballY > 360) && (ballY < 365)','(speedy > 0) && (ballY <= 375) && (ballY + speedy >= 365)').replace('(ballY < 40) && (ballY > 35)','(speedy < 0) && (ballY >= 25) && (ballY + speedy <= 35)')
 if slug=='04-rocket-run':source=source.replace('\tkeyPressed();',"\tif (death === 0) { if (keyIsDown(65)||keyIsDown(LEFT_ARROW)) rocketx-=speed; if(keyIsDown(68)||keyIsDown(RIGHT_ARROW)) rocketx+=speed; }")
 if slug=='05-merge-battery':source=source.replace('upgradeCost = 0;','upgradeCost = 25;').replace('100 / (log(score) / 35)','28').replace('upgradeCost *= 5','upgradeCost = Math.ceil(upgradeCost * 1.8)').replace('"Dom has quit YouTube!"','"连锁能量已点亮！"')
 if slug=='06-infinite-clicker':
  source=source.replace('100000000000000;','0;').replace('clicksPerClick = 1000','clicksPerClick = 1')
  source=re.sub(r'// Helper function to get a random element[\s\S]*','',source)
  source=re.sub(r'let cost = Math.floor\(random\(\[.*?\]\)\);','let cost = Math.floor(random([random(8,25), random(30,60), random(70,110)]));',source)
  source=source.replace('Math.floor(cost / 30)','Math.max(1, Math.floor(cost / 20))').replace('Math.floor(cost / 5) * 250','Math.max(1, Math.floor(cost / 8))')
 if slug=='07-dot-chase':source='''function collidePointRect(x,y,a,b,w,h){return x>=a&&x<=a+w&&y>=b&&y<=b+h;}\nfunction collideCircleCircle(x,y,d,x2,y2,d2){return Math.hypot(x-x2,y-y2)<(d+d2)/2;}\n'''+source
 if slug=='08-magnetorium':source=source.replace('foodEaten = 1000000000','foodEaten = 0').replace('j < allFood[j].length','j < allFood.length')
 if slug=='09-grid-memory':source=source.replace('background(255)','background("#111f35")').replace('fill(255)','fill("#172940")').replace('stroke(0)','stroke("#405570")').replace('col < 100','col < 10').replace('row < 100','row < 10')
 if slug in ['11-particle-pop','20-mouse-followers']:
  source=source.replace('parNum=2000','parNum=360').replace('background(200)','background(9,18,32);stroke(122,237,205)').replace('background(220,220,220,15)','background(9,18,32,35)').replace('background(220,220,220,20)','background(9,18,32,35)')
 if slug=='12-particle-twitch':source=source.replace('background(200)','background(18,15,35);stroke(211,155,251)').replace('background(220,220,220,20)','background(18,15,35,40)')
 if slug in ['11-particle-pop','12-particle-twitch']:source=re.sub(r'sqrt\((abs\(mX-particles\[c\].pos.x\)\+abs\(mY-particles\[c\].pos.y\))\)',r'max(1,sqrt(\1))',source)
 if slug=='13-sand-painter':
  source=source.replace('let MAX_FRAMES = 900','let MAX_FRAMES = 100000000').replace('let FRIENDS_PER_CELL = 3','let FRIENDS_PER_CELL = 6').replace('let MAX_SPEED = 1.2','let MAX_SPEED = 2.5')
  source=source.replace('this.applyForce(flockForce);','''if(mouseIsPressed && dist(mouseX,mouseY,this.position.x,this.position.y)<140){ flockForce.add(createVector(mouseX-this.position.x,mouseY-this.position.y).setMag(.25)); }\n    this.applyForce(flockForce);''')
 if slug=='14-color-flow':source=source.replace('this.position.add(currentVector.x * STEP_SIZE, currentVector.y * STEP_SIZE);','''this.position.add(currentVector.x * STEP_SIZE, currentVector.y * STEP_SIZE);\n    if(mouseIsPressed)this.position.add((mouseX-this.position.x)*.035,(mouseY-this.position.y)*.035);''')
 if slug=='16-starfield':source=source.replace('this.coloredStarChance = 0.035','this.coloredStarChance = 0.12').replace('new StarField(500)','new StarField(280)').replace('isBold ? starSize * 0.55 : starSize','isColoredStar ? 7 : isBold ? starSize * 0.55 : starSize')
 if slug=='17-attraction':
  source=source.replace('let num = 50','let num = 160');source=re.sub(r'\t//automatically deleting[\s\S]*?\n\tfor\(let i = 0; i < num; i\+\+\)', '\tfor(let i = 0; i < num; i++)',source)
 if slug=='18-water-ripples':source=source.replace('let y = sin(waveAngle) * 45;', '''let y = sin(waveAngle) * 45;\n        for(let w of Lab.waves||[]){let d=hypot(x-w.x,z-w.z);y+=sin(d*.07-w.age*.18)*55*exp(-w.age/90-d/400);}''').replace('hypot(x-w.x,z-w.z)','Math.hypot(x-w.x,z-w.z)')
 if slug=='19-bi-grid':source=source.replace('this.randWait=random(0,max(height,width))','this.randWait=random(0,max(height,width))')
 config={k:m[k] for k in ['slug','name','description','goal','seconds','url','author','license','licenseUrl']}
 header=f"/* Original: {m['title']} — {m['author']}\nSource: {m['url']}\nLicense: {m['license']} {m['licenseUrl']}\nAdapted on 2026-10-08; see CHANGES.diff and README.md. */\n"
 if slug=='15-color-bursts':
  source=source.replace('requestAnimationFrame(animate);','requestAnimationFrame(animate);\n  if(!Lab.tick())return;')
  source=source.replace('renderer.setPixelRatio(window.devicePixelRatio || 1)','renderer.setPixelRatio(Math.min(2,window.devicePixelRatio || 1))')
  source=source.replace('container.appendChild(renderer.domElement);','container.appendChild(renderer.domElement);\n  Lab.attach(renderer.domElement,SKETCH_WIDTH,SKETCH_HEIGHT);')
  source=source.replace('renderer.render(scene, camera);','renderer.render(scene, camera);\n  Lab.collect(particles,p=>p,p=>p._manualUntil>Lab.elapsed,1,10);Lab.drawDomTarget();Lab.paint();')
  adapter=r"""
Lab.adapter={start(){Lab.resetTarget();},tap(x,y){let col=new THREE.Color().setHSL(Math.random(),1,.55);let hits=0;for(let p of particles){if(Math.hypot(p.x-x,p.y-y)<100){p.setColor(col,120);p._manualUntil=Lab.elapsed+2;hits++;}}Lab.toast('主动点燃 '+hits+' 个粒子');},actions:[{label:'换色',run(){PALETTE_INDEX=(PALETTE_INDEX+1)%PALETTES.length;bgColor.set(PALETTES[PALETTE_INDEX][0]);baseColor.set(PALETTES[PALETTE_INDEX][1]);fadeMaterial.color.copy(bgColor);}}]};
"""
  source+=adapter
 else:source+='\n\n// Interactive additions; original core retained above.\n'+ADAPTERS[slug]
 (out/'sketch.js').write_text(header+source)
 diff=''.join(difflib.unified_diff(base.splitlines(True),source.splitlines(True),fromfile='original',tofile='enhanced'))
 (out/'CHANGES.diff').write_text(diff)
 (out/'README.md').write_text(f"# {m['name']}\n\n{m['description']}\n\n目标：{m['goal']} 分；时限：{m['seconds']} 秒。开始、暂停、重玩和最佳纪录共用 `assets/lab.js`。\n\n原作品：[ {m['title']} ]({m['url']})，作者 **{m['author']}**。\n原许可及本改编版许可：[{m['license']}]({m['licenseUrl']})。\n"+(f"上游改编来源：[{m['upstream']}]({m['upstreamUrl']})。\n" if m['upstream'] else '')+f"\n原版源代码保存于 `originals/{slug}/`，具体修改见 `CHANGES.diff`。2026-10-08 获取、改编。\n")
 dep='<script src="../../vendor/three.min.js"></script>' if slug=='15-color-bursts' else '<script src="../../vendor/p5.min.js"></script>'
 html='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>NAME · Interaction Lab</title><link rel="stylesheet" href="../../assets/lab.css"></head><body><header><div><h1>NAME</h1><div class="metric"><span>得分 <b id="score">0</b> / GOAL</span><span>剩余 <b id="time">SECONDS</b> 秒</span><span>最佳 <b id="best">0</b></span></div></div><span id="state" style="color:#a1e8c5;font-size:11px">准备</span></header><main id="stage"><div id="canvas-container"></div><div id="toast" aria-live="polite"></div><div id="overlay"><div class="panel"><span class="label">INTERACTION LAB · 20</span><h2 id="resultTitle">NAME</h2><p id="resultText">DESCRIPTION</p><button id="main">开始挑战</button><a href="SOURCE" target="_blank" rel="noopener">原作者 AUTHOR · LICENSE</a></div></div></main><div id="actions"><button id="pause">暂停 / 继续</button><button id="restart">重新开始</button></div><p id="help">DESCRIPTION</p><script>window.GAME=CONFIG;</script><script src="../../assets/lab.js"></script>DEP<script src="sketch.js"></script></body></html>'''
 for key,val in {'NAME':m['name'],'GOAL':str(m['goal']),'SECONDS':str(m['seconds']),'DESCRIPTION':m['description'],'SOURCE':m['url'],'AUTHOR':m['author'],'LICENSE':m['license'],'CONFIG':json.dumps(config,ensure_ascii=False),'DEP':dep}.items():html=html.replace(key,val)
 (out/'index.html').write_text(html)
 (orig/'SOURCE.md').write_text(f"# {m['title']}\n\n作者：{m['author']}\n原地址：{m['url']}\n许可：{m['license']} {m['licenseUrl']}\n获取日期：2026-10-08\n"+(f"上游：{m['upstream']} {m['upstreamUrl']}\n" if m['upstream'] else '')+'\n'+json.dumps(m['sourceSha256'],indent=2))
(R/'manifest.json').write_text(json.dumps(M,ensure_ascii=False,indent=2))
(R/'CREDITS.md').write_text('# 原作者与来源\n\n20 个原版与改编版均按各自许可提供。含 NC 的作品仅供非商业使用；含 SA 的改编作品延续原许可。请保留作者署名、来源链接和修改说明。\n\n'+'\n\n'.join(f"{i+1}. **{m['name']}** — [{m['title']}]({m['url']})，{m['author']}。[ {m['license']} ]({m['licenseUrl']})。"+(f" 上游：[ {m['upstream']} ]({m['upstreamUrl']})。" if m['upstream'] else '') for i,m in enumerate(M))+'\n\n运行库：p5.js 1.11.11（LGPL-2.1），Three.js r128（MIT）；完整许可见 vendor。\n')
(R/'LICENSE.md').write_text('# 许可说明\n\n各作品源码及改编源码按 manifest.json、CREDITS.md 与各作品 README.md 标明的许可提供。原作者保有其作品权利。不得将本合集整体标为 MIT 或无条件商用。NC 作品的改编保留非商业限制；SA 作品的改编使用相同许可。\n\n本项目原创的展览页面和共享交互界面可按 MIT 使用；此授权不替代作品及运行库许可。\n')
(R/'README.md').write_text('# OpenProcessing · Interaction Lab 20\n\nGames 10 个 + Particles 10 个。全部取自 OpenProcessing 的公开代码，保留原版与署名，增强移动端互动和挑战目标。\n\n无需构建。打开 index.html，或用 `python3 -m http.server 8000` 在本目录启动静态服务。游戏可分别打开 games/<slug>/index.html。完整 ZIP 解压后保留目录结构即可离线使用；运行库已随包提供。\n\n- originals/：获取的原版代码，含 SHA-256 校验和来源\n- games/：改编代码、展示入口、逐文件差异与说明\n- standalone/：各作品独立单页 HTML，可单文件运行\n- downloads/：完整包与 20 个单独 ZIP\n- manifest.json 与 CREDITS.md：20 个来源和许可\n\n未对接 Loopit API；按用户要求增强实际互动玩法。多数作品保留 CC BY-NC-SA 3.0 非商业许可。\n')
print('20 个互动改编已构建。')