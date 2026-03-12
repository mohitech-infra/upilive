INSERT INTO overlay_templates (id, name, description, gradient, is_premium, is_active, sort_order, full_code) VALUES
('classic-green', 'Classic Green', 'Clean minimal alert with green accent glow', 'linear-gradient(135deg,#0d1f0e,#1a3a1c)', false, true, 1, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Inter'',sans-serif}
      .card{background:rgba(0,0,0,.88);border:2px solid #22c55e;border-radius:18px;padding:22px 36px;text-align:center;animation:slideDown .5s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 0 40px rgba(34,197,94,.25),0 8px 32px rgba(0,0,0,.5)}
      .lbl{font-size:10px;letter-spacing:3px;color:#22c55e;opacity:.8;text-transform:uppercase;margin-bottom:8px}
      .donor{font-size:22px;font-weight:900;color:#fff;margin-bottom:4px}
      .amount{font-size:48px;font-weight:900;color:#22c55e;line-height:1;margin:6px 0;text-shadow:0 0 20px rgba(34,197,94,.5)}
      .msg{font-size:13px;color:rgba(255,255,255,.55);margin-top:8px}
      @keyframes slideDown{from{transform:translateY(-60px);opacity:0}to{transform:translateY(0);opacity:1}}
      @keyframes slideUp{to{transform:translateY(-60px);opacity:0}}
    
</style>
</head>
<body>
<div data-alert class="card"><div class="lbl">Donation Alert</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('purple-wave', 'Purple Wave', 'Elegant purple gradient with animated wave border', 'linear-gradient(135deg,#1a0533,#3b0764)', false, true, 2, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Poppins'',sans-serif}
      .wrap{position:relative;padding:3px;border-radius:20px;background:linear-gradient(135deg,#a855f7,#7c3aed,#a855f7);animation:fadeIn .6s both}
      .card{background:linear-gradient(135deg,#130024,#1e0040);border-radius:18px;padding:24px 40px;text-align:center}
      .wave{position:absolute;bottom:0;left:0;right:0;height:4px;border-radius:0 0 18px 18px;background:linear-gradient(90deg,#a855f7,#ec4899,#a855f7);background-size:200%;animation:wave 2s linear infinite}
      .lbl{font-size:9px;letter-spacing:4px;color:#a855f7;text-transform:uppercase;opacity:.8;margin-bottom:10px}
      .donor{font-size:20px;font-weight:700;color:#e9d5ff;margin-bottom:6px}
      .amount{font-size:44px;font-weight:900;color:#a855f7;text-shadow:0 0 30px rgba(168,85,247,.6)}
      .msg{font-size:12px;color:rgba(255,255,255,.45);margin-top:8px}
      @keyframes wave{from{background-position:0 0}to{background-position:200% 0}}
      @keyframes fadeIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
    
</style>
</head>
<body>
<div data-alert class="wrap"><div class="card"><div class="lbl">💜 Super Donation</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div><div class="wave"></div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('dark-minimal', 'Dark Minimal', 'Ultra-clean dark style with gradient separator', 'linear-gradient(135deg,#0a0a0f,#111118)', false, true, 3, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Inter'',sans-serif}
      .card{background:rgba(15,15,20,.95);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:20px 32px;text-align:center;animation:appear .4s ease both;box-shadow:0 20px 60px rgba(0,0,0,.6)}
      .top{font-size:10px;letter-spacing:2px;color:rgba(255,255,255,.35);margin-bottom:12px;text-transform:uppercase}
      .donor{font-size:18px;font-weight:600;color:#fff;margin-bottom:4px}
      .sep{width:40px;height:2px;background:linear-gradient(90deg,#22c55e,#a855f7);margin:10px auto}
      .amount{font-size:42px;font-weight:900;color:#fff;letter-spacing:-2px}
      .msg{font-size:12px;color:rgba(255,255,255,.35);margin-top:12px;font-style:italic}
      @keyframes appear{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    
</style>
</head>
<body>
<div data-alert class="card"><div class="top">Donation Alert · {{source}}</div><div class="donor">{{donor_name}}</div><div class="sep"></div><div class="amount">₹{{amount}}</div><div class="msg">"{{message}}"</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('fire-orange', 'Fire Orange', 'Hot fire-themed alert with warm glow and countdown bar', 'linear-gradient(135deg,#1f0a00,#3d1500)', false, true, 4, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Oswald'',sans-serif}
      .card{background:rgba(0,0,0,.9);border:2px solid #f97316;border-radius:16px;padding:20px 36px;text-align:center;animation:fireIn .5s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 0 50px rgba(249,115,22,.3),0 8px 32px rgba(0,0,0,.5)}
      .emoji{font-size:28px;margin-bottom:4px}
      .donor{font-size:20px;font-weight:400;color:#fed7aa;letter-spacing:1px;margin-bottom:4px}
      .amount{font-size:52px;font-weight:700;color:#f97316;text-shadow:0 0 30px rgba(249,115,22,.7);line-height:1}
      .msg{font-size:13px;color:rgba(255,255,255,.5);margin-top:10px}
      .bar-wrap{height:4px;background:rgba(255,255,255,.1);border-radius:2px;margin-top:14px;overflow:hidden}
      .bar{height:100%;background:linear-gradient(90deg,#ea580c,#f97316,#fbbf24);animation:drain 5.5s linear forwards}
      @keyframes fireIn{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:1}}
      @keyframes drain{from{width:100%}to{width:0}}
    
</style>
</head>
<body>
<div data-alert class="card"><div class="emoji">🔥</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div><div class="bar-wrap"><div class="bar"></div></div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('blue-pop', 'Blue Pop', 'Bright blue pop-in with satisfying bounce effect', 'linear-gradient(135deg,#001233,#002366)', false, true, 5, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Montserrat'',sans-serif}
      .card{background:rgba(0,10,40,.94);border:2px solid #3b82f6;border-radius:20px;padding:22px 40px;text-align:center;animation:pop .5s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 0 40px rgba(59,130,246,.35),inset 0 1px 0 rgba(255,255,255,.06)}
      .badge{display:inline-block;background:rgba(59,130,246,.2);border:1px solid rgba(59,130,246,.4);border-radius:20px;padding:3px 12px;font-size:10px;color:#93c5fd;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px}
      .donor{font-size:22px;font-weight:700;color:#fff;margin-bottom:6px}
      .amount{font-size:50px;font-weight:900;color:#3b82f6;text-shadow:0 0 25px rgba(59,130,246,.6);line-height:1}
      .msg{font-size:12px;color:rgba(255,255,255,.4);margin-top:10px}
      @keyframes pop{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}
    
</style>
</head>
<body>
<div data-alert class="card"><div class="badge">⚡ Donation</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('neon-cyber', 'Neon Cyber', 'Cyberpunk neon border with rotating gradient hue', 'linear-gradient(135deg,#0a0a1a,#001a2e)', true, true, 10, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Orbitron'',sans-serif}
      @property --hue{syntax:''<angle>'';initial-value:0deg;inherits:false}
      .outer{padding:3px;border-radius:22px;background:conic-gradient(from var(--hue),#0ff,#a855f7,#0ff);animation:rotate 3s linear infinite,fadeIn .7s ease both}
      .card{background:#06060f;border-radius:20px;padding:28px 44px;text-align:center;position:relative;overflow:hidden}
      .scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,255,.04) 3px,rgba(0,255,255,.04) 4px);pointer-events:none}
      .lbl{font-size:8px;letter-spacing:5px;color:#0ff;opacity:.6;text-transform:uppercase;margin-bottom:14px}
      .donor{font-size:18px;font-weight:700;color:#e0f7ff;margin-bottom:8px}
      .amount{font-size:46px;font-weight:900;color:#0ff;text-shadow:0 0 20px #0ff,0 0 40px rgba(0,255,255,.4);line-height:1}
      .src{font-size:10px;color:rgba(0,255,255,.4);margin-top:6px;letter-spacing:2px}
      .msg{font-size:12px;color:rgba(255,255,255,.35);margin-top:6px}
      @keyframes rotate{to{--hue:360deg}}
      @keyframes fadeIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
    
</style>
</head>
<body>
<div data-alert class="outer"><div class="card"><div class="scan"></div><div class="lbl">System Alert</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="src">via {{source}}</div><div class="msg">{{message}}</div></div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('retro-pixel', 'Retro Pixel', 'Old-school pixel gaming aesthetic with scanlines', 'linear-gradient(135deg,#1a0033,#000d1a)', true, true, 11, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Press Start 2P'',monospace}
      .card{background:#0d001a;border:4px solid #ff00ff;padding:24px 28px;position:relative;overflow:hidden;animation:pixelIn .3s steps(8) both;image-rendering:pixelated}
      .scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.35) 2px,rgba(0,0,0,.35) 4px);pointer-events:none}
      .hdr{color:#ff00ff;font-size:9px;text-align:center;margin-bottom:16px;animation:blink 1s step-end infinite}
      .donor{color:#00ffff;font-size:11px;margin-bottom:8px}
      .amount{color:#ffff00;font-size:22px;margin-bottom:8px;text-shadow:2px 2px #ff8800}
      .msg{color:#fff;font-size:8px;opacity:.7;line-height:1.8}
      .src{font-size:7px;color:#ff00ff;opacity:.5;margin-top:10px}
      @keyframes pixelIn{from{clip-path:polygon(0 50%,100% 50%,100% 50%,0 50%)}to{clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}}
      @keyframes blink{50%{opacity:0}}
    
</style>
</head>
<body>
<div data-alert class="card"><div class="scan"></div><div class="hdr">⚡ SUPERCHAT ⚡</div><div class="donor">{{donor_name}}</div><div class="amount">₹ {{amount}}</div><div class="msg">{{message}}</div><div class="src">{{source}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('gold-prestige', 'Gold Prestige', 'Luxurious gold and black premium award-style alert', 'linear-gradient(135deg,#1a1200,#2d1f00)', true, true, 12, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Playfair Display'',serif}
      .outer{padding:3px;border-radius:20px;background:linear-gradient(135deg,#b8860b,#ffd700,#b8860b,#daa520);animation:fadeIn .8s ease both}
      .card{background:linear-gradient(160deg,#0a0800,#1a1200);border-radius:18px;padding:26px 44px;text-align:center}
      .crown{font-size:32px;margin-bottom:8px;animation:bounce .6s cubic-bezier(.34,1.56,.64,1) both .3s}
      .lbl{font-size:9px;letter-spacing:4px;color:#b8860b;text-transform:uppercase;margin-bottom:10px}
      .donor{font-size:20px;font-weight:700;color:#fef9c3;margin-bottom:6px}
      .amount{font-size:48px;font-weight:900;color:#ffd700;text-shadow:0 0 30px rgba(255,215,0,.5);line-height:1}
      .divider{width:60px;height:1px;background:linear-gradient(90deg,transparent,#ffd700,transparent);margin:12px auto}
      .msg{font-size:13px;color:rgba(255,215,0,.5);font-style:italic}
      @keyframes fadeIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
      @keyframes bounce{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}
    
</style>
</head>
<body>
<div data-alert class="outer"><div class="card"><div class="crown">👑</div><div class="lbl">Elite Donation</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="divider"></div><div class="msg">{{message}}</div></div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('holographic', 'Holographic', 'Stunning holographic rainbow shimmer effect', 'linear-gradient(135deg,#0f0f1a,#1a0f1a)', true, true, 13, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700;900&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Exo 2'',sans-serif}
      @keyframes holo{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @keyframes pop{from{opacity:0;transform:scale(.8) rotateX(20deg)}to{opacity:1;transform:scale(1) rotateX(0deg)}}
      .card{border-radius:20px;padding:3px;background:linear-gradient(135deg,#ff0080,#ff8c00,#40e0d0,#a855f7,#ff0080);background-size:400% 400%;animation:holo 3s linear infinite,pop .7s cubic-bezier(.34,1.56,.64,1) both}
      .inner{background:rgba(5,5,15,.92);border-radius:18px;padding:24px 40px;text-align:center;backdrop-filter:blur(10px)}
      .lbl{font-size:9px;letter-spacing:4px;text-transform:uppercase;background:linear-gradient(90deg,#ff0080,#40e0d0,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px}
      .donor{font-size:22px;font-weight:700;color:#fff;margin-bottom:6px}
      .amount{font-size:46px;font-weight:900;background:linear-gradient(90deg,#ff0080,#ff8c00,#40e0d0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
      .msg{font-size:12px;color:rgba(255,255,255,.4);margin-top:10px}
    
</style>
</head>
<body>
<div data-alert class="card"><div class="inner"><div class="lbl">✨ Holographic Alert</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('matrix-rain', 'Matrix Rain', 'Digital matrix green rain with glitch text effect', 'linear-gradient(135deg,#000f00,#001a00)', true, true, 14, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Share Tech Mono'',monospace}
      canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;opacity:.35}
      .card{position:relative;z-index:1;background:rgba(0,10,0,.9);border:1px solid #00ff41;border-radius:8px;padding:22px 36px;text-align:center;animation:glitchIn .4s steps(5) both;box-shadow:0 0 30px rgba(0,255,65,.2),inset 0 0 30px rgba(0,255,65,.05)}
      .lbl{font-size:10px;letter-spacing:3px;color:#00ff41;opacity:.7;margin-bottom:10px}
      .donor{font-size:20px;color:#00ff41;margin-bottom:6px;animation:glitch 4s infinite}
      .amount{font-size:44px;font-weight:700;color:#00ff41;text-shadow:0 0 15px #00ff41;line-height:1}
      .msg{font-size:11px;color:rgba(0,255,65,.5);margin-top:10px}
      @keyframes glitchIn{0%{clip-path:inset(0 100% 0 0)}100%{clip-path:inset(0 0 0 0)}}
      @keyframes glitch{0%,94%,100%{transform:none}96%{transform:skewX(-5deg) translateX(3px);color:#0ff}98%{transform:skewX(3deg) translateX(-2px);color:#f0f}}
    
</style>
</head>
<body>
<canvas id="c"></canvas><div data-alert class="card"><div class="lbl">[SYSTEM] DONATION DETECTED</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>
<script>
try{

      const c=document.getElementById(''c''),ctx=c.getContext(''2d'');
      c.width=window.innerWidth;c.height=window.innerHeight;
      const cols=Math.floor(c.width/16);const drops=Array(cols).fill(1);
      const chars=''アイウエオカキクケコ0123456789ABCDEF'';
      function draw(){ctx.fillStyle=''rgba(0,0,0,.05)'';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=''#00ff41'';ctx.font=''14px monospace'';drops.forEach((y,i)=>{const t=chars[Math.floor(Math.random()*chars.length)];ctx.fillText(t,i*16,y*16);if(y*16>c.height&&Math.random()>.975)drops[i]=0;drops[i]++;});}
      setInterval(draw,50);
    
setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('confetti-party', 'Confetti Party', 'Colorful confetti explosion for big celebration donations', 'linear-gradient(135deg,#1a0a2e,#0d0d1a)', true, true, 15, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700;900&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Poppins'',sans-serif}
      .card{background:rgba(10,10,20,.92);border:2px solid rgba(255,255,255,.15);border-radius:22px;padding:24px 40px;text-align:center;animation:popIn .6s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 20px 60px rgba(0,0,0,.5)}
      .emoji{font-size:36px;animation:spin .5s ease both .5s}
      .donor{font-size:22px;font-weight:700;color:#fff;margin:8px 0 4px}
      .amount{font-size:48px;font-weight:900;background:linear-gradient(135deg,#f59e0b,#ec4899,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
      .msg{font-size:13px;color:rgba(255,255,255,.5);margin-top:10px}
      @keyframes popIn{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}
      @keyframes spin{from{transform:rotate(-20deg) scale(.5)}to{transform:rotate(0) scale(1)}}
    
</style>
</head>
<body>
<div data-alert class="card"><div class="emoji">🎉</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>
<script>
try{

      if(typeof confetti!==''undefined''){
        const end=Date.now()+2000;
        (function frame(){confetti({particleCount:3,angle:60,spread:55,origin:{x:0},colors:[''#f59e0b'',''#ec4899'',''#a855f7'',''#22c55e'']});confetti({particleCount:3,angle:120,spread:55,origin:{x:1},colors:[''#3b82f6'',''#f97316'',''#0ff'']});if(Date.now()<end)requestAnimationFrame(frame);}());
      }
    
setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('glass-morphism', 'Glassmorphism', 'Premium frosted glass with aurora gradient background', 'linear-gradient(135deg,#0d1117,#161b22)', true, true, 16, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Inter'',sans-serif;position:relative}
      .blob1{position:fixed;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(168,85,247,.5),transparent 70%);top:-80px;left:-80px;animation:drift1 6s ease-in-out infinite}
      .blob2{position:fixed;width:250px;height:250px;border-radius:50%;background:radial-gradient(circle,rgba(59,130,246,.4),transparent 70%);bottom:-60px;right:-60px;animation:drift2 8s ease-in-out infinite}
      .card{position:relative;z-index:1;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-radius:24px;padding:28px 44px;text-align:center;animation:glassIn .7s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 8px 32px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.15)}
      .lbl{font-size:10px;letter-spacing:3px;color:rgba(255,255,255,.5);text-transform:uppercase;margin-bottom:12px}
      .donor{font-size:22px;font-weight:700;color:#fff;margin-bottom:6px}
      .amount{font-size:50px;font-weight:900;color:#fff;letter-spacing:-2px;line-height:1}
      .msg{font-size:13px;color:rgba(255,255,255,.4);margin-top:12px}
      @keyframes glassIn{from{opacity:0;transform:translateY(30px) scale(.9)}to{opacity:1;transform:translateY(0) scale(1)}}
      @keyframes drift1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,20px) scale(1.1)}}
      @keyframes drift2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-20px,-30px) scale(1.1)}}
    
</style>
</head>
<body>
<div class="blob1"></div><div class="blob2"></div><div data-alert class="card"><div class="lbl">✦ Donation Alert</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('gaming-hud', 'Gaming HUD', 'FPS game heads-up display with corner brackets', 'linear-gradient(135deg,#050510,#0a0a20)', true, true, 17, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&family=Audiowide&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Rajdhani'',sans-serif}
      .hud{position:relative;padding:24px 36px;animation:hudIn .4s ease both}
      .corner{position:absolute;width:18px;height:18px;border-color:#00ffcc;border-style:solid}
      .tl{top:0;left:0;border-width:2px 0 0 2px}
      .tr{top:0;right:0;border-width:2px 2px 0 0}
      .bl{bottom:0;left:0;border-width:0 0 2px 2px}
      .br{bottom:0;right:0;border-width:0 2px 2px 0}
      .inner{text-align:center}
      .alert-tag{font-family:''Audiowide'',sans-serif;font-size:9px;letter-spacing:4px;color:#00ffcc;text-transform:uppercase;margin-bottom:14px;opacity:.8}
      .donor{font-size:24px;font-weight:700;color:#fff;margin-bottom:4px;letter-spacing:2px}
      .amount{font-size:52px;font-weight:700;color:#00ffcc;font-family:''Audiowide'',sans-serif;text-shadow:0 0 20px rgba(0,255,204,.5);line-height:1}
      .hp-bar-wrap{height:3px;background:rgba(0,255,204,.15);border-radius:2px;margin-top:14px;overflow:hidden}
      .hp-bar{height:100%;background:#00ffcc;box-shadow:0 0 8px #00ffcc;animation:drain 5.5s linear forwards}
      .msg{font-size:13px;color:rgba(0,255,204,.45);margin-top:8px}
      @keyframes hudIn{from{opacity:0;transform:scaleX(.5)}to{opacity:1;transform:scaleX(1)}}
      @keyframes drain{from{width:100%}to{width:0}}
    
</style>
</head>
<body>
<div data-alert class="hud"><div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div><div class="inner"><div class="alert-tag">⬕ Donation Received</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div><div class="hp-bar-wrap"><div class="hp-bar"></div></div></div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('anime-sakura', 'Anime Sakura', 'Beautiful Japanese anime style with falling petals', 'linear-gradient(135deg,#1a0010,#2d0020)', true, true, 18, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Poppins:wght@700;900&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Poppins'',sans-serif;overflow:hidden}
      .petals{position:fixed;inset:0;pointer-events:none}
      .petal{position:absolute;font-size:16px;animation:fall linear infinite;opacity:.7}
      @keyframes fall{0%{transform:translateY(-20px) rotate(0deg);opacity:.8}100%{transform:translateY(110vh) rotate(360deg);opacity:0}}
      .card{position:relative;z-index:1;background:rgba(20,0,15,.9);border:2px solid rgba(236,72,153,.5);border-radius:24px;padding:24px 40px;text-align:center;animation:fadeUp .7s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 0 50px rgba(236,72,153,.2)}
      .lbl{font-size:10px;letter-spacing:3px;color:#ec4899;text-transform:uppercase;margin-bottom:12px;opacity:.8}
      .donor{font-size:22px;font-weight:700;color:#fda4af;margin-bottom:6px}
      .amount{font-size:50px;font-weight:900;color:#fff;text-shadow:0 0 20px rgba(236,72,153,.6);line-height:1}
      .msg{font-size:12px;color:rgba(253,164,175,.5);margin-top:10px;font-style:italic}
      .hr{width:50px;height:2px;background:linear-gradient(90deg,transparent,#ec4899,transparent);margin:10px auto}
      @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    
</style>
</head>
<body>
<div class="petals" id="petals"></div><div data-alert class="card"><div class="lbl">🌸 Donation</div><div class="donor">{{donor_name}}</div><div class="hr"></div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>
<script>
try{

      const p=document.getElementById(''petals'');
      for(let i=0;i<20;i++){const d=document.createElement(''div'');d.className=''petal'';d.textContent=''🌸'';d.style.left=Math.random()*100+''%'';d.style.animationDuration=(3+Math.random()*5)+''s'';d.style.animationDelay=(-Math.random()*5)+''s'';d.style.fontSize=(10+Math.random()*14)+''px'';p.appendChild(d);}
    
setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('vaporwave', 'Vaporwave', 'Retro synthwave aesthetic with grid and neon pinks', 'linear-gradient(180deg,#0d0221,#1a0a2e)', true, true, 19, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Rajdhani:wght@700&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Audiowide'',sans-serif;overflow:hidden}
      .grid{position:fixed;bottom:0;left:0;right:0;height:40%;background:linear-gradient(0deg,rgba(255,0,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,255,.12) 1px,transparent 1px);background-size:30px 30px;transform:perspective(200px) rotateX(60deg);transform-origin:bottom;opacity:.6}
      .sun{position:fixed;bottom:30%;left:50%;transform:translateX(-50%);width:120px;height:120px;border-radius:50%;background:linear-gradient(180deg,#ff6ec7,#ff0080);box-shadow:0 0 40px #ff0080;overflow:hidden}
      .sun-lines{position:absolute;bottom:0;left:0;right:0}
      .sun-line{height:6px;background:#0d0221;margin-bottom:4px}
      .sun-line:nth-child(1){margin-bottom:6px}.sun-line:nth-child(2){margin-bottom:7px}.sun-line:nth-child(3){margin-bottom:9px}
      .card{position:relative;z-index:10;background:rgba(10,2,30,.88);border:2px solid #ff6ec7;border-radius:12px;padding:20px 36px;text-align:center;animation:slideUp .6s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 0 30px rgba(255,110,199,.3),0 0 60px rgba(255,0,128,.2)}
      .lbl{font-size:8px;letter-spacing:5px;color:#ff6ec7;text-transform:uppercase;margin-bottom:12px}
      .donor{font-size:18px;color:#b4f5ff;margin-bottom:6px;font-family:''Rajdhani'',sans-serif;font-weight:700}
      .amount{font-size:44px;font-weight:400;color:#ff6ec7;text-shadow:0 0 20px #ff0080,3px 3px 0 #7c00ff;line-height:1}
      .msg{font-size:11px;color:rgba(180,245,255,.4);margin-top:10px}
      @keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
    
</style>
</head>
<body>
<div class="grid"></div><div class="sun"><div class="sun-lines"><div class="sun-line"></div><div class="sun-line"></div><div class="sun-line"></div></div></div><div data-alert class="card"><div class="lbl">▶ Donation Alert</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('crystal-diamond', 'Crystal Diamond', 'Luxurious crystal facet design with shimmer animation', 'linear-gradient(135deg,#0a0f1a,#040814)', true, true, 20, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Montserrat'',sans-serif}
      @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
      @keyframes popIn{from{transform:scale(.6) rotate(-5deg);opacity:0}to{transform:scale(1) rotate(0deg);opacity:1}}
      .card{background:linear-gradient(135deg,rgba(148,163,220,.08),rgba(96,130,215,.12),rgba(148,163,220,.08));border:1px solid rgba(148,163,220,.3);border-radius:24px;padding:28px 44px;text-align:center;animation:popIn .7s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 0 0 1px rgba(255,255,255,.05),0 20px 60px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.1)}
      .gem{font-size:32px;animation:popIn .5s ease both .3s}
      .lbl{font-size:9px;letter-spacing:4px;color:rgba(148,163,220,.7);text-transform:uppercase;margin:8px 0 12px}
      .donor{font-size:20px;font-weight:700;color:#e0e7ff;margin-bottom:8px}
      .amount{font-size:48px;font-weight:900;background:linear-gradient(90deg,#a5b4fc,#818cf8,#c7d2fe,#818cf8,#a5b4fc);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite;line-height:1}
      .msg{font-size:12px;color:rgba(200,210,255,.35);margin-top:12px}
    
</style>
</head>
<body>
<div data-alert class="card"><div class="gem">💎</div><div class="lbl">Premium Donation</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('lightning-storm', 'Lightning Storm', 'Electric storm with lightning flash on entry', 'linear-gradient(135deg,#04060f,#080a1a)', true, true, 21, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700;900&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Exo 2'',sans-serif;overflow:hidden}
      .flash{position:fixed;inset:0;background:#fff;opacity:0;animation:flash .6s ease both}
      @keyframes flash{0%{opacity:0}10%{opacity:.8}20%{opacity:0}30%{opacity:.4}40%{opacity:0}100%{opacity:0}}
      @keyframes stormIn{from{transform:translateY(-80px) scale(.8);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
      .card{position:relative;z-index:1;background:rgba(4,6,15,.94);border:2px solid #facc15;border-radius:16px;padding:22px 38px;text-align:center;animation:stormIn .6s cubic-bezier(.34,1.56,.64,1) both .2s;box-shadow:0 0 40px rgba(250,204,21,.25),0 8px 32px rgba(0,0,0,.6)}
      .bolt{font-size:32px;animation:bolt .3s steps(2) infinite}
      @keyframes bolt{0%{opacity:1}50%{opacity:.4}100%{opacity:1}}
      .donor{font-size:20px;font-weight:700;color:#fef08a;margin:8px 0 4px;letter-spacing:1px}
      .amount{font-size:50px;font-weight:900;color:#facc15;text-shadow:0 0 20px rgba(250,204,21,.7),0 0 40px rgba(250,204,21,.3);line-height:1}
      .msg{font-size:12px;color:rgba(254,240,138,.4);margin-top:10px}
    
</style>
</head>
<body>
<div class="flash"></div><div data-alert class="card"><div class="bolt">⚡</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('ocean-wave', 'Ocean Wave', 'Calm ocean-inspired animated wave background', 'linear-gradient(135deg,#001a2e,#002d4a)', true, true, 22, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Poppins'',sans-serif;overflow:hidden}
      .waves{position:fixed;bottom:0;left:0;right:0;height:120px}
      .wave1{position:absolute;bottom:0;width:200%;height:100%;background:url("data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 1200 120''%3E%3Cpath d=''M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z'' fill=''rgba(6,182,212,0.15)''/%3E%3C/svg%3E") repeat-x;animation:wave 5s linear infinite}
      .wave2{position:absolute;bottom:0;width:200%;height:80%;background:url("data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 1200 120''%3E%3Cpath d=''M0,80 C400,0 800,120 1200,40 L1200,120 L0,120 Z'' fill=''rgba(6,182,212,0.1)''/%3E%3C/svg%3E") repeat-x;animation:wave 7s linear infinite reverse}
      @keyframes wave{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      .card{position:relative;z-index:1;background:rgba(0,15,30,.88);border:2px solid rgba(6,182,212,.5);border-radius:22px;padding:24px 40px;text-align:center;animation:riseUp .7s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 0 40px rgba(6,182,212,.2)}
      .lbl{font-size:10px;letter-spacing:3px;color:#06b6d4;text-transform:uppercase;margin-bottom:12px;opacity:.8}
      .donor{font-size:22px;font-weight:700;color:#e0f2fe;margin-bottom:6px}
      .amount{font-size:48px;font-weight:900;color:#06b6d4;text-shadow:0 0 20px rgba(6,182,212,.5);line-height:1}
      .msg{font-size:12px;color:rgba(224,242,254,.4);margin-top:10px}
      @keyframes riseUp{from{transform:translateY(50px);opacity:0}to{transform:translateY(0);opacity:1}}
    
</style>
</head>
<body>
<div class="waves"><div class="wave1"></div><div class="wave2"></div></div><div data-alert class="card"><div class="lbl">🌊 Donation Alert</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('neon-sign', 'Neon Sign', 'Flickering neon sign effect like a retro bar sign', 'linear-gradient(135deg,#03000a,#06001a)', true, true, 23, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Pacifico'',cursive;background:#03000a;overflow:hidden}
      .card{text-align:center;padding:30px 40px;animation:appear .5s ease both}
      .sign-border{display:inline-block;border:3px solid rgba(255,50,100,.7);border-radius:16px;padding:20px 36px;box-shadow:0 0 15px rgba(255,50,100,.5),0 0 30px rgba(255,50,100,.3),inset 0 0 15px rgba(255,50,100,.1);animation:flicker 4s steps(1) infinite}
      .dot1,.dot2,.dot3{display:inline-block;width:8px;height:8px;border-radius:50%;background:#ff3264;box-shadow:0 0 8px #ff3264;margin:0 6px;animation:blinkDot 2s ease infinite}
      .dot2{animation-delay:.3s}.dot3{animation-delay:.6s}
      .lbl{font-size:11px;letter-spacing:3px;color:rgba(255,100,150,.7);text-transform:uppercase;margin-bottom:16px;font-family:sans-serif}
      .donor{font-size:22px;color:#ff80a0;text-shadow:0 0 10px #ff3264,0 0 20px rgba(255,50,100,.5);margin-bottom:6px}
      .amount{font-size:48px;color:#ff3264;text-shadow:0 0 15px #ff3264,0 0 30px rgba(255,50,100,.6),0 0 60px rgba(255,50,100,.3);animation:glow 2s ease-in-out infinite alternate}
      .msg{font-size:13px;color:rgba(255,100,150,.45);margin-top:12px;font-family:sans-serif;font-style:italic}
      @keyframes flicker{0%,90%,100%{opacity:1}91%{opacity:.6}92%{opacity:1}93%{opacity:.4}94%{opacity:1}}
      @keyframes glow{from{text-shadow:0 0 10px #ff3264,0 0 20px rgba(255,50,100,.5)}to{text-shadow:0 0 20px #ff3264,0 0 40px rgba(255,50,100,.8),0 0 60px rgba(255,50,100,.4)}}
      @keyframes blinkDot{0%,80%,100%{opacity:1}90%{opacity:.2}}
      @keyframes appear{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
    
</style>
</head>
<body>
<div data-alert class="card"><div class="sign-border"><div class="lbl">✦ Donation ✦</div><div class="dot1"></div><div class="dot2"></div><div class="dot3"></div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('aurora-borealis', 'Aurora Borealis', 'Northern lights aurora effect with flowing colors', 'linear-gradient(135deg,#000d1a,#001a0d)', true, true, 24, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}

      body{font-family:''Inter'',sans-serif;overflow:hidden}
      .aurora{position:fixed;inset:0;background:linear-gradient(180deg,transparent 0%,rgba(0,255,128,.06) 30%,rgba(0,200,255,.08) 60%,rgba(128,0,255,.06) 100%);animation:aurora 6s ease-in-out infinite}
      .aurora2{position:fixed;inset:0;background:linear-gradient(120deg,transparent 20%,rgba(0,255,200,.05) 50%,rgba(0,100,255,.07) 80%);animation:aurora 8s ease-in-out infinite reverse .5s}
      @keyframes aurora{0%,100%{transform:scaleY(1) translateY(0)}50%{transform:scaleY(1.1) translateY(-10px)}}
      .card{position:relative;z-index:1;background:rgba(0,5,15,.88);border:1px solid rgba(0,255,150,.25);border-radius:22px;padding:26px 42px;text-align:center;animation:glow .8s ease both;box-shadow:0 0 40px rgba(0,255,150,.1),0 20px 60px rgba(0,0,0,.5)}
      .lbl{font-size:10px;letter-spacing:3px;color:rgba(0,255,150,.7);text-transform:uppercase;margin-bottom:14px}
      .donor{font-size:22px;font-weight:700;color:#d1fae5;margin-bottom:6px}
      .amount{font-size:50px;font-weight:900;background:linear-gradient(90deg,#00ff96,#00d4ff,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
      .msg{font-size:12px;color:rgba(209,250,229,.35);margin-top:12px}
      @keyframes glow{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
    
</style>
</head>
<body>
<div class="aurora"></div><div class="aurora2"></div><div data-alert class="card"><div class="lbl">🌌 Donation Alert</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, gradient = EXCLUDED.gradient, is_premium = EXCLUDED.is_premium, is_active = EXCLUDED.is_active, sort_order = EXCLUDED.sort_order, full_code = EXCLUDED.full_code;

INSERT INTO overlay_templates (id, name, description, gradient, is_premium, is_active, sort_order, full_code) VALUES
('nt-forest', 'Mystic Forest', 'Glowing green leaves falling', 'linear-gradient(to bottom, #064e3b, #022c22)', true, true, 25, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:rgba(2,44,34,.9);border-bottom:4px solid #10b981;border-radius:12px;padding:20px 30px;text-align:center;animation:fadeUp .6s both;box-shadow:0 10px 30px rgba(16,185,129,.3)}.donor{font-size:24px;color:#34d399;font-weight:700}.amount{font-size:42px;color:#a7f3d0;font-weight:900}@keyframes fadeUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">🍃 {{donor_name}}</div><div class="amount">₹{{amount}}</div><div>{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('nt-volcano', 'Volcano Eruption', 'Fiery magma burst', 'linear-gradient(to bottom, #7f1d1d, #450a0a)', true, true, 26, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:rgba(69,10,10,.9);border-top:4px solid #ef4444;border-radius:12px;padding:20px 30px;text-align:center;animation:shake .5s both;box-shadow:0 10px 30px rgba(239,68,68,.4)}.donor{font-size:24px;color:#fca5a5;font-weight:700}.amount{font-size:42px;color:#fef08a;font-weight:900;text-shadow:0 0 10px #f87171}@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">🌋 {{donor_name}}</div><div class="amount">₹{{amount}}</div><div>{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('nt-avalanche', 'Avalanche', 'Cool frozen snow drop', 'linear-gradient(to bottom, #dbeafe, #1e3a8a)', true, true, 27, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:rgba(30,58,138,.9);border-radius:24px;padding:20px 30px;text-align:center;animation:slideDown .6s both;box-shadow:0 10px 30px rgba(191,219,254,.4)}.donor{font-size:24px;color:#93c5fd;font-weight:700}.amount{font-size:42px;color:#eff6ff;font-weight:900}@keyframes slideDown{from{transform:translateY(-50px);opacity:0}to{transform:translateY(0);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">❄️ {{donor_name}}</div><div class="amount">₹{{amount}}</div><div>{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('nt-tornado', 'Tornado Spin', 'Spinning wind vortex', 'radial-gradient(circle, #64748b, #0f172a)', true, true, 28, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:rgba(15,23,42,.9);border:2px dashed #94a3b8;border-radius:50%;width:240px;height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:spinIn .8s both;box-shadow:0 0 40px rgba(148,163,184,.3)}.donor{font-size:20px;color:#cbd5e1;font-weight:700}.amount{font-size:36px;color:#f8fafc;font-weight:900}@keyframes spinIn{from{transform:rotate(-180deg) scale(.5);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">🌪️ {{donor_name}}</div><div class="amount">₹{{amount}}</div><div style="font-size:11px;opacity:0.6;margin-top:10px">{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('nt-starry', 'Starry Night', 'Twinkling stars galaxy', 'linear-gradient(to bottom, #172554, #020617)', true, true, 29, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:rgba(2,6,23,.9);border:1px solid #1e3a8a;border-radius:16px;padding:25px 35px;text-align:center;animation:fadeIn .8s both;box-shadow:0 0 50px rgba(30,58,138,.5)}.donor{font-size:22px;color:#bfdbfe;font-weight:700}.amount{font-size:44px;color:#fef08a;font-weight:900;text-shadow:0 0 15px #fef08a}@keyframes fadeIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">✨ {{donor_name}}</div><div class="amount">₹{{amount}}</div><div>{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('sf-holo', 'Holo Grid', 'Cyan holographic projection', 'repeating-linear-gradient(0deg, #083344, #083344 1px, #042f2e 1px, #042f2e 20px)', true, true, 30, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:rgba(8,51,68,.8);border:2px solid #22d3ee;border-radius:8px;padding:20px 30px;text-align:center;animation:glitch .4s steps(4) both;box-shadow:inset 0 0 20px #22d3ee, 0 0 20px #22d3ee;font-family:monospace}.donor{font-size:20px;color:#67e8f9;text-transform:uppercase}.amount{font-size:46px;color:#cffafe;font-weight:900}@keyframes glitch{0%{transform:skew(-20deg)}100%{transform:skew(0deg)}}
</style>
</head>
<body>
<div data-alert class="card"><div style="font-size:10px;color:#22d3ee;margin-bottom:10px">SYSTEM INCOMING</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div>"{{message}}"</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('sf-laser', 'Laser Scanner', 'Red scanner line tracing', 'linear-gradient(135deg, #450a0a, #000)', true, true, 31, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{position:relative;background:#000;border-left:4px solid #ef4444;padding:20px 30px;text-align:left;animation:slideRight .5s both;overflow:hidden}.card::after{content:'''';position:absolute;top:0;left:0;width:100%;height:2px;background:#ef4444;box-shadow:0 0 10px #ef4444;animation:scan 2s linear infinite}.donor{font-size:20px;color:#f87171}.amount{font-size:40px;color:#fff;font-weight:900}@keyframes slideRight{from{transform:translateX(-40px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes scan{0%{top:0}50%{top:100%}100%{top:0}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">TARGET: {{donor_name}}</div><div class="amount">₹{{amount}}</div><div style="color:rgba(255,255,255,0.5)">{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('sf-aicore', 'AI Core', 'Pulsing artificial intelligence eye', 'radial-gradient(circle, #4c1d95, #000)', true, true, 32, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:rgba(0,0,0,.8);border-radius:100px;padding:20px 50px;text-align:center;animation:pulse .8s infinite alternate;box-shadow:0 0 30px #8b5cf6}.donor{font-size:20px;color:#c4b5fd}.amount{font-size:48px;color:#f3e8ff;font-weight:900}@keyframes pulse{from{box-shadow:0 0 10px #8b5cf6;transform:scale(0.98)}to{box-shadow:0 0 40px #a78bfa;transform:scale(1.02)}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">🧿 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('sf-ribbon', 'Quantum Ribbon', 'Neon abstract ribbon flow', 'linear-gradient(45deg, #1e1b4b, #312e81)', true, true, 33, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:linear-gradient(45deg,#4f46e5,#ec4899);padding:3px;border-radius:16px;animation:fade .6s both}.inner{background:#000;border-radius:13px;padding:25px 40px;text-align:center}.donor{font-size:22px;color:#e0e7ff;font-weight:700}.amount{font-size:46px;background:-webkit-linear-gradient(45deg,#818cf8,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900}@keyframes fade{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
</style>
</head>
<body>
<div data-alert class="card"><div class="inner"><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div style="color:#aaa;margin-top:10px">{{message}}</div></div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('sf-space', 'Spaceship Window', 'View into the cosmos', 'linear-gradient(135deg, #0f172a, #000)', true, true, 34, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#000;border:8px solid #334155;border-radius:40px;padding:30px 50px;text-align:center;animation:popIn .6s both;box-shadow:inset 0 0 20px rgba(255,255,255,.1)}.donor{font-size:20px;color:#cbd5e1}.amount{font-size:44px;color:#fff;font-weight:900}@keyframes popIn{from{transform:perspective(500px) translateZ(-100px);opacity:0}to{transform:perspective(500px) translateZ(0);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">🛰️ {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('gm-rpg', 'RPG Quest', 'Fantasy RPG quest complete UI', 'url(https://www.transparenttextures.com/patterns/aged-paper.png)', true, true, 35, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#d4b382;border:3px solid #78350f;padding:20px 40px;text-align:center;font-family:serif;animation:slideUp .5s both;box-shadow:4px 4px 0 #78350f}.donor{font-size:22px;color:#451a03;font-weight:700}.amount{font-size:36px;color:#78350f;font-weight:900}@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div style="font-size:12px;color:#92400e;letter-spacing:2px;margin-bottom:8px">QUEST COMPLETE</div><div class="donor">{{donor_name}}</div><div class="amount">+₹{{amount}}</div><div>{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('gm-arcade', 'Arcade High Score', 'Retro 8-bit arcade cabinet screen', 'linear-gradient(135deg, #000, #111)', true, true, 36, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#000;border:4px solid #fde047;padding:25px 35px;text-align:center;font-family:monospace;animation:blink .5s both;color:#fde047}.donor{font-size:24px}.amount{font-size:50px;font-weight:900;text-shadow:4px 4px #b45309}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
</style>
</head>
<body>
<div data-alert class="card"><div style="font-size:14px;margin-bottom:10px">NEW HIGH SCORE!</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('gm-lootbox', 'Loot Box', 'Glowing legendary item drop', 'radial-gradient(circle, #f59e0b, #78350f)', true, true, 37, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:linear-gradient(to bottom, #f59e0b, #d97706);border:2px solid #fff;border-radius:12px;padding:20px 40px;text-align:center;animation:pop .6s both;box-shadow:0 0 50px #f59e0b}.donor{font-size:20px;color:#fff;font-weight:700}.amount{font-size:46px;color:#fff;font-weight:900;text-shadow:0 2px 4px rgba(0,0,0,.3)}@keyframes pop{0%{transform:scale(0)}80%{transform:scale(1.1)}100%{transform:scale(1)}}
</style>
</head>
<body>
<div data-alert class="card"><div style="font-size:12px;color:#fee11;text-transform:uppercase;font-weight:800;letter-spacing:2px">Legendary Drop!</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('gm-fighting', 'Fighting Game KO', 'Aggressive comic/fighter style impact', 'linear-gradient(135deg, #991b1b, #000)', true, true, 38, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#dc2626;transform:skew(-10deg);padding:20px 40px;text-align:center;animation:zoomIn .3s both;box-shadow:-10px 10px 0 #000;border:4px solid #fff}.inner{transform:skew(10deg)}.donor{font-size:24px;color:#fff;font-weight:900;text-transform:uppercase}.amount{font-size:55px;color:#fde047;font-weight:900;text-shadow:0 4px 0 #000}@keyframes zoomIn{from{transform:perspective(400px) translateZ(200px) skew(-10deg);opacity:0}to{transform:perspective(400px) translateZ(0) skew(-10deg);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="inner"><div style="font-size:28px;color:#fff;font-weight:900;font-style:italic">K.O.!</div><div class="donor">{{donor_name}} WINS</div><div class="amount">₹{{amount}}</div></div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('gm-potion', 'Health Potion', 'Bubbling red liquid shape', 'linear-gradient(to bottom, #7f1d1d, #ef4444)', true, true, 39, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:rgba(239,68,68,.9);border-bottom-left-radius:50%;border-bottom-right-radius:50%;width:200px;height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:bubble .8s both alternate;border:4px solid #fca5a5}.donor{font-size:22px;color:#fff;font-weight:700}.amount{font-size:40px;color:#fff;font-weight:900}@keyframes bubble{from{transform:translateY(10px)}to{transform:translateY(0)}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">❤️ {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('kw-slime', 'Bouncing Slime', 'Jiggly cute aesthetic', 'linear-gradient(to bottom, #a7f3d0, #34d399)', true, true, 40, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#6ee7b7;border-radius:40px 40px 10px 10px;padding:30px;text-align:center;animation:jiggle .6s both;box-shadow:0 10px 20px rgba(16,185,129,.3)}.donor{font-size:22px;color:#064e3b;font-weight:700}.amount{font-size:44px;color:#022c22;font-weight:900}@keyframes jiggle{0%,100%{transform:scale(1)}50%{transform:scaleX(1.1) scaleY(0.9)}}
</style>
</head>
<body>
<div data-alert class="card"><div style="font-size:24px;margin-bottom:10px">>w<</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('kw-candy', 'Bubblegum Sparkle', 'Pink and cute girly alert', 'linear-gradient(135deg, #fbcfe8, #f472b6)', true, true, 41, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#fdf2f8;border:4px solid #f472b6;border-radius:30px;padding:20px 40px;text-align:center;animation:pop .4s both;box-shadow:0 10px 30px rgba(244,114,182,.4)}.donor{font-size:22px;color:#be185d;font-weight:700}.amount{font-size:46px;color:#db2777;font-weight:900}@keyframes pop{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">🎀 {{donor_name}}</div><div class="amount">₹{{amount}}</div><div style="color:#f472b6">{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('kw-cloud', 'Cloud Floats', 'Fluffy white cloud shape', 'linear-gradient(to bottom, #bae6fd, #e0f2fe)', true, true, 42, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#fff;border-radius:100px;padding:30px 60px;text-align:center;animation:float 3s ease-in-out infinite;box-shadow:0 20px 40px rgba(186,230,253,.5)}.donor{font-size:20px;color:#0284c7;font-weight:700}.amount{font-size:40px;color:#0369a1;font-weight:900}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">☁️ {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('kw-paws', 'Puppy Paws', 'Cute pet paws theme', 'linear-gradient(135deg, #fef3c7, #fde68a)', true, true, 43, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#fffbeb;border:3px dashed #d97706;border-radius:20px;padding:20px 40px;text-align:center;animation:wiggle .5s both;color:#d97706}.donor{font-size:22px;font-weight:700}.amount{font-size:44px;font-weight:900}@keyframes wiggle{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">🐾 {{donor_name}}</div><div class="amount">₹{{amount}}</div><div>{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('kw-rainbow', 'Rainbow Arch', 'Full spectrum rainbow gradient', 'linear-gradient(to right, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7)', true, true, 44, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#fff;border-top-left-radius:100px;border-top-right-radius:100px;border-bottom:8px solid #3b82f6;padding:40px 60px 20px 60px;text-align:center;animation:fadeUp .6s both;box-shadow:0 10px 30px rgba(0,0,0,.1)}.donor{font-size:22px;color:#eab308;font-weight:700}.amount{font-size:46px;background:linear-gradient(to right, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900}@keyframes fadeUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">🌈 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('sp-blood', 'Blood Drip', 'Red dripping aesthetics', 'linear-gradient(to bottom, #7f1d1d, #000)', true, true, 45, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#450a0a;border-top:5px solid #b91c1c;padding:25px 40px;text-align:center;animation:drip 1s both;box-shadow:0 10px 20px rgba(185,28,28,.4)}.donor{font-size:20px;color:#fecaca;font-weight:700}.amount{font-size:48px;color:#ef4444;font-weight:900}@keyframes drip{0%{transform:scaleY(0.5);opacity:0}100%{transform:scaleY(1);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">🩸 {{donor_name}}</div><div class="amount">₹{{amount}}</div><div style="color:rgba(255,255,255,0.4)">{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('sp-fog', 'Haunted Fog', 'Smokey, blurred dark alert', 'linear-gradient(135deg, #1f2937, #030712)', true, true, 46, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:rgba(17,24,39,.7);backdrop-filter:blur(8px);border:1px solid #4b5563;border-radius:16px;padding:25px 40px;text-align:center;animation:fade .8s both;box-shadow:0 0 40px rgba(0,0,0,.8)}.donor{font-size:22px;color:#d1d5db;font-weight:700}.amount{font-size:44px;color:#f3f4f6;font-weight:900;text-shadow:0 0 20px #9ca3af}@keyframes fade{from{opacity:0;-webkit-filter:blur(10px)}to{opacity:1;-webkit-filter:blur(0)}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">👻 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('sp-flicker', 'Flickering Bulb', 'Broken horror light effect', 'linear-gradient(135deg, #27272a, #09090b)', true, true, 47, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#18181b;border:1px solid #3f3f46;padding:20px 40px;text-align:center;animation:flicker 3s infinite;color:#f4f4f5}.donor{font-size:20px;color:#a1a1aa}.amount{font-size:50px;font-weight:900;text-shadow:0 0 10px #f4f4f5}@keyframes flicker{0%,90%,100%{opacity:1}95%{opacity:0.3}98%{opacity:0.8}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">💡 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('sp-zombie', 'Zombie Hand', 'Grungy decayed green look', 'linear-gradient(135deg, #14532d, #022c22)', true, true, 48, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#064e3b;border:3px dashed #166534;border-radius:10px;padding:20px 40px;text-align:center;animation:rise .6s both;transform:rotate(-3deg);color:#a7f3d0}.donor{font-size:22px;font-weight:700}.amount{font-size:46px;font-weight:900}@keyframes rise{from{transform:translateY(40px) rotate(-10deg);opacity:0}to{transform:translateY(0) rotate(-3deg);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">🧟 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('sp-web', 'Spider Web', 'Intricate thin white lines', 'linear-gradient(135deg, #171717, #0a0a0a)', true, true, 49, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:transparent;border:1px solid #525252;border-radius:50%;width:220px;height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:spinScale .8s both;position:relative}.card::before{content:'''';position:absolute;inset:5px;border:1px solid #404040;border-radius:50%}.card::after{content:'''';position:absolute;inset:15px;border:1px solid #262626;border-radius:50%}.donor{font-size:18px;color:#a3a3a3}.amount{font-size:40px;color:#fafafa;font-weight:900}@keyframes spinScale{from{transform:scale(0) rotate(90deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">🕸️ {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('ab-liquid', 'Liquid Gradient', 'Melting multi-color gradient', 'linear-gradient(135deg, #fb923c, #ec4899, #8b5cf6)', true, true, 50, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:linear-gradient(135deg,#fb923c,#ec4899,#8b5cf6);background-size:200% 200%;border-radius:24px;padding:25px 45px;text-align:center;animation:flow 3s ease infinite, popIn .5s both;box-shadow:0 10px 40px rgba(236,72,153,.5);color:#fff}.donor{font-size:20px;font-weight:700;opacity:0.9}.amount{font-size:50px;font-weight:900}@keyframes flow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}@keyframes popIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div style="font-size:12px;opacity:0.8;margin-top:10px">{{message}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('ab-rings', 'Glass Rings', 'Concentric semi-transparent rings', 'radial-gradient(circle, #e2e8f0, #94a3b8)', true, true, 51, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:rgba(255,255,255,.2);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.5);border-radius:100px;padding:30px 60px;text-align:center;animation:fade .6s both;box-shadow:0 10px 30px rgba(0,0,0,.1)}.donor{font-size:20px;color:#334155;font-weight:700}.amount{font-size:48px;color:#0f172a;font-weight:900}@keyframes fade{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('ab-kinetic', 'Kinetic Typography', 'Huge bold text focus', 'linear-gradient(to right, #000, #333)', true, true, 52, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#000;color:#fff;padding:20px 40px;text-align:center;animation:slideLeft .4s both}.donor{font-size:14px;letter-spacing:10px;text-transform:uppercase;color:#a3a3a3}.amount{font-size:70px;line-height:1;font-weight:900;letter-spacing:-4px}@keyframes slideLeft{from{transform:translateX(50px);opacity:0}to{transform:translateX(0);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('ab-blob', 'Morphing Blob', 'Organic weird moving shape', 'linear-gradient(135deg, #fce7f3, #fbcfe8)', true, true, 53, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#f472b6;color:#fff;padding:40px 50px;text-align:center;animation:morph 4s ease-in-out infinite, fadeUp .6s both;box-shadow:0 10px 30px rgba(244,114,182,.4)}.donor{font-size:22px;font-weight:700;opacity:0.9}.amount{font-size:48px;font-weight:900}@keyframes morph{0%,100%{border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%}50%{border-radius: 30% 70% 70% 30% / 30% 60% 40% 70%}}@keyframes fadeUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('ab-iso', 'Isometric Cubes', '3D geometric feel', 'linear-gradient(to bottom, #f1f5f9, #cbd5e1)', true, true, 54, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#e2e8f0;border-left:10px solid #94a3b8;border-bottom:10px solid #64748b;padding:20px 40px;text-align:center;transform:rotateX(20deg) rotateZ(-20deg);animation:drop .4s both;box-shadow:20px 20px 0 rgba(0,0,0,.1)}.donor{font-size:20px;color:#334155;font-weight:700}.amount{font-size:46px;color:#0f172a;font-weight:900}@keyframes drop{from{transform:translateY(-50px) rotateX(20deg) rotateZ(-20deg);opacity:0}to{transform:translateY(0) rotateX(20deg) rotateZ(-20deg);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">🧊 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('rt-vhs', 'VHS Tracking', 'Static distorted VCR text', 'linear-gradient(135deg, #111, #000)', true, true, 55, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#000;border-left:8px solid #3b82f6;border-right:8px solid #ef4444;padding:20px 40px;text-align:center;font-family:sans-serif;animation:vhs .2s infinite;color:#fff}.donor{font-size:20px;letter-spacing:4px;color:#9ca3af}.amount{font-size:48px;font-weight:900;text-shadow:2px 0 0 #ef4444, -2px 0 0 #3b82f6}@keyframes vhs{50%{transform:translate(1px, 1px)}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">PLAY ► {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('rt-8bit', '8-Bit Hearts', 'Pixel hearts style', 'linear-gradient(to right, #fdf4ff, #fae8ff)', true, true, 56, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#fdf4ff;border:4px solid #d946ef;padding:20px 40px;text-align:center;font-family:monospace;animation:pixelPop .4s steps(5) both}.donor{font-size:18px;color:#a21caf}.amount{font-size:44px;color:#86198f;font-weight:900}@keyframes pixelPop{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">♥♥♥ {{donor_name}} ♥♥♥</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('rt-tape', 'Cassette Tape', 'Old-school mixtape design', 'linear-gradient(to bottom, #ffed4a, #f59e0b)', true, true, 57, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#fef3c7;border:2px solid #b45309;border-radius:12px;padding:20px 40px;text-align:center;animation:slideUp .5s both;box-shadow:0 10px 20px rgba(180,83,9,.2)}.donor{font-size:18px;font-family:cursive;color:#78350f}.amount{font-size:46px;font-family:Impact, sans-serif;color:#92400e;letter-spacing:2px}@keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div style="font-size:12px;border-bottom:1px solid #d97706;padding-bottom:5px;margin-bottom:10px;text-transform:uppercase">A-SIDE</div><div class="donor">Mix by {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('rt-crt', 'CRT Monitor', 'Green phosphor terminal', 'linear-gradient(135deg, #052e16, #022c22)', true, true, 58, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#000;border:20px solid #1a1a1a;border-radius:20px;padding:20px 30px;text-align:left;font-family:monospace;color:#22c55e;animation:turnOn .4s both;text-shadow:0 0 5px #22c55e}.donor{font-size:16px}.amount{font-size:36px;font-weight:700}@keyframes turnOn{0%{transform:scaleY(0.01);opacity:0}100%{transform:scaleY(1);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">C:\> root access granted to {{donor_name}}</div><div class="amount">FUNDS: ₹{{amount}}</div><div>_</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('rt-disco', 'Disco Floor', 'Flashing colorful tiles', 'repeating-linear-gradient(45deg, #000, #000 20px, #111 20px, #111 40px)', true, true, 59, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:linear-gradient(45deg, #ef4444, #3b82f6, #eab308, #a855f7);background-size:400% 400%;border:4px solid #fff;border-radius:16px;padding:25px 45px;text-align:center;animation:disco 2s linear infinite, fade .5s both;box-shadow:0 0 40px rgba(255,255,255,.5)}.donor{font-size:24px;color:#fff;font-weight:900;text-shadow:0 2px 4px #000}.amount{font-size:50px;color:#fff;font-weight:900;text-shadow:0 4px 8px #000}@keyframes disco{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}@keyframes fade{from{opacity:0}to{opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">🕺 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('ci-ratio', 'Golden Ratio', 'Perfectly balanced geometry', 'linear-gradient(135deg, #f8fafc, #e2e8f0)', true, true, 60, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#fff;border:1px solid #cbd5e1;padding:30px 48px;text-align:center;animation:expand .6s both;box-shadow:0 20px 40px rgba(0,0,0,.05)}.donor{font-size:16px;color:#64748b;letter-spacing:2px;text-transform:uppercase}.amount{font-size:55px;color:#0f172a;font-weight:300;font-family:serif}@keyframes expand{from{width:0;opacity:0}to{width:300px;opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">{{donor_name}}</div><div style="width:50px;height:1px;background:#cbd5e1;margin:15px auto"></div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('ci-bars', 'Cinematic Bars', 'Letterbox movie style', 'linear-gradient(to bottom, #000 20%, #1e293b 20%, #1e293b 80%, #000 80%)', true, true, 61, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:transparent;width:100%;text-align:center;animation:slideDown .5s both}.donor{font-size:24px;color:#f8fafc;font-weight:700}.amount{font-size:60px;color:#fbbf24;font-weight:900;text-shadow:0 4px 10px rgba(0,0,0,.5)}@keyframes slideDown{from{transform:translateY(-100px);opacity:0}to{transform:translateY(0);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">DIRECTED BY {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('ci-film', 'Film Reel', 'Countdown reel aesthetic', 'linear-gradient(135deg, #262626, #171717)', true, true, 62, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#000;border:4px dashed #fff;border-radius:50%;width:240px;height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:spinStop 1s cubic-bezier(0.2, 0.8, 0.2, 1) both;color:#fff}.donor{font-size:20px;font-weight:700;margin-bottom:10px}.amount{font-size:50px;font-weight:900}@keyframes spinStop{from{transform:rotate(720deg) scale(0);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('ci-flash', 'Camera Flash', 'Paparazzi bright flash', 'linear-gradient(135deg, #1f2937, #111827)', true, true, 63, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:#fff;color:#000;padding:20px 40px;text-align:center;animation:flashBg .6s both;border-radius:8px}.donor{font-size:24px;font-weight:900;text-transform:uppercase}.amount{font-size:46px;font-weight:900}@keyframes flashBg{0%{background:#fff;transform:scale(1.2);box-shadow:0 0 100px #fff;opacity:0}20%{background:#fff;box-shadow:0 0 100px #fff;opacity:1}100%{background:#f8fafc;transform:scale(1);opacity:1}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">📸 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>'),
('ci-spotlight', 'Spotlight Focus', 'Intense center light', 'radial-gradient(circle at center, #334155, #020617)', true, true, 64, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
.card{background:transparent;text-align:center;animation:spot .8s both;color:#fff}.donor{font-size:22px;color:#94a3b8;font-weight:700}.amount{font-size:55px;color:#fff;font-weight:900;text-shadow:0 0 30px #fff}@keyframes spot{from{filter:brightness(0);transform:scale(0.9)}to{filter:brightness(1);transform:scale(1)}}
</style>
</head>
<body>
<div data-alert class="card"><div class="donor">STAGE LEFT: {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>
<script>
try{

setTimeout(()=>{
  const el=document.querySelector(''[data-alert]'');
  if(el){el.style.transition=''opacity .6s ease'';el.style.opacity=''0'';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, gradient = EXCLUDED.gradient, is_premium = EXCLUDED.is_premium, is_active = EXCLUDED.is_active, sort_order = EXCLUDED.sort_order, full_code = EXCLUDED.full_code;