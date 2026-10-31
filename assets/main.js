// TFL Logistics – site scripts
document.getElementById('burger').onclick = () => document.getElementById('menu').classList.toggle('open');
document.getElementById('fab').onclick = e => { e.preventDefault(); document.getElementById('fabmenu').classList.toggle('open'); };
// ===== animated hero (motion header) =====
(function(){
  const cv=document.getElementById('herocv'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W,H,dpr;
  function size(){dpr=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  addEventListener('resize',size);size();
  // deterministic noise for hills
  const hill=(x,seed,amp,f)=>Math.sin(x*f+seed)*amp+Math.sin(x*f*2.3+seed*1.7)*amp*.45+Math.sin(x*f*5.1+seed*.3)*amp*.15;
  const trees=[...Array(60)].map((_,i)=>({x:i*97%5000,s:.7+((i*37)%10)/20}));
  const trucks=[
    {x:-200,v:150,dir:1,lane:0,col:'#f0963a'},
    {x:900,v:110,dir:1,lane:0,col:'#ffffff'},
    {x:1400,v:170,dir:-1,lane:1,col:'#f0963a'},
    {x:200,v:130,dir:-1,lane:1,col:'#7b7a75'}
  ];
  function drawTruck(x,y,s,dir,col){
    ctx.save();ctx.translate(x,y);ctx.scale(s*dir,s);
    // trailer
    ctx.fillStyle=col;ctx.fillRect(-120,-52,150,46);
    ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(-120,-14,150,8);
    ctx.save();ctx.scale(dir,1);ctx.fillStyle=col==='#f0963a'?'#fff':'#f0963a';ctx.font='900 22px Arial Black,Arial';ctx.textAlign='center';ctx.fillText('TFL',-45*dir,-22);ctx.restore();
    // cab
    ctx.fillStyle='#2d2d2d';ctx.fillRect(34,-48,40,42);
    ctx.fillStyle='#9fb6c8';ctx.fillRect(56,-44,16,16);
    ctx.fillStyle='#ffd66b';ctx.fillRect(72,-14,4,6);
    // chassis + wheels
    ctx.fillStyle='#1d1d1d';ctx.fillRect(-120,-8,196,6);
    ctx.fillStyle='#111';[-100,-75,10,58].forEach(w=>{ctx.beginPath();ctx.arc(w,0,9,0,7);ctx.fill();});
    ctx.restore();
  }
  let t0=performance.now(),cam=0;
  function frame(now){
    const dt=Math.min((now-t0)/1000,.05);t0=now;cam+=dt*60;
    // sky
    const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#b8862f');g.addColorStop(.55,'#e7bd64');g.addColorStop(1,'#f3d58f');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    // sun
    const sx=W*.78,sy=H*.3;const sg=ctx.createRadialGradient(sx,sy,10,sx,sy,H*.45);sg.addColorStop(0,'rgba(255,240,190,.95)');sg.addColorStop(.2,'rgba(255,225,150,.5)');sg.addColorStop(1,'rgba(255,220,140,0)');
    ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);
    // hill layers (parallax)
    const layers=[{y:.45,a:40,f:.004,s:.15,c:'#9a8840',seed:1},{y:.55,a:34,f:.006,s:.3,c:'#7c7531',seed:4},{y:.64,a:26,f:.008,s:.55,c:'#5d5c26',seed:9}];
    layers.forEach(L=>{ctx.fillStyle=L.c;ctx.beginPath();ctx.moveTo(0,H);
      for(let x=0;x<=W+10;x+=10){ctx.lineTo(x,H*L.y+hill(x+cam*L.s*6,L.seed,L.a,L.f));}
      ctx.lineTo(W,H);ctx.fill();});
    // power lines
    ctx.strokeStyle='rgba(40,35,20,.35)';ctx.lineWidth=1.2;
    for(let k=0;k<2;k++){ctx.beginPath();for(let x=0;x<=W;x+=20){const y=H*.18+k*14+Math.sin((x+cam*1.2)/260)*18+x*.04;x?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
    // tree line near road
    const roadY=H*.66;
    ctx.fillStyle='#3d4019';ctx.fillRect(0,roadY-40,W,40);
    trees.forEach(tr=>{const x=((tr.x-cam*4)%5000+5000)%5000-100; if(x>W+50)return;
      ctx.fillStyle='#34371a';ctx.beginPath();ctx.ellipse(x,roadY-40,22*tr.s,46*tr.s,0,0,7);ctx.fill();
      ctx.fillStyle='#c98a2c';ctx.globalAlpha=.35;ctx.beginPath();ctx.ellipse(x+6,roadY-52*tr.s,12*tr.s,20*tr.s,0,0,7);ctx.fill();ctx.globalAlpha=1;});
    // road
    ctx.fillStyle='#3a3a38';ctx.fillRect(0,roadY-6,W,H-roadY+6);
    ctx.fillStyle='#2e2e2c';ctx.fillRect(0,roadY-6,W,4);
    // lane dashes
    ctx.fillStyle='#f0963a';const off=(cam*8)%80;
    for(let x=-off;x<W;x+=80)ctx.fillRect(x,roadY+(H-roadY)*.32,44,4);
    // trucks
    const s=Math.max(.6,Math.min(1.1,W/1200));
    trucks.forEach(tk=>{tk.x+=tk.v*tk.dir*dt*(reduce?0:1);
      if(tk.dir>0&&tk.x>W+250)tk.x=-250-Math.random()*600;
      if(tk.dir<0&&tk.x<-250)tk.x=W+250+Math.random()*600;
      const y=roadY+(H-roadY)*(tk.lane?0.5:0.22);
      drawTruck(tk.x,y,s*(tk.lane?1.05:.9),tk.dir,tk.col);});
    if(!reduce)requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

document.querySelectorAll('.js-form').forEach(f => f.addEventListener('submit', e => {
  e.preventDefault(); f.querySelector('.ok').style.display = 'block'; f.querySelector('button[type=submit]').style.display = 'none';
}));
