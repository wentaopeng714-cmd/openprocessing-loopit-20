//hobby curve by @arnoson
//https://github.com/arnoson/hobby-curve
const t=function(t,e,l){const a=1/e,n=1/l;return Math.min(4,((3-a)*a**2*t+n**3)/(a**3*t+(3-n)*n**2))},e=(t,e,l,a,n)=>Math.min(4,(2+Math.sqrt(2)*(t-l/16)*(l-t/16)*(e-a))/(1.5*n*(2+(Math.sqrt(5)-1)*e+(3-Math.sqrt(5))*a))),l=(t,l)=>{const a=Math.sin(t.theta),n=Math.cos(t.theta),h=Math.sin(l.phi),r=Math.cos(l.phi),o=l.leftY,s=t.rightY,i=e(a,n,h,r,o),Y=e(h,r,a,n,s);t.rightX=t.x+(t.deltaX*n-t.deltaY*a)*i,t.rightY=t.y+(t.deltaY*n+t.deltaX*a)*i,l.leftX=l.x-(t.deltaX*r+t.deltaY*h)*Y,l.leftY=l.y-(t.deltaY*r-t.deltaX*h)*Y},a=(e,a=1,n=!1)=>{var h,r;const o=e.map((({x:t,y:e})=>((t,e,l)=>({x:t,y:e,leftY:l,rightY:l,leftX:l,rightX:l,deltaX:0,deltaY:0,delta:0,theta:0,phi:0,psi:0}))(t,e,a))),s=o[0],i=o[o.length-1];for(let t=0;t<o.length;t++)o[t].next=null!=(h=o[t+1])?h:s,o[t].prev=null!=(r=o[t-1])?r:i;if(((t,e)=>{var l;const a=e?t.length:t.length-1;for(let e=0;e<a;e++){const a=t[e],n=null!=(l=t[e+1])?l:t[0];a.deltaX=n.x-a.x,a.deltaY=n.y-a.y,a.delta=Math.hypot(a.deltaX,a.deltaY)}})(o,n),2===e.length&&!n)return((t,e)=>{let l=1/(3*t.rightY);t.rightX=t.x+t.deltaX*l,t.rightY=t.y+t.deltaY*l,l=1/(3*e.leftY),e.leftX=e.x-t.deltaX*l,e.leftY=e.y-t.deltaY*l})(s,i),o;((t,e)=>{const[l,a]=e?[0,t.length]:[1,t.length-1];for(let e=l;e<a;e++){const l=t[e],a=l.prev,n=a.deltaY/a.delta,h=a.deltaX/a.delta;l.psi=Math.atan2(l.deltaY*h-l.deltaX*n,l.deltaX*h+l.deltaY*n)}})(o,n),function(e,l){var a;const n=[],h=[],r=[],o=e[0],s=e[1],i=e[e.length-1],Y=l?e.length+1:e.length;if(l)n[0]=0,r[0]=0,h[0]=1;else{const e=o.next,l=o.rightX,a=Math.abs(e.leftY),i=Math.abs(o.rightY);n[0]=t(l,i,a),r[0]=-s.psi*n[0],h[0]=0}for(let s=1;s<Y;s++){const c=null!=(a=e[s])?a:o,d=c.next,f=c.prev,g=s===Y-1;if(!l&&g){const e=c.leftX,l=Math.abs(c.leftY),a=Math.abs(f.rightY),h=t(e,l,a);i.theta=-r[Y-2]*h/(1-h*n[Y-2]);break}{let t=1/(3*Math.abs(f.rightY)-1),e=c.delta*(3-1/Math.abs(f.rightY)),a=1/(3*Math.abs(d.leftY)-1),i=f.delta*(3-1/Math.abs(d.leftY));const x=1-n[s-1]*t;e*=x;const M=Math.abs(c.leftY),X=Math.abs(c.rightY);M<X?e*=(M/X)**2:i*=(X/M)**2;let p=i/(i+e);n[s]=p*a;let y=-d.psi*n[s];if(p=(1-p)/x,y-=c.psi*p,p*=t,r[s]=y-r[s-1]*p,h[s]=-h[s-1]*p,l&&g){let t=0,e=1;for(let l=s-1;l>=0;l--){const a=0===l?Y-1:l;t=r[a]-t*n[a],e=h[a]-e*n[a]}t/=1-e,o.theta=t,r[0]=t;for(let e=1;e<Y-1;e++)r[e]=r[e]+t*h[e];break}}}for(let t=Y-2;t>=0;t-=1)e[t].theta=r[t]-e[t].next.theta*n[t]}(o,n),((t,e)=>{for(let e=0;e<t.length;e++){const l=t[e];l.phi=-l.psi-l.theta}})(o);const Y=n?o.length:o.length-1;for(let t=0;t<Y;t++)l(o[t],o[t].next);return o},n=(t,{tension:e=1,cyclic:l=!1}={})=>{const n=a(t,e,l),h=[],r=l?n.length:n.length-1;for(let t=0;t<r;t++){const e=n[t];h.push({startControl:{x:e.rightX,y:e.rightY},endControl:{x:e.next.leftX,y:e.next.leftY},point:{x:e.next.x,y:e.next.y}})}return h},h=(t,{tension:e=1,cyclic:l=!1}={})=>{const a=n(t,{tension:e,cyclic:l}),h=t=>[t.x,t.y].join(","),r=a.map((({startControl:t,endControl:e,point:l})=>[h(t),h(e),h(l)].join(" ")));return`M ${t[0].x},${t[0].y} C ${r}`};
const createHobbyBezier = n;
const createHobbyCurve = h;
function createPolygon(vertices)
{
    var polygon = {vertices: vertices};

    var edges = [];
    var minX = (vertices.length > 0) ? vertices[0].x : undefined;
    var minY = (vertices.length > 0) ? vertices[0].y : undefined;
    var maxX = minX;
    var maxY = minY;

    for (var i = 0; i < polygon.vertices.length; i++) {
        var edge = {
            vertex1: vertices[i], 
            vertex2: vertices[(i + 1) % vertices.length], 
            polygon: polygon, 
            index: i
        };
        edge.outwardNormal = outwardEdgeNormal(edge);
        edge.inwardNormal = inwardEdgeNormal(edge);
        edges.push(edge);
        var x = vertices[i].x;
        var y = vertices[i].y;
        minX = Math.min(x, minX);
        minY = Math.min(y, minY);
        maxX = Math.max(x, maxX);
        maxY = Math.max(y, maxY);
    }                       
    
    polygon.edges = edges;
    polygon.minX = minX;
    polygon.minY = minY;
    polygon.maxX = maxX;
    polygon.maxY = maxY;

    return polygon;
}

function inwardEdgeNormal(edge)
{
    // Assuming that polygon vertices are in clockwise order
    var dx = edge.vertex2.x - edge.vertex1.x;
    var dy = edge.vertex2.y - edge.vertex1.y;
    var edgeLength = Math.sqrt(dx*dx + dy*dy);
    return {x: -dy/edgeLength, y: dx/edgeLength};
}

function outwardEdgeNormal(edge)
{
    var n = inwardEdgeNormal(edge);
    return {x: -n.x, y: -n.y};
}

function getPaddingVertices(polygon, shapePadding)
{
		var offsetEdges = [];
    for (var i = 0; i < polygon.edges.length; i++) {
        var edge = polygon.edges[i];
        var dx = edge.inwardNormal.x * shapePadding;
        var dy = edge.inwardNormal.y * shapePadding;
        offsetEdges.push(createOffsetEdge(edge, dx, dy));
    }
    var vertices = [];
    for (var i = 0; i < offsetEdges.length; i++) {
        var thisEdge = offsetEdges[i];
        var prevEdge = offsetEdges[(i + offsetEdges.length - 1) % offsetEdges.length];
        var vertex = edgesIntersection(prevEdge, thisEdge);
        if (vertex)
            vertices.push(vertex);
        else {
            //we dont need extra curves in this case
            //var arcCenter = polygon.edges[i].vertex1;
            //appendArc(vertices, arcCenter, shapePadding, prevEdge.vertex2, thisEdge.vertex1, true);
					
					  // Calculate midpoint between the edges
            var midPoint = {
                x: (prevEdge.vertex2.x + thisEdge.vertex1.x) / 2,
                y: (prevEdge.vertex2.y + thisEdge.vertex1.y) / 2
            };
            vertices.push(midPoint);
        }
    }

    return vertices;
}


function createOffsetEdge(edge, dx, dy)
{
    return {
        vertex1: {x: edge.vertex1.x + dx, y: edge.vertex1.y + dy},
        vertex2: {x: edge.vertex2.x + dx, y: edge.vertex2.y + dy}
    };
}

// based on http://local.wasp.uwa.edu.au/~pbourke/geometry/lineline2d/, edgeA => "line a", edgeB => "line b"
function edgesIntersection(edgeA, edgeB)
{
    var den = (edgeB.vertex2.y - edgeB.vertex1.y) * (edgeA.vertex2.x - edgeA.vertex1.x) - (edgeB.vertex2.x - edgeB.vertex1.x) * (edgeA.vertex2.y - edgeA.vertex1.y);
    if (den == 0)
        return null;  // lines are parallel or conincident

    var ua = ((edgeB.vertex2.x - edgeB.vertex1.x) * (edgeA.vertex1.y - edgeB.vertex1.y) - (edgeB.vertex2.y - edgeB.vertex1.y) * (edgeA.vertex1.x - edgeB.vertex1.x)) / den;
    var ub = ((edgeA.vertex2.x - edgeA.vertex1.x) * (edgeA.vertex1.y - edgeB.vertex1.y) - (edgeA.vertex2.y - edgeA.vertex1.y) * (edgeA.vertex1.x - edgeB.vertex1.x)) / den;

    if (ua < 0 || ub < 0 || ua > 1 || ub > 1)
        return null;

    return {x: edgeA.vertex1.x + ua * (edgeA.vertex2.x - edgeA.vertex1.x),  y: edgeA.vertex1.y + ua * (edgeA.vertex2.y - edgeA.vertex1.y)};
}

function appendArc(vertices, center, radius, startVertex, endVertex, isPaddingBoundary)
{
    const twoPI = Math.PI * 2;
    var startAngle = Math.atan2(startVertex.y - center.y, startVertex.x - center.x);
    var endAngle = Math.atan2(endVertex.y - center.y, endVertex.x - center.x);
    if (startAngle < 0)
        startAngle += twoPI;
    if (endAngle < 0)
        endAngle += twoPI;
    var arcSegmentCount = 5; // An odd number so that one arc vertex will be eactly arcRadius from center.
    var angle = ((startAngle > endAngle) ? (startAngle - endAngle) : (startAngle + twoPI - endAngle));
    var angle5 =  ((isPaddingBoundary) ? -angle : twoPI - angle) / arcSegmentCount;

    vertices.push(startVertex);
    for (var i = 1; i < arcSegmentCount; ++i) {
        var angle = startAngle + angle5 * i;
        var vertex = {
            x: center.x + Math.cos(angle) * radius,
            y: center.y + Math.sin(angle) * radius,
        };
        vertices.push(vertex);
    }
    vertices.push(endVertex);
}
// Organificial by Vamoss: Hobby curves, inset polygons and conic gradients retained.
let nodes=[],sculptTime=0,sculptPalette='citrus',breathing=true,held=new Map();
const SCULPT={citrus:['#f4df69','#f0a247','#ec684d','#8fbd90','#e8db9a'],candy:['#fbd4dc','#e981b8','#f5a577','#989cd4','#d84e86'],lagoon:['#bcece4','#67c3be','#497b96','#ccc38e','#f8e8b4']};
function resetSculpt(){nodes=[];for(let i=0;i<9;i++){let a=i*TWO_PI/9,r=min(width*.34,height*.29)*random(.72,1.12);let x=width*.5+cos(a)*r,y=height*.45+sin(a)*r;nodes.push({x,y,bx:x,by:y,phase:random(TWO_PI)})}held.clear()}
function setup(){artCanvas();resetSculpt();Studio.onDown=p=>{let best=60,idx=-1;nodes.forEach((n,i)=>{let d=dist(p.x,p.y,n.x,n.y);if(d<best){best=d;idx=i}});if(idx<0&&nodes.length<18){let best=Infinity;for(let i=0;i<nodes.length;i++){let n=nodes[i],q=nodes[(i+1)%nodes.length],d=dist(p.x,p.y,(n.x+q.x)/2,(n.y+q.y)/2);if(d<best){best=d;idx=i+1}}nodes.splice(idx,0,{x:p.x,y:p.y,bx:p.x,by:p.y,phase:random(TWO_PI)})}if(idx>=0)held.set(p.id,nodes[idx])};Studio.onMove=p=>{let n=held.get(p.id);if(n){n.x=n.bx=constrain(p.x,20,width-20);n.y=n.by=constrain(p.y,90,height-150)}};Studio.onUp=p=>held.delete(p.id);Studio.onTool=n=>{if(n==='breathe'){breathing=!breathing;document.querySelector('[data-tool=breathe]').setAttribute('aria-pressed',breathing)}else{sculptPalette=n;Studio.select('palette',n)}};Studio.onReset=resetSculpt}
function drawHobby(v){if(v.length<3)return;const box=createPolygon(nodes),left=box.minX-12,right=box.maxX+12,top=box.minY-12,bottom=box.maxY+12;const safe=q=>({x:constrain(Number.isFinite(q.x)?q.x:width*.5,left,right),y:constrain(Number.isFinite(q.y)?q.y:height*.45,top,bottom)});const curves=createHobbyBezier(v,{tension:1,cyclic:true});beginShape();let first=safe(v[0]);vertex(first.x,first.y);for(const c of curves){const a=safe(c.startControl),b=safe(c.endControl),p=safe(c.point);bezierVertex(a.x,a.y,b.x,b.y,p.x,p.y)}endShape(CLOSE)}
function draw(){if(Studio.paused||Studio.suspended)return;sculptTime++;background('#f6f1e6');const cs=SCULPT[sculptPalette];for(const n of nodes)if(![...held.values()].includes(n)){n.x=lerp(n.x,n.bx+(breathing?sin(sculptTime*.018+n.phase)*7:0),.14);n.y=lerp(n.y,n.by+(breathing?cos(sculptTime*.02+n.phase)*8:0),.14)}
 const ctx=drawingContext;let poly=createPolygon(nodes),cx=(poly.minX+poly.maxX)/2,cy=(poly.minY+poly.maxY)/2;
 noStroke();ctx.shadowColor='#73544d25';ctx.shadowBlur=28;ctx.shadowOffsetY=13;
 for(let layer=0;layer<5;layer++){let gradient=ctx.createConicGradient(sculptTime*.001+layer*.6,cx,cy);for(let j=0;j<=cs.length;j++)gradient.addColorStop(j/cs.length,cs[(j+layer)%cs.length]);ctx.fillStyle=gradient;drawHobby(poly.vertices);ctx.shadowBlur=0;ctx.shadowOffsetY=0;let pad=min(width,height)*.028;let v=getPaddingVertices(poly,pad);if(v.length<3)break;poly=createPolygon(v)}
 stroke('#ffffff65');strokeWeight(.9);noFill();drawHobby(nodes);for(const n of nodes){ctx.shadowColor='#4b373b44';ctx.shadowBlur=5;ctx.shadowOffsetY=2;noStroke();fill('#fffdf3');circle(n.x,n.y,width<500?13:17);ctx.shadowBlur=0;ctx.shadowOffsetY=0;fill('#d6c8b9');circle(n.x+1,n.y+1,3)}
}
