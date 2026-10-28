// Typing effect
const roles=['Java Full Stack Developer','Software Developer','Angular + MySQL builder'];
const typed=document.getElementById('typed');
let r=0,c=0,del=false;
function type(){
  const word=roles[r];
  typed.textContent=word.slice(0,c);
  if(!del&&c===word.length){del=true;return setTimeout(type,1400)}
  if(del&&c===0){del=false;r=(r+1)%roles.length}
  c+=del?-1:1;
  setTimeout(type,del?35:75);
}
type();

// 2D canvas: drifting "database tables" that link to each other and to the mouse
const cv=document.getElementById('bg'),ctx=cv.getContext('2d');
const labels=['Java','SQL','Angular','MySQL','OOP','Git','HTML5','CSS3','JS','3NF','{ }','List<>','SELECT','Map<>'];
const colors=['#5b3df5','#ff6b57','#25b894','#ffc857'];
const mouse={x:-999,y:-999};
let nodes=[],W,H;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize(){
  const d=devicePixelRatio||1;
  W=cv.clientWidth;H=cv.clientHeight;
  cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0);
  const n=Math.min(labels.length,Math.max(7,Math.floor(W/90)));
  nodes=Array.from({length:n},(_,i)=>({
    x:Math.random()*W,y:Math.random()*H,
    vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,
    t:labels[i],col:colors[i%4],w:0
  }));
}
function box(n){ctx.font='600 14px DM Sans, sans-serif';n.w=ctx.measureText(n.t).width+26}
function draw(){
  ctx.clearRect(0,0,W,H);
  const ink=getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()||'#1d1b3a';
  for(const n of nodes){
    if(!reduce){n.x+=n.vx;n.y+=n.vy}
    if(n.x<0||n.x>W)n.vx*=-1;
    if(n.y<0||n.y>H)n.vy*=-1;
    // gentle push away from the cursor
    const dx=n.x-mouse.x,dy=n.y-mouse.y,d=Math.hypot(dx,dy);
    if(d<110&&!reduce){n.x+=dx/d*2;n.y+=dy/d*2}
    box(n);
  }
  ctx.lineWidth=1.5;
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<220){ctx.globalAlpha=1-d/220;ctx.strokeStyle=a.col;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
    }
    const m=Math.hypot(nodes[i].x-mouse.x,nodes[i].y-mouse.y);
    if(m<260){ctx.globalAlpha=1-m/260;ctx.strokeStyle=ink;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke();ctx.setLineDash([])}
  }
  ctx.globalAlpha=1;
  for(const n of nodes){
    const x=n.x-n.w/2,y=n.y-15;
    ctx.fillStyle=getComputedStyle(document.body).backgroundColor;
    ctx.strokeStyle=n.col;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.roundRect(x,y,n.w,30,8);ctx.fill();ctx.stroke();
    ctx.fillStyle=ink;ctx.textBaseline='middle';ctx.textAlign='center';
    ctx.font='600 14px DM Sans, sans-serif';ctx.fillText(n.t,n.x,n.y+1);
  }
  requestAnimationFrame(draw);
}
const hero=document.getElementById('home');
hero.addEventListener('pointermove',e=>{const b=cv.getBoundingClientRect();mouse.x=e.clientX-b.left;mouse.y=e.clientY-b.top});
hero.addEventListener('pointerleave',()=>{mouse.x=mouse.y=-999});
addEventListener('resize',resize);
resize();draw();

// Reveal cards on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.card,.timeline li').forEach((el,i)=>{el.classList.add('reveal');el.style.transitionDelay=(i%3)*90+'ms';io.observe(el)});
document.getElementById('yr').textContent=new Date().getFullYear();
