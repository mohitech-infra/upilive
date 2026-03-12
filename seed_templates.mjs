/**
 * Seed script: inserts 5 free + 15 premium overlay templates into Supabase.
 * Run: node seed_templates.mjs
 */

const SUPABASE_URL = 'https://gryucxlpgebaeqxagyoa.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyeXVjeGxwZ2ViYWVxeGFneW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTE0MTUsImV4cCI6MjA4ODE4NzQxNX0.ZN2HglJeF41WQYntCr7ZR0dT97GH9MNR0Uqd1P1g8aw'

// ─── Helper to build a full HTML overlay ─────────────────────────────────────
function buildFull({ fonts = 'Inter', extraHead = '', css, html, js }) {
    const fontLink = `<link href="https://fonts.googleapis.com/css2?family=${fonts.replace(/ /g, '+').replace(/,/g, '&family=')}&display=swap" rel="stylesheet">`
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
${fontLink}
${extraHead}
<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}
${css}
</style>
</head>
<body>
${html}
<script>
try{
${js}
setTimeout(()=>{
  const el=document.querySelector('[data-alert]');
  if(el){el.style.transition='opacity .6s ease';el.style.opacity='0';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>`
}

// ─── Template definitions ─────────────────────────────────────────────────────
const templates = [

    // ═══════════════════════════════════════════
    //  FREE TEMPLATES (5)
    // ═══════════════════════════════════════════

    {
        id: 'classic-green',
        name: 'Classic Green',
        description: 'Clean minimal alert with green accent glow',
        gradient: 'linear-gradient(135deg,#0d1f0e,#1a3a1c)',
        is_premium: false,
        sort_order: 1,
        full_code: buildFull({
            fonts: 'Inter:wght@400;700;900',
            css: `
      body{font-family:'Inter',sans-serif}
      .card{background:rgba(0,0,0,.88);border:2px solid #22c55e;border-radius:18px;padding:22px 36px;text-align:center;animation:slideDown .5s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 0 40px rgba(34,197,94,.25),0 8px 32px rgba(0,0,0,.5)}
      .lbl{font-size:10px;letter-spacing:3px;color:#22c55e;opacity:.8;text-transform:uppercase;margin-bottom:8px}
      .donor{font-size:22px;font-weight:900;color:#fff;margin-bottom:4px}
      .amount{font-size:48px;font-weight:900;color:#22c55e;line-height:1;margin:6px 0;text-shadow:0 0 20px rgba(34,197,94,.5)}
      .msg{font-size:13px;color:rgba(255,255,255,.55);margin-top:8px}
      @keyframes slideDown{from{transform:translateY(-60px);opacity:0}to{transform:translateY(0);opacity:1}}
      @keyframes slideUp{to{transform:translateY(-60px);opacity:0}}
    `,
            html: `<div data-alert class="card"><div class="lbl">Donation Alert</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>`,
            js: ``
        })
    },

    {
        id: 'purple-wave',
        name: 'Purple Wave',
        description: 'Elegant purple gradient with animated wave border',
        gradient: 'linear-gradient(135deg,#1a0533,#3b0764)',
        is_premium: false,
        sort_order: 2,
        full_code: buildFull({
            fonts: 'Poppins:wght@400;700;900',
            css: `
      body{font-family:'Poppins',sans-serif}
      .wrap{position:relative;padding:3px;border-radius:20px;background:linear-gradient(135deg,#a855f7,#7c3aed,#a855f7);animation:fadeIn .6s both}
      .card{background:linear-gradient(135deg,#130024,#1e0040);border-radius:18px;padding:24px 40px;text-align:center}
      .wave{position:absolute;bottom:0;left:0;right:0;height:4px;border-radius:0 0 18px 18px;background:linear-gradient(90deg,#a855f7,#ec4899,#a855f7);background-size:200%;animation:wave 2s linear infinite}
      .lbl{font-size:9px;letter-spacing:4px;color:#a855f7;text-transform:uppercase;opacity:.8;margin-bottom:10px}
      .donor{font-size:20px;font-weight:700;color:#e9d5ff;margin-bottom:6px}
      .amount{font-size:44px;font-weight:900;color:#a855f7;text-shadow:0 0 30px rgba(168,85,247,.6)}
      .msg{font-size:12px;color:rgba(255,255,255,.45);margin-top:8px}
      @keyframes wave{from{background-position:0 0}to{background-position:200% 0}}
      @keyframes fadeIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
    `,
            html: `<div data-alert class="wrap"><div class="card"><div class="lbl">💜 Super Donation</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div><div class="wave"></div></div>`,
            js: ``
        })
    },

    {
        id: 'dark-minimal',
        name: 'Dark Minimal',
        description: 'Ultra-clean dark style with gradient separator',
        gradient: 'linear-gradient(135deg,#0a0a0f,#111118)',
        is_premium: false,
        sort_order: 3,
        full_code: buildFull({
            fonts: 'Inter:wght@400;600;900',
            css: `
      body{font-family:'Inter',sans-serif}
      .card{background:rgba(15,15,20,.95);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:20px 32px;text-align:center;animation:appear .4s ease both;box-shadow:0 20px 60px rgba(0,0,0,.6)}
      .top{font-size:10px;letter-spacing:2px;color:rgba(255,255,255,.35);margin-bottom:12px;text-transform:uppercase}
      .donor{font-size:18px;font-weight:600;color:#fff;margin-bottom:4px}
      .sep{width:40px;height:2px;background:linear-gradient(90deg,#22c55e,#a855f7);margin:10px auto}
      .amount{font-size:42px;font-weight:900;color:#fff;letter-spacing:-2px}
      .msg{font-size:12px;color:rgba(255,255,255,.35);margin-top:12px;font-style:italic}
      @keyframes appear{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    `,
            html: `<div data-alert class="card"><div class="top">Donation Alert · {{source}}</div><div class="donor">{{donor_name}}</div><div class="sep"></div><div class="amount">₹{{amount}}</div><div class="msg">"{{message}}"</div></div>`,
            js: ``
        })
    },

    {
        id: 'fire-orange',
        name: 'Fire Orange',
        description: 'Hot fire-themed alert with warm glow and countdown bar',
        gradient: 'linear-gradient(135deg,#1f0a00,#3d1500)',
        is_premium: false,
        sort_order: 4,
        full_code: buildFull({
            fonts: 'Oswald:wght@400;700',
            css: `
      body{font-family:'Oswald',sans-serif}
      .card{background:rgba(0,0,0,.9);border:2px solid #f97316;border-radius:16px;padding:20px 36px;text-align:center;animation:fireIn .5s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 0 50px rgba(249,115,22,.3),0 8px 32px rgba(0,0,0,.5)}
      .emoji{font-size:28px;margin-bottom:4px}
      .donor{font-size:20px;font-weight:400;color:#fed7aa;letter-spacing:1px;margin-bottom:4px}
      .amount{font-size:52px;font-weight:700;color:#f97316;text-shadow:0 0 30px rgba(249,115,22,.7);line-height:1}
      .msg{font-size:13px;color:rgba(255,255,255,.5);margin-top:10px}
      .bar-wrap{height:4px;background:rgba(255,255,255,.1);border-radius:2px;margin-top:14px;overflow:hidden}
      .bar{height:100%;background:linear-gradient(90deg,#ea580c,#f97316,#fbbf24);animation:drain 5.5s linear forwards}
      @keyframes fireIn{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:1}}
      @keyframes drain{from{width:100%}to{width:0}}
    `,
            html: `<div data-alert class="card"><div class="emoji">🔥</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div><div class="bar-wrap"><div class="bar"></div></div></div>`,
            js: ``
        })
    },

    {
        id: 'blue-pop',
        name: 'Blue Pop',
        description: 'Bright blue pop-in with satisfying bounce effect',
        gradient: 'linear-gradient(135deg,#001233,#002366)',
        is_premium: false,
        sort_order: 5,
        full_code: buildFull({
            fonts: 'Montserrat:wght@400;700;900',
            css: `
      body{font-family:'Montserrat',sans-serif}
      .card{background:rgba(0,10,40,.94);border:2px solid #3b82f6;border-radius:20px;padding:22px 40px;text-align:center;animation:pop .5s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 0 40px rgba(59,130,246,.35),inset 0 1px 0 rgba(255,255,255,.06)}
      .badge{display:inline-block;background:rgba(59,130,246,.2);border:1px solid rgba(59,130,246,.4);border-radius:20px;padding:3px 12px;font-size:10px;color:#93c5fd;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px}
      .donor{font-size:22px;font-weight:700;color:#fff;margin-bottom:6px}
      .amount{font-size:50px;font-weight:900;color:#3b82f6;text-shadow:0 0 25px rgba(59,130,246,.6);line-height:1}
      .msg{font-size:12px;color:rgba(255,255,255,.4);margin-top:10px}
      @keyframes pop{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}
    `,
            html: `<div data-alert class="card"><div class="badge">⚡ Donation</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>`,
            js: ``
        })
    },

    // ═══════════════════════════════════════════
    //  PREMIUM TEMPLATES (15)
    // ═══════════════════════════════════════════

    {
        id: 'neon-cyber',
        name: 'Neon Cyber',
        description: 'Cyberpunk neon border with rotating gradient hue',
        gradient: 'linear-gradient(135deg,#0a0a1a,#001a2e)',
        is_premium: true,
        sort_order: 10,
        full_code: buildFull({
            fonts: 'Orbitron:wght@400;700;900',
            css: `
      body{font-family:'Orbitron',sans-serif}
      @property --hue{syntax:'<angle>';initial-value:0deg;inherits:false}
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
    `,
            html: `<div data-alert class="outer"><div class="card"><div class="scan"></div><div class="lbl">System Alert</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="src">via {{source}}</div><div class="msg">{{message}}</div></div></div>`,
            js: ``
        })
    },

    {
        id: 'retro-pixel',
        name: 'Retro Pixel',
        description: 'Old-school pixel gaming aesthetic with scanlines',
        gradient: 'linear-gradient(135deg,#1a0033,#000d1a)',
        is_premium: true,
        sort_order: 11,
        full_code: buildFull({
            fonts: 'Press+Start+2P',
            css: `
      body{font-family:'Press Start 2P',monospace}
      .card{background:#0d001a;border:4px solid #ff00ff;padding:24px 28px;position:relative;overflow:hidden;animation:pixelIn .3s steps(8) both;image-rendering:pixelated}
      .scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.35) 2px,rgba(0,0,0,.35) 4px);pointer-events:none}
      .hdr{color:#ff00ff;font-size:9px;text-align:center;margin-bottom:16px;animation:blink 1s step-end infinite}
      .donor{color:#00ffff;font-size:11px;margin-bottom:8px}
      .amount{color:#ffff00;font-size:22px;margin-bottom:8px;text-shadow:2px 2px #ff8800}
      .msg{color:#fff;font-size:8px;opacity:.7;line-height:1.8}
      .src{font-size:7px;color:#ff00ff;opacity:.5;margin-top:10px}
      @keyframes pixelIn{from{clip-path:polygon(0 50%,100% 50%,100% 50%,0 50%)}to{clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}}
      @keyframes blink{50%{opacity:0}}
    `,
            html: `<div data-alert class="card"><div class="scan"></div><div class="hdr">⚡ SUPERCHAT ⚡</div><div class="donor">{{donor_name}}</div><div class="amount">₹ {{amount}}</div><div class="msg">{{message}}</div><div class="src">{{source}}</div></div>`,
            js: ``
        })
    },

    {
        id: 'gold-prestige',
        name: 'Gold Prestige',
        description: 'Luxurious gold and black premium award-style alert',
        gradient: 'linear-gradient(135deg,#1a1200,#2d1f00)',
        is_premium: true,
        sort_order: 12,
        full_code: buildFull({
            fonts: 'Playfair+Display:wght@700;900',
            css: `
      body{font-family:'Playfair Display',serif}
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
    `,
            html: `<div data-alert class="outer"><div class="card"><div class="crown">👑</div><div class="lbl">Elite Donation</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="divider"></div><div class="msg">{{message}}</div></div></div>`,
            js: ``
        })
    },

    {
        id: 'holographic',
        name: 'Holographic',
        description: 'Stunning holographic rainbow shimmer effect',
        gradient: 'linear-gradient(135deg,#0f0f1a,#1a0f1a)',
        is_premium: true,
        sort_order: 13,
        full_code: buildFull({
            fonts: 'Exo+2:wght@400;700;900',
            css: `
      body{font-family:'Exo 2',sans-serif}
      @keyframes holo{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @keyframes pop{from{opacity:0;transform:scale(.8) rotateX(20deg)}to{opacity:1;transform:scale(1) rotateX(0deg)}}
      .card{border-radius:20px;padding:3px;background:linear-gradient(135deg,#ff0080,#ff8c00,#40e0d0,#a855f7,#ff0080);background-size:400% 400%;animation:holo 3s linear infinite,pop .7s cubic-bezier(.34,1.56,.64,1) both}
      .inner{background:rgba(5,5,15,.92);border-radius:18px;padding:24px 40px;text-align:center;backdrop-filter:blur(10px)}
      .lbl{font-size:9px;letter-spacing:4px;text-transform:uppercase;background:linear-gradient(90deg,#ff0080,#40e0d0,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px}
      .donor{font-size:22px;font-weight:700;color:#fff;margin-bottom:6px}
      .amount{font-size:46px;font-weight:900;background:linear-gradient(90deg,#ff0080,#ff8c00,#40e0d0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
      .msg{font-size:12px;color:rgba(255,255,255,.4);margin-top:10px}
    `,
            html: `<div data-alert class="card"><div class="inner"><div class="lbl">✨ Holographic Alert</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div></div>`,
            js: ``
        })
    },

    {
        id: 'matrix-rain',
        name: 'Matrix Rain',
        description: 'Digital matrix green rain with glitch text effect',
        gradient: 'linear-gradient(135deg,#000f00,#001a00)',
        is_premium: true,
        sort_order: 14,
        full_code: buildFull({
            fonts: 'Share+Tech+Mono',
            css: `
      body{font-family:'Share Tech Mono',monospace}
      canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;opacity:.35}
      .card{position:relative;z-index:1;background:rgba(0,10,0,.9);border:1px solid #00ff41;border-radius:8px;padding:22px 36px;text-align:center;animation:glitchIn .4s steps(5) both;box-shadow:0 0 30px rgba(0,255,65,.2),inset 0 0 30px rgba(0,255,65,.05)}
      .lbl{font-size:10px;letter-spacing:3px;color:#00ff41;opacity:.7;margin-bottom:10px}
      .donor{font-size:20px;color:#00ff41;margin-bottom:6px;animation:glitch 4s infinite}
      .amount{font-size:44px;font-weight:700;color:#00ff41;text-shadow:0 0 15px #00ff41;line-height:1}
      .msg{font-size:11px;color:rgba(0,255,65,.5);margin-top:10px}
      @keyframes glitchIn{0%{clip-path:inset(0 100% 0 0)}100%{clip-path:inset(0 0 0 0)}}
      @keyframes glitch{0%,94%,100%{transform:none}96%{transform:skewX(-5deg) translateX(3px);color:#0ff}98%{transform:skewX(3deg) translateX(-2px);color:#f0f}}
    `,
            html: `<canvas id="c"></canvas><div data-alert class="card"><div class="lbl">[SYSTEM] DONATION DETECTED</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>`,
            js: `
      const c=document.getElementById('c'),ctx=c.getContext('2d');
      c.width=window.innerWidth;c.height=window.innerHeight;
      const cols=Math.floor(c.width/16);const drops=Array(cols).fill(1);
      const chars='アイウエオカキクケコ0123456789ABCDEF';
      function draw(){ctx.fillStyle='rgba(0,0,0,.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#00ff41';ctx.font='14px monospace';drops.forEach((y,i)=>{const t=chars[Math.floor(Math.random()*chars.length)];ctx.fillText(t,i*16,y*16);if(y*16>c.height&&Math.random()>.975)drops[i]=0;drops[i]++;});}
      setInterval(draw,50);
    `
        })
    },

    {
        id: 'confetti-party',
        name: 'Confetti Party',
        description: 'Colorful confetti explosion for big celebration donations',
        gradient: 'linear-gradient(135deg,#1a0a2e,#0d0d1a)',
        is_premium: true,
        sort_order: 15,
        full_code: buildFull({
            fonts: 'Poppins:wght@700;900',
            extraHead: `<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>`,
            css: `
      body{font-family:'Poppins',sans-serif}
      .card{background:rgba(10,10,20,.92);border:2px solid rgba(255,255,255,.15);border-radius:22px;padding:24px 40px;text-align:center;animation:popIn .6s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 20px 60px rgba(0,0,0,.5)}
      .emoji{font-size:36px;animation:spin .5s ease both .5s}
      .donor{font-size:22px;font-weight:700;color:#fff;margin:8px 0 4px}
      .amount{font-size:48px;font-weight:900;background:linear-gradient(135deg,#f59e0b,#ec4899,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
      .msg{font-size:13px;color:rgba(255,255,255,.5);margin-top:10px}
      @keyframes popIn{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}
      @keyframes spin{from{transform:rotate(-20deg) scale(.5)}to{transform:rotate(0) scale(1)}}
    `,
            html: `<div data-alert class="card"><div class="emoji">🎉</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>`,
            js: `
      if(typeof confetti!=='undefined'){
        const end=Date.now()+2000;
        (function frame(){confetti({particleCount:3,angle:60,spread:55,origin:{x:0},colors:['#f59e0b','#ec4899','#a855f7','#22c55e']});confetti({particleCount:3,angle:120,spread:55,origin:{x:1},colors:['#3b82f6','#f97316','#0ff']});if(Date.now()<end)requestAnimationFrame(frame);}());
      }
    `
        })
    },

    {
        id: 'glass-morphism',
        name: 'Glassmorphism',
        description: 'Premium frosted glass with aurora gradient background',
        gradient: 'linear-gradient(135deg,#0d1117,#161b22)',
        is_premium: true,
        sort_order: 16,
        full_code: buildFull({
            fonts: 'Inter:wght@400;700;900',
            css: `
      body{font-family:'Inter',sans-serif;position:relative}
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
    `,
            html: `<div class="blob1"></div><div class="blob2"></div><div data-alert class="card"><div class="lbl">✦ Donation Alert</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>`,
            js: ``
        })
    },

    {
        id: 'gaming-hud',
        name: 'Gaming HUD',
        description: 'FPS game heads-up display with corner brackets',
        gradient: 'linear-gradient(135deg,#050510,#0a0a20)',
        is_premium: true,
        sort_order: 17,
        full_code: buildFull({
            fonts: 'Rajdhani:wght@500;700&family=Audiowide',
            css: `
      body{font-family:'Rajdhani',sans-serif}
      .hud{position:relative;padding:24px 36px;animation:hudIn .4s ease both}
      .corner{position:absolute;width:18px;height:18px;border-color:#00ffcc;border-style:solid}
      .tl{top:0;left:0;border-width:2px 0 0 2px}
      .tr{top:0;right:0;border-width:2px 2px 0 0}
      .bl{bottom:0;left:0;border-width:0 0 2px 2px}
      .br{bottom:0;right:0;border-width:0 2px 2px 0}
      .inner{text-align:center}
      .alert-tag{font-family:'Audiowide',sans-serif;font-size:9px;letter-spacing:4px;color:#00ffcc;text-transform:uppercase;margin-bottom:14px;opacity:.8}
      .donor{font-size:24px;font-weight:700;color:#fff;margin-bottom:4px;letter-spacing:2px}
      .amount{font-size:52px;font-weight:700;color:#00ffcc;font-family:'Audiowide',sans-serif;text-shadow:0 0 20px rgba(0,255,204,.5);line-height:1}
      .hp-bar-wrap{height:3px;background:rgba(0,255,204,.15);border-radius:2px;margin-top:14px;overflow:hidden}
      .hp-bar{height:100%;background:#00ffcc;box-shadow:0 0 8px #00ffcc;animation:drain 5.5s linear forwards}
      .msg{font-size:13px;color:rgba(0,255,204,.45);margin-top:8px}
      @keyframes hudIn{from{opacity:0;transform:scaleX(.5)}to{opacity:1;transform:scaleX(1)}}
      @keyframes drain{from{width:100%}to{width:0}}
    `,
            html: `<div data-alert class="hud"><div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div><div class="inner"><div class="alert-tag">⬕ Donation Received</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div><div class="hp-bar-wrap"><div class="hp-bar"></div></div></div></div>`,
            js: ``
        })
    },

    {
        id: 'anime-sakura',
        name: 'Anime Sakura',
        description: 'Beautiful Japanese anime style with falling petals',
        gradient: 'linear-gradient(135deg,#1a0010,#2d0020)',
        is_premium: true,
        sort_order: 18,
        full_code: buildFull({
            fonts: 'Noto+Sans+JP:wght@400;700&family=Poppins:wght@700;900',
            css: `
      body{font-family:'Poppins',sans-serif;overflow:hidden}
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
    `,
            html: `<div class="petals" id="petals"></div><div data-alert class="card"><div class="lbl">🌸 Donation</div><div class="donor">{{donor_name}}</div><div class="hr"></div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>`,
            js: `
      const p=document.getElementById('petals');
      for(let i=0;i<20;i++){const d=document.createElement('div');d.className='petal';d.textContent='🌸';d.style.left=Math.random()*100+'%';d.style.animationDuration=(3+Math.random()*5)+'s';d.style.animationDelay=(-Math.random()*5)+'s';d.style.fontSize=(10+Math.random()*14)+'px';p.appendChild(d);}
    `
        })
    },

    {
        id: 'vaporwave',
        name: 'Vaporwave',
        description: 'Retro synthwave aesthetic with grid and neon pinks',
        gradient: 'linear-gradient(180deg,#0d0221,#1a0a2e)',
        is_premium: true,
        sort_order: 19,
        full_code: buildFull({
            fonts: 'Audiowide&family=Rajdhani:wght@700',
            css: `
      body{font-family:'Audiowide',sans-serif;overflow:hidden}
      .grid{position:fixed;bottom:0;left:0;right:0;height:40%;background:linear-gradient(0deg,rgba(255,0,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,255,.12) 1px,transparent 1px);background-size:30px 30px;transform:perspective(200px) rotateX(60deg);transform-origin:bottom;opacity:.6}
      .sun{position:fixed;bottom:30%;left:50%;transform:translateX(-50%);width:120px;height:120px;border-radius:50%;background:linear-gradient(180deg,#ff6ec7,#ff0080);box-shadow:0 0 40px #ff0080;overflow:hidden}
      .sun-lines{position:absolute;bottom:0;left:0;right:0}
      .sun-line{height:6px;background:#0d0221;margin-bottom:4px}
      .sun-line:nth-child(1){margin-bottom:6px}.sun-line:nth-child(2){margin-bottom:7px}.sun-line:nth-child(3){margin-bottom:9px}
      .card{position:relative;z-index:10;background:rgba(10,2,30,.88);border:2px solid #ff6ec7;border-radius:12px;padding:20px 36px;text-align:center;animation:slideUp .6s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 0 30px rgba(255,110,199,.3),0 0 60px rgba(255,0,128,.2)}
      .lbl{font-size:8px;letter-spacing:5px;color:#ff6ec7;text-transform:uppercase;margin-bottom:12px}
      .donor{font-size:18px;color:#b4f5ff;margin-bottom:6px;font-family:'Rajdhani',sans-serif;font-weight:700}
      .amount{font-size:44px;font-weight:400;color:#ff6ec7;text-shadow:0 0 20px #ff0080,3px 3px 0 #7c00ff;line-height:1}
      .msg{font-size:11px;color:rgba(180,245,255,.4);margin-top:10px}
      @keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
    `,
            html: `<div class="grid"></div><div class="sun"><div class="sun-lines"><div class="sun-line"></div><div class="sun-line"></div><div class="sun-line"></div></div></div><div data-alert class="card"><div class="lbl">▶ Donation Alert</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>`,
            js: ``
        })
    },

    {
        id: 'crystal-diamond',
        name: 'Crystal Diamond',
        description: 'Luxurious crystal facet design with shimmer animation',
        gradient: 'linear-gradient(135deg,#0a0f1a,#040814)',
        is_premium: true,
        sort_order: 20,
        full_code: buildFull({
            fonts: 'Montserrat:wght@700;900',
            css: `
      body{font-family:'Montserrat',sans-serif}
      @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
      @keyframes popIn{from{transform:scale(.6) rotate(-5deg);opacity:0}to{transform:scale(1) rotate(0deg);opacity:1}}
      .card{background:linear-gradient(135deg,rgba(148,163,220,.08),rgba(96,130,215,.12),rgba(148,163,220,.08));border:1px solid rgba(148,163,220,.3);border-radius:24px;padding:28px 44px;text-align:center;animation:popIn .7s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 0 0 1px rgba(255,255,255,.05),0 20px 60px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.1)}
      .gem{font-size:32px;animation:popIn .5s ease both .3s}
      .lbl{font-size:9px;letter-spacing:4px;color:rgba(148,163,220,.7);text-transform:uppercase;margin:8px 0 12px}
      .donor{font-size:20px;font-weight:700;color:#e0e7ff;margin-bottom:8px}
      .amount{font-size:48px;font-weight:900;background:linear-gradient(90deg,#a5b4fc,#818cf8,#c7d2fe,#818cf8,#a5b4fc);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite;line-height:1}
      .msg{font-size:12px;color:rgba(200,210,255,.35);margin-top:12px}
    `,
            html: `<div data-alert class="card"><div class="gem">💎</div><div class="lbl">Premium Donation</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>`,
            js: ``
        })
    },

    {
        id: 'lightning-storm',
        name: 'Lightning Storm',
        description: 'Electric storm with lightning flash on entry',
        gradient: 'linear-gradient(135deg,#04060f,#080a1a)',
        is_premium: true,
        sort_order: 21,
        full_code: buildFull({
            fonts: 'Exo+2:wght@400;700;900',
            css: `
      body{font-family:'Exo 2',sans-serif;overflow:hidden}
      .flash{position:fixed;inset:0;background:#fff;opacity:0;animation:flash .6s ease both}
      @keyframes flash{0%{opacity:0}10%{opacity:.8}20%{opacity:0}30%{opacity:.4}40%{opacity:0}100%{opacity:0}}
      @keyframes stormIn{from{transform:translateY(-80px) scale(.8);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
      .card{position:relative;z-index:1;background:rgba(4,6,15,.94);border:2px solid #facc15;border-radius:16px;padding:22px 38px;text-align:center;animation:stormIn .6s cubic-bezier(.34,1.56,.64,1) both .2s;box-shadow:0 0 40px rgba(250,204,21,.25),0 8px 32px rgba(0,0,0,.6)}
      .bolt{font-size:32px;animation:bolt .3s steps(2) infinite}
      @keyframes bolt{0%{opacity:1}50%{opacity:.4}100%{opacity:1}}
      .donor{font-size:20px;font-weight:700;color:#fef08a;margin:8px 0 4px;letter-spacing:1px}
      .amount{font-size:50px;font-weight:900;color:#facc15;text-shadow:0 0 20px rgba(250,204,21,.7),0 0 40px rgba(250,204,21,.3);line-height:1}
      .msg{font-size:12px;color:rgba(254,240,138,.4);margin-top:10px}
    `,
            html: `<div class="flash"></div><div data-alert class="card"><div class="bolt">⚡</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>`,
            js: ``
        })
    },

    {
        id: 'ocean-wave',
        name: 'Ocean Wave',
        description: 'Calm ocean-inspired animated wave background',
        gradient: 'linear-gradient(135deg,#001a2e,#002d4a)',
        is_premium: true,
        sort_order: 22,
        full_code: buildFull({
            fonts: 'Poppins:wght@400;700;900',
            css: `
      body{font-family:'Poppins',sans-serif;overflow:hidden}
      .waves{position:fixed;bottom:0;left:0;right:0;height:120px}
      .wave1{position:absolute;bottom:0;width:200%;height:100%;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath d='M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z' fill='rgba(6,182,212,0.15)'/%3E%3C/svg%3E") repeat-x;animation:wave 5s linear infinite}
      .wave2{position:absolute;bottom:0;width:200%;height:80%;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath d='M0,80 C400,0 800,120 1200,40 L1200,120 L0,120 Z' fill='rgba(6,182,212,0.1)'/%3E%3C/svg%3E") repeat-x;animation:wave 7s linear infinite reverse}
      @keyframes wave{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      .card{position:relative;z-index:1;background:rgba(0,15,30,.88);border:2px solid rgba(6,182,212,.5);border-radius:22px;padding:24px 40px;text-align:center;animation:riseUp .7s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 0 40px rgba(6,182,212,.2)}
      .lbl{font-size:10px;letter-spacing:3px;color:#06b6d4;text-transform:uppercase;margin-bottom:12px;opacity:.8}
      .donor{font-size:22px;font-weight:700;color:#e0f2fe;margin-bottom:6px}
      .amount{font-size:48px;font-weight:900;color:#06b6d4;text-shadow:0 0 20px rgba(6,182,212,.5);line-height:1}
      .msg{font-size:12px;color:rgba(224,242,254,.4);margin-top:10px}
      @keyframes riseUp{from{transform:translateY(50px);opacity:0}to{transform:translateY(0);opacity:1}}
    `,
            html: `<div class="waves"><div class="wave1"></div><div class="wave2"></div></div><div data-alert class="card"><div class="lbl">🌊 Donation Alert</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>`,
            js: ``
        })
    },

    {
        id: 'neon-sign',
        name: 'Neon Sign',
        description: 'Flickering neon sign effect like a retro bar sign',
        gradient: 'linear-gradient(135deg,#03000a,#06001a)',
        is_premium: true,
        sort_order: 23,
        full_code: buildFull({
            fonts: 'Pacifico',
            css: `
      body{font-family:'Pacifico',cursive;background:#03000a;overflow:hidden}
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
    `,
            html: `<div data-alert class="card"><div class="sign-border"><div class="lbl">✦ Donation ✦</div><div class="dot1"></div><div class="dot2"></div><div class="dot3"></div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div></div>`,
            js: ``
        })
    },

    {
        id: 'aurora-borealis',
        name: 'Aurora Borealis',
        description: 'Northern lights aurora effect with flowing colors',
        gradient: 'linear-gradient(135deg,#000d1a,#001a0d)',
        is_premium: true,
        sort_order: 24,
        full_code: buildFull({
            fonts: 'Inter:wght@400;700;900',
            css: `
      body{font-family:'Inter',sans-serif;overflow:hidden}
      .aurora{position:fixed;inset:0;background:linear-gradient(180deg,transparent 0%,rgba(0,255,128,.06) 30%,rgba(0,200,255,.08) 60%,rgba(128,0,255,.06) 100%);animation:aurora 6s ease-in-out infinite}
      .aurora2{position:fixed;inset:0;background:linear-gradient(120deg,transparent 20%,rgba(0,255,200,.05) 50%,rgba(0,100,255,.07) 80%);animation:aurora 8s ease-in-out infinite reverse .5s}
      @keyframes aurora{0%,100%{transform:scaleY(1) translateY(0)}50%{transform:scaleY(1.1) translateY(-10px)}}
      .card{position:relative;z-index:1;background:rgba(0,5,15,.88);border:1px solid rgba(0,255,150,.25);border-radius:22px;padding:26px 42px;text-align:center;animation:glow .8s ease both;box-shadow:0 0 40px rgba(0,255,150,.1),0 20px 60px rgba(0,0,0,.5)}
      .lbl{font-size:10px;letter-spacing:3px;color:rgba(0,255,150,.7);text-transform:uppercase;margin-bottom:14px}
      .donor{font-size:22px;font-weight:700;color:#d1fae5;margin-bottom:6px}
      .amount{font-size:50px;font-weight:900;background:linear-gradient(90deg,#00ff96,#00d4ff,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
      .msg{font-size:12px;color:rgba(209,250,229,.35);margin-top:12px}
      @keyframes glow{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
    `,
            html: `<div class="aurora"></div><div class="aurora2"></div><div data-alert class="card"><div class="lbl">🌌 Donation Alert</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div class="msg">{{message}}</div></div>`,
            js: ``
        })
    }

]

// ─── Insert via Supabase REST API ─────────────────────────────────────────────
async function seed() {
    console.log(`\nSeeding ${templates.length} templates (5 free + 15 premium)...\n`)
    let ok = 0, fail = 0

    for (const t of templates) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/overlay_templates`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({ ...t, is_active: true })
        })
        if (res.ok || res.status === 201 || res.status === 200) {
            console.log(`  ✓ [${t.is_premium ? 'PRO' : 'FREE'}] ${t.name}`)
            ok++
        } else {
            const err = await res.text()
            console.error(`  ✗ ${t.name}: ${err}`)
            fail++
        }
    }

    console.log(`\n${ok} inserted, ${fail} failed.\n`)
}

seed().catch(console.error)
