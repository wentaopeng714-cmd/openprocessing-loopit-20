# coding: utf-8
from pathlib import Path
p=Path('assets/art/engine.js');s=p.read_text()
if 'this.interaction=new ArtInteraction' in s:
 print('Engine already uses scene-specific models.');raise SystemExit(0)
# Mark anatomy and manipulable objects rather than applying touch forces to everything.
s=s.replace("60,0,2.3);ellipse(ex,398,11,16,2,60);curve", "60,0,2.3,101);ellipse(ex,398,11,16,2,60,101);curve")
s=s.replace("65,1,2);}", "65,1,2,102);}",1)
s=s.replace("70,k%3,2);", "70,k%3,2,100);",1)
s=s.replace("ellipse(748,226,44,44,3,180)", "ellipse(748,226,44,44,3,180,90)")
s=s.replace("ellipse(720,192,52,52,3,200)", "ellipse(720,192,52,52,3,200,90)")
s=s.replace("ellipse(500+side*78,457,36,19,3,110);ellipse(500+side*78,457,4,15,0,50)", "ellipse(500+side*78,457,36,19,3,110,101);ellipse(500+side*78,457,4,15,0,50,101)")
s=s.replace("line(799,267,799,478,1,130);line(799,478,655,637,1,120);line(652,620,674,642,2,40);", "")
s=s.replace("this.palette=0;this.seed();this.resize();", "this.palette=0;this.seed();this.interaction=new ArtInteraction(this);if(preview)this.interaction.s.water=1;this.resize();")
a=s.index('bind(){');b=s.index('\nchange(){',a)
s=s[:a]+'''bind(){if(this.preview)return;let c=this.canvas;c.addEventListener('pointerdown',e=>{e.preventDefault();c.setPointerCapture(e.pointerId);let p=this.map(e);this.pointers.set(e.pointerId,p);this.interaction.down(p,e.pointerId);});c.addEventListener('pointermove',e=>{if(!this.pointers.has(e.pointerId))return;let p=this.map(e),old=this.pointers.get(e.pointerId);this.pointers.set(e.pointerId,p);this.interaction.move(p,old,e.pointerId);});let up=e=>{let p=this.map(e);if(this.pointers.has(e.pointerId))this.interaction.up(p,e.pointerId);this.pointers.delete(e.pointerId);};c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);}
''' + s[b:]
s=s.replace("this.points=null;this.seed();}", "this.points=null;this.seed();this.interaction?.reset();}")
s=s.replace("this.t+=dt;this.frame++;", "this.t+=dt;this.interaction.update(dt);this.frame++;")
s=s.replace("g.addColorStop(0,this.pointers.size?'#ffd16d88':'#ffba4644');", "let light=this.interaction.s.on?this.interaction.s.brightness:0;g.addColorStop(0,'rgba(255,186,70,'+(light*.42)+')');")
s=s.replace("for(let p of this.points){let [hx,hy]=this.ambient(p,this.t);if(this.scatter){hx+=Math.sin(p.seed+this.t*.2)*(130+this.wind*30);hy+=Math.cos(p.seed*2+this.t*.17)*130;}", "for(let p of this.points){let [ax,ay]=this.ambient(p,this.t);let pose=this.interaction.target(p,ax,ay,this.t),hx=pose.x,hy=pose.y;")
a=s.index(' // Retained from Mouse Twitch:');b=s.index('\n c.fillStyle=',a)
s=s[:a]+''' // Interpolation is shared. Every scene supplies its own persistent simulation targets.
 if(!this.interaction.physics(p,ratio)){p.vx+=(hx-p.x)*.018*ratio;p.vy+=(hy-p.y)*.018*ratio;p.vx*=Math.pow(.80,ratio);p.vy*=Math.pow(.80,ratio);p.x+=p.vx*ratio;p.y+=p.vy*ratio;}
 c.globalAlpha=pose.alpha??1;
''' + s[b:]
s=s.replace("c.fillStyle=this.palette?palettes[this.kind][(Math.floor(p.seed*10)+this.palette)%4]:p.c;", "c.fillStyle=pose.color||p.c;")
s=s.replace("c.globalAlpha=.42;", "c.globalAlpha=.42*(pose.alpha??1);")
s=s.replace("c.stroke();c.globalAlpha=1;}previous=p", "c.stroke();c.globalAlpha=pose.alpha??1;}previous=p")
a=s.index("c.globalCompositeOperation='source-over';for(let p of this.trails)");b=s.index('\nfor(let r of this.rings)',a)
s=s[:a]+"c.globalAlpha=1;c.globalCompositeOperation='source-over';this.interaction.draw(c,this.t);"+s[b:]
p.write_text(s)
