import fs from 'fs';

function buildFull({ fonts = 'Inter', extraHead = '', css, html, js }) {
    const fontLink = `<link href="https://fonts.googleapis.com/css2?family=${fonts.replace(/ /g, '+').replace(/,/g, '&family=')}&display=swap" rel="stylesheet">`;
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
${js || ''}
setTimeout(()=>{
  const el=document.querySelector('[data-alert]');
  if(el){el.style.transition='opacity .6s ease';el.style.opacity='0';}
},5500);
}catch(e){console.error(e)}
</script>
</body>
</html>`;
}

// 40 templates generated procedurally to maintain distinct aesthetics
const templatesData = [
  // NATURE (1-5)
  { id: 'nt-forest', name: 'Mystic Forest', desc: 'Glowing green leaves falling', grad: 'linear-gradient(to bottom, #064e3b, #022c22)',
    css: `.card{background:rgba(2,44,34,.9);border-bottom:4px solid #10b981;border-radius:12px;padding:20px 30px;text-align:center;animation:fadeUp .6s both;box-shadow:0 10px 30px rgba(16,185,129,.3)}.donor{font-size:24px;color:#34d399;font-weight:700}.amount{font-size:42px;color:#a7f3d0;font-weight:900}@keyframes fadeUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">🍃 {{donor_name}}</div><div class="amount">₹{{amount}}</div><div>{{message}}</div></div>`
  },
  { id: 'nt-volcano', name: 'Volcano Eruption', desc: 'Fiery magma burst', grad: 'linear-gradient(to bottom, #7f1d1d, #450a0a)',
    css: `.card{background:rgba(69,10,10,.9);border-top:4px solid #ef4444;border-radius:12px;padding:20px 30px;text-align:center;animation:shake .5s both;box-shadow:0 10px 30px rgba(239,68,68,.4)}.donor{font-size:24px;color:#fca5a5;font-weight:700}.amount{font-size:42px;color:#fef08a;font-weight:900;text-shadow:0 0 10px #f87171}@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}`,
    html: `<div data-alert class="card"><div class="donor">🌋 {{donor_name}}</div><div class="amount">₹{{amount}}</div><div>{{message}}</div></div>`
  },
  { id: 'nt-avalanche', name: 'Avalanche', desc: 'Cool frozen snow drop', grad: 'linear-gradient(to bottom, #dbeafe, #1e3a8a)',
    css: `.card{background:rgba(30,58,138,.9);border-radius:24px;padding:20px 30px;text-align:center;animation:slideDown .6s both;box-shadow:0 10px 30px rgba(191,219,254,.4)}.donor{font-size:24px;color:#93c5fd;font-weight:700}.amount{font-size:42px;color:#eff6ff;font-weight:900}@keyframes slideDown{from{transform:translateY(-50px);opacity:0}to{transform:translateY(0);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">❄️ {{donor_name}}</div><div class="amount">₹{{amount}}</div><div>{{message}}</div></div>`
  },
  { id: 'nt-tornado', name: 'Tornado Spin', desc: 'Spinning wind vortex', grad: 'radial-gradient(circle, #64748b, #0f172a)',
    css: `.card{background:rgba(15,23,42,.9);border:2px dashed #94a3b8;border-radius:50%;width:240px;height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:spinIn .8s both;box-shadow:0 0 40px rgba(148,163,184,.3)}.donor{font-size:20px;color:#cbd5e1;font-weight:700}.amount{font-size:36px;color:#f8fafc;font-weight:900}@keyframes spinIn{from{transform:rotate(-180deg) scale(.5);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">🌪️ {{donor_name}}</div><div class="amount">₹{{amount}}</div><div style="font-size:11px;opacity:0.6;margin-top:10px">{{message}}</div></div>`
  },
  { id: 'nt-starry', name: 'Starry Night', desc: 'Twinkling stars galaxy', grad: 'linear-gradient(to bottom, #172554, #020617)',
    css: `.card{background:rgba(2,6,23,.9);border:1px solid #1e3a8a;border-radius:16px;padding:25px 35px;text-align:center;animation:fadeIn .8s both;box-shadow:0 0 50px rgba(30,58,138,.5)}.donor{font-size:22px;color:#bfdbfe;font-weight:700}.amount{font-size:44px;color:#fef08a;font-weight:900;text-shadow:0 0 15px #fef08a}@keyframes fadeIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}`,
    html: `<div data-alert class="card"><div class="donor">✨ {{donor_name}}</div><div class="amount">₹{{amount}}</div><div>{{message}}</div></div>`
  },

  // SCI-FI (6-10)
  { id: 'sf-holo', name: 'Holo Grid', desc: 'Cyan holographic projection', grad: 'repeating-linear-gradient(0deg, #083344, #083344 1px, #042f2e 1px, #042f2e 20px)',
    css: `.card{background:rgba(8,51,68,.8);border:2px solid #22d3ee;border-radius:8px;padding:20px 30px;text-align:center;animation:glitch .4s steps(4) both;box-shadow:inset 0 0 20px #22d3ee, 0 0 20px #22d3ee;font-family:monospace}.donor{font-size:20px;color:#67e8f9;text-transform:uppercase}.amount{font-size:46px;color:#cffafe;font-weight:900}@keyframes glitch{0%{transform:skew(-20deg)}100%{transform:skew(0deg)}}`,
    html: `<div data-alert class="card"><div style="font-size:10px;color:#22d3ee;margin-bottom:10px">SYSTEM INCOMING</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div>"{{message}}"</div></div>`
  },
  { id: 'sf-laser', name: 'Laser Scanner', desc: 'Red scanner line tracing', grad: 'linear-gradient(135deg, #450a0a, #000)',
    css: `.card{position:relative;background:#000;border-left:4px solid #ef4444;padding:20px 30px;text-align:left;animation:slideRight .5s both;overflow:hidden}.card::after{content:'';position:absolute;top:0;left:0;width:100%;height:2px;background:#ef4444;box-shadow:0 0 10px #ef4444;animation:scan 2s linear infinite}.donor{font-size:20px;color:#f87171}.amount{font-size:40px;color:#fff;font-weight:900}@keyframes slideRight{from{transform:translateX(-40px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes scan{0%{top:0}50%{top:100%}100%{top:0}}`,
    html: `<div data-alert class="card"><div class="donor">TARGET: {{donor_name}}</div><div class="amount">₹{{amount}}</div><div style="color:rgba(255,255,255,0.5)">{{message}}</div></div>`
  },
  { id: 'sf-aicore', name: 'AI Core', desc: 'Pulsing artificial intelligence eye', grad: 'radial-gradient(circle, #4c1d95, #000)',
    css: `.card{background:rgba(0,0,0,.8);border-radius:100px;padding:20px 50px;text-align:center;animation:pulse .8s infinite alternate;box-shadow:0 0 30px #8b5cf6}.donor{font-size:20px;color:#c4b5fd}.amount{font-size:48px;color:#f3e8ff;font-weight:900}@keyframes pulse{from{box-shadow:0 0 10px #8b5cf6;transform:scale(0.98)}to{box-shadow:0 0 40px #a78bfa;transform:scale(1.02)}}`,
    html: `<div data-alert class="card"><div class="donor">🧿 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'sf-ribbon', name: 'Quantum Ribbon', desc: 'Neon abstract ribbon flow', grad: 'linear-gradient(45deg, #1e1b4b, #312e81)',
    css: `.card{background:linear-gradient(45deg,#4f46e5,#ec4899);padding:3px;border-radius:16px;animation:fade .6s both}.inner{background:#000;border-radius:13px;padding:25px 40px;text-align:center}.donor{font-size:22px;color:#e0e7ff;font-weight:700}.amount{font-size:46px;background:-webkit-linear-gradient(45deg,#818cf8,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900}@keyframes fade{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}`,
    html: `<div data-alert class="card"><div class="inner"><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div style="color:#aaa;margin-top:10px">{{message}}</div></div></div>`
  },
  { id: 'sf-space', name: 'Spaceship Window', desc: 'View into the cosmos', grad: 'linear-gradient(135deg, #0f172a, #000)',
    css: `.card{background:#000;border:8px solid #334155;border-radius:40px;padding:30px 50px;text-align:center;animation:popIn .6s both;box-shadow:inset 0 0 20px rgba(255,255,255,.1)}.donor{font-size:20px;color:#cbd5e1}.amount{font-size:44px;color:#fff;font-weight:900}@keyframes popIn{from{transform:perspective(500px) translateZ(-100px);opacity:0}to{transform:perspective(500px) translateZ(0);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">🛰️ {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },

  // GAMING UI (11-15)
  { id: 'gm-rpg', name: 'RPG Quest', desc: 'Fantasy RPG quest complete UI', grad: 'url(https://www.transparenttextures.com/patterns/aged-paper.png)',
    css: `.card{background:#d4b382;border:3px solid #78350f;padding:20px 40px;text-align:center;font-family:serif;animation:slideUp .5s both;box-shadow:4px 4px 0 #78350f}.donor{font-size:22px;color:#451a03;font-weight:700}.amount{font-size:36px;color:#78350f;font-weight:900}@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`,
    html: `<div data-alert class="card"><div style="font-size:12px;color:#92400e;letter-spacing:2px;margin-bottom:8px">QUEST COMPLETE</div><div class="donor">{{donor_name}}</div><div class="amount">+₹{{amount}}</div><div>{{message}}</div></div>`
  },
  { id: 'gm-arcade', name: 'Arcade High Score', desc: 'Retro 8-bit arcade cabinet screen', grad: 'linear-gradient(135deg, #000, #111)',
    css: `.card{background:#000;border:4px solid #fde047;padding:25px 35px;text-align:center;font-family:monospace;animation:blink .5s both;color:#fde047}.donor{font-size:24px}.amount{font-size:50px;font-weight:900;text-shadow:4px 4px #b45309}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`,
    html: `<div data-alert class="card"><div style="font-size:14px;margin-bottom:10px">NEW HIGH SCORE!</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'gm-lootbox', name: 'Loot Box', desc: 'Glowing legendary item drop', grad: 'radial-gradient(circle, #f59e0b, #78350f)',
    css: `.card{background:linear-gradient(to bottom, #f59e0b, #d97706);border:2px solid #fff;border-radius:12px;padding:20px 40px;text-align:center;animation:pop .6s both;box-shadow:0 0 50px #f59e0b}.donor{font-size:20px;color:#fff;font-weight:700}.amount{font-size:46px;color:#fff;font-weight:900;text-shadow:0 2px 4px rgba(0,0,0,.3)}@keyframes pop{0%{transform:scale(0)}80%{transform:scale(1.1)}100%{transform:scale(1)}}`,
    html: `<div data-alert class="card"><div style="font-size:12px;color:#fee11;text-transform:uppercase;font-weight:800;letter-spacing:2px">Legendary Drop!</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'gm-fighting', name: 'Fighting Game KO', desc: 'Aggressive comic/fighter style impact', grad: 'linear-gradient(135deg, #991b1b, #000)',
    css: `.card{background:#dc2626;transform:skew(-10deg);padding:20px 40px;text-align:center;animation:zoomIn .3s both;box-shadow:-10px 10px 0 #000;border:4px solid #fff}.inner{transform:skew(10deg)}.donor{font-size:24px;color:#fff;font-weight:900;text-transform:uppercase}.amount{font-size:55px;color:#fde047;font-weight:900;text-shadow:0 4px 0 #000}@keyframes zoomIn{from{transform:perspective(400px) translateZ(200px) skew(-10deg);opacity:0}to{transform:perspective(400px) translateZ(0) skew(-10deg);opacity:1}}`,
    html: `<div data-alert class="card"><div class="inner"><div style="font-size:28px;color:#fff;font-weight:900;font-style:italic">K.O.!</div><div class="donor">{{donor_name}} WINS</div><div class="amount">₹{{amount}}</div></div></div>`
  },
  { id: 'gm-potion', name: 'Health Potion', desc: 'Bubbling red liquid shape', grad: 'linear-gradient(to bottom, #7f1d1d, #ef4444)',
    css: `.card{background:rgba(239,68,68,.9);border-bottom-left-radius:50%;border-bottom-right-radius:50%;width:200px;height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:bubble .8s both alternate;border:4px solid #fca5a5}.donor{font-size:22px;color:#fff;font-weight:700}.amount{font-size:40px;color:#fff;font-weight:900}@keyframes bubble{from{transform:translateY(10px)}to{transform:translateY(0)}}`,
    html: `<div data-alert class="card"><div class="donor">❤️ {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },

  // CUTE / KAWAII (16-20)
  { id: 'kw-slime', name: 'Bouncing Slime', desc: 'Jiggly cute aesthetic', grad: 'linear-gradient(to bottom, #a7f3d0, #34d399)',
    css: `.card{background:#6ee7b7;border-radius:40px 40px 10px 10px;padding:30px;text-align:center;animation:jiggle .6s both;box-shadow:0 10px 20px rgba(16,185,129,.3)}.donor{font-size:22px;color:#064e3b;font-weight:700}.amount{font-size:44px;color:#022c22;font-weight:900}@keyframes jiggle{0%,100%{transform:scale(1)}50%{transform:scaleX(1.1) scaleY(0.9)}}`,
    html: `<div data-alert class="card"><div style="font-size:24px;margin-bottom:10px">>w<</div><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'kw-candy', name: 'Bubblegum Sparkle', desc: 'Pink and cute girly alert', grad: 'linear-gradient(135deg, #fbcfe8, #f472b6)',
    css: `.card{background:#fdf2f8;border:4px solid #f472b6;border-radius:30px;padding:20px 40px;text-align:center;animation:pop .4s both;box-shadow:0 10px 30px rgba(244,114,182,.4)}.donor{font-size:22px;color:#be185d;font-weight:700}.amount{font-size:46px;color:#db2777;font-weight:900}@keyframes pop{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">🎀 {{donor_name}}</div><div class="amount">₹{{amount}}</div><div style="color:#f472b6">{{message}}</div></div>`
  },
  { id: 'kw-cloud', name: 'Cloud Floats', desc: 'Fluffy white cloud shape', grad: 'linear-gradient(to bottom, #bae6fd, #e0f2fe)',
    css: `.card{background:#fff;border-radius:100px;padding:30px 60px;text-align:center;animation:float 3s ease-in-out infinite;box-shadow:0 20px 40px rgba(186,230,253,.5)}.donor{font-size:20px;color:#0284c7;font-weight:700}.amount{font-size:40px;color:#0369a1;font-weight:900}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}`,
    html: `<div data-alert class="card"><div class="donor">☁️ {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'kw-paws', name: 'Puppy Paws', desc: 'Cute pet paws theme', grad: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    css: `.card{background:#fffbeb;border:3px dashed #d97706;border-radius:20px;padding:20px 40px;text-align:center;animation:wiggle .5s both;color:#d97706}.donor{font-size:22px;font-weight:700}.amount{font-size:44px;font-weight:900}@keyframes wiggle{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}`,
    html: `<div data-alert class="card"><div class="donor">🐾 {{donor_name}}</div><div class="amount">₹{{amount}}</div><div>{{message}}</div></div>`
  },
  { id: 'kw-rainbow', name: 'Rainbow Arch', desc: 'Full spectrum rainbow gradient', grad: 'linear-gradient(to right, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7)',
    css: `.card{background:#fff;border-top-left-radius:100px;border-top-right-radius:100px;border-bottom:8px solid #3b82f6;padding:40px 60px 20px 60px;text-align:center;animation:fadeUp .6s both;box-shadow:0 10px 30px rgba(0,0,0,.1)}.donor{font-size:22px;color:#eab308;font-weight:700}.amount{font-size:46px;background:linear-gradient(to right, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900}@keyframes fadeUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">🌈 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },

  // HORROR / SPOOKY (21-25)
  { id: 'sp-blood', name: 'Blood Drip', desc: 'Red dripping aesthetics', grad: 'linear-gradient(to bottom, #7f1d1d, #000)',
    css: `.card{background:#450a0a;border-top:5px solid #b91c1c;padding:25px 40px;text-align:center;animation:drip 1s both;box-shadow:0 10px 20px rgba(185,28,28,.4)}.donor{font-size:20px;color:#fecaca;font-weight:700}.amount{font-size:48px;color:#ef4444;font-weight:900}@keyframes drip{0%{transform:scaleY(0.5);opacity:0}100%{transform:scaleY(1);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">🩸 {{donor_name}}</div><div class="amount">₹{{amount}}</div><div style="color:rgba(255,255,255,0.4)">{{message}}</div></div>`
  },
  { id: 'sp-fog', name: 'Haunted Fog', desc: 'Smokey, blurred dark alert', grad: 'linear-gradient(135deg, #1f2937, #030712)',
    css: `.card{background:rgba(17,24,39,.7);backdrop-filter:blur(8px);border:1px solid #4b5563;border-radius:16px;padding:25px 40px;text-align:center;animation:fade .8s both;box-shadow:0 0 40px rgba(0,0,0,.8)}.donor{font-size:22px;color:#d1d5db;font-weight:700}.amount{font-size:44px;color:#f3f4f6;font-weight:900;text-shadow:0 0 20px #9ca3af}@keyframes fade{from{opacity:0;-webkit-filter:blur(10px)}to{opacity:1;-webkit-filter:blur(0)}}`,
    html: `<div data-alert class="card"><div class="donor">👻 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'sp-flicker', name: 'Flickering Bulb', desc: 'Broken horror light effect', grad: 'linear-gradient(135deg, #27272a, #09090b)',
    css: `.card{background:#18181b;border:1px solid #3f3f46;padding:20px 40px;text-align:center;animation:flicker 3s infinite;color:#f4f4f5}.donor{font-size:20px;color:#a1a1aa}.amount{font-size:50px;font-weight:900;text-shadow:0 0 10px #f4f4f5}@keyframes flicker{0%,90%,100%{opacity:1}95%{opacity:0.3}98%{opacity:0.8}}`,
    html: `<div data-alert class="card"><div class="donor">💡 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'sp-zombie', name: 'Zombie Hand', desc: 'Grungy decayed green look', grad: 'linear-gradient(135deg, #14532d, #022c22)',
    css: `.card{background:#064e3b;border:3px dashed #166534;border-radius:10px;padding:20px 40px;text-align:center;animation:rise .6s both;transform:rotate(-3deg);color:#a7f3d0}.donor{font-size:22px;font-weight:700}.amount{font-size:46px;font-weight:900}@keyframes rise{from{transform:translateY(40px) rotate(-10deg);opacity:0}to{transform:translateY(0) rotate(-3deg);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">🧟 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'sp-web', name: 'Spider Web', desc: 'Intricate thin white lines', grad: 'linear-gradient(135deg, #171717, #0a0a0a)',
    css: `.card{background:transparent;border:1px solid #525252;border-radius:50%;width:220px;height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:spinScale .8s both;position:relative}.card::before{content:'';position:absolute;inset:5px;border:1px solid #404040;border-radius:50%}.card::after{content:'';position:absolute;inset:15px;border:1px solid #262626;border-radius:50%}.donor{font-size:18px;color:#a3a3a3}.amount{font-size:40px;color:#fafafa;font-weight:900}@keyframes spinScale{from{transform:scale(0) rotate(90deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">🕸️ {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },

  // ABSTRACT / MODERN (26-30)
  { id: 'ab-liquid', name: 'Liquid Gradient', desc: 'Melting multi-color gradient', grad: 'linear-gradient(135deg, #fb923c, #ec4899, #8b5cf6)',
    css: `.card{background:linear-gradient(135deg,#fb923c,#ec4899,#8b5cf6);background-size:200% 200%;border-radius:24px;padding:25px 45px;text-align:center;animation:flow 3s ease infinite, popIn .5s both;box-shadow:0 10px 40px rgba(236,72,153,.5);color:#fff}.donor{font-size:20px;font-weight:700;opacity:0.9}.amount{font-size:50px;font-weight:900}@keyframes flow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}@keyframes popIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div><div style="font-size:12px;opacity:0.8;margin-top:10px">{{message}}</div></div>`
  },
  { id: 'ab-rings', name: 'Glass Rings', desc: 'Concentric semi-transparent rings', grad: 'radial-gradient(circle, #e2e8f0, #94a3b8)',
    css: `.card{background:rgba(255,255,255,.2);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.5);border-radius:100px;padding:30px 60px;text-align:center;animation:fade .6s both;box-shadow:0 10px 30px rgba(0,0,0,.1)}.donor{font-size:20px;color:#334155;font-weight:700}.amount{font-size:48px;color:#0f172a;font-weight:900}@keyframes fade{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}`,
    html: `<div data-alert class="card"><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'ab-kinetic', name: 'Kinetic Typography', desc: 'Huge bold text focus', grad: 'linear-gradient(to right, #000, #333)',
    css: `.card{background:#000;color:#fff;padding:20px 40px;text-align:center;animation:slideLeft .4s both}.donor{font-size:14px;letter-spacing:10px;text-transform:uppercase;color:#a3a3a3}.amount{font-size:70px;line-height:1;font-weight:900;letter-spacing:-4px}@keyframes slideLeft{from{transform:translateX(50px);opacity:0}to{transform:translateX(0);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'ab-blob', name: 'Morphing Blob', desc: 'Organic weird moving shape', grad: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    css: `.card{background:#f472b6;color:#fff;padding:40px 50px;text-align:center;animation:morph 4s ease-in-out infinite, fadeUp .6s both;box-shadow:0 10px 30px rgba(244,114,182,.4)}.donor{font-size:22px;font-weight:700;opacity:0.9}.amount{font-size:48px;font-weight:900}@keyframes morph{0%,100%{border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%}50%{border-radius: 30% 70% 70% 30% / 30% 60% 40% 70%}}@keyframes fadeUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'ab-iso', name: 'Isometric Cubes', desc: '3D geometric feel', grad: 'linear-gradient(to bottom, #f1f5f9, #cbd5e1)',
    css: `.card{background:#e2e8f0;border-left:10px solid #94a3b8;border-bottom:10px solid #64748b;padding:20px 40px;text-align:center;transform:rotateX(20deg) rotateZ(-20deg);animation:drop .4s both;box-shadow:20px 20px 0 rgba(0,0,0,.1)}.donor{font-size:20px;color:#334155;font-weight:700}.amount{font-size:46px;color:#0f172a;font-weight:900}@keyframes drop{from{transform:translateY(-50px) rotateX(20deg) rotateZ(-20deg);opacity:0}to{transform:translateY(0) rotateX(20deg) rotateZ(-20deg);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">🧊 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },

  // RETRO / VINTAGE (31-35)
  { id: 'rt-vhs', name: 'VHS Tracking', desc: 'Static distorted VCR text', grad: 'linear-gradient(135deg, #111, #000)',
    css: `.card{background:#000;border-left:8px solid #3b82f6;border-right:8px solid #ef4444;padding:20px 40px;text-align:center;font-family:sans-serif;animation:vhs .2s infinite;color:#fff}.donor{font-size:20px;letter-spacing:4px;color:#9ca3af}.amount{font-size:48px;font-weight:900;text-shadow:2px 0 0 #ef4444, -2px 0 0 #3b82f6}@keyframes vhs{50%{transform:translate(1px, 1px)}}`,
    html: `<div data-alert class="card"><div class="donor">PLAY ► {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'rt-8bit', name: '8-Bit Hearts', desc: 'Pixel hearts style', grad: 'linear-gradient(to right, #fdf4ff, #fae8ff)',
    css: `.card{background:#fdf4ff;border:4px solid #d946ef;padding:20px 40px;text-align:center;font-family:monospace;animation:pixelPop .4s steps(5) both}.donor{font-size:18px;color:#a21caf}.amount{font-size:44px;color:#86198f;font-weight:900}@keyframes pixelPop{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">♥♥♥ {{donor_name}} ♥♥♥</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'rt-tape', name: 'Cassette Tape', desc: 'Old-school mixtape design', grad: 'linear-gradient(to bottom, #ffed4a, #f59e0b)',
    css: `.card{background:#fef3c7;border:2px solid #b45309;border-radius:12px;padding:20px 40px;text-align:center;animation:slideUp .5s both;box-shadow:0 10px 20px rgba(180,83,9,.2)}.donor{font-size:18px;font-family:cursive;color:#78350f}.amount{font-size:46px;font-family:Impact, sans-serif;color:#92400e;letter-spacing:2px}@keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}`,
    html: `<div data-alert class="card"><div style="font-size:12px;border-bottom:1px solid #d97706;padding-bottom:5px;margin-bottom:10px;text-transform:uppercase">A-SIDE</div><div class="donor">Mix by {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'rt-crt', name: 'CRT Monitor', desc: 'Green phosphor terminal', grad: 'linear-gradient(135deg, #052e16, #022c22)',
    css: `.card{background:#000;border:20px solid #1a1a1a;border-radius:20px;padding:20px 30px;text-align:left;font-family:monospace;color:#22c55e;animation:turnOn .4s both;text-shadow:0 0 5px #22c55e}.donor{font-size:16px}.amount{font-size:36px;font-weight:700}@keyframes turnOn{0%{transform:scaleY(0.01);opacity:0}100%{transform:scaleY(1);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">C:\\> root access granted to {{donor_name}}</div><div class="amount">FUNDS: ₹{{amount}}</div><div>_</div></div>`
  },
  { id: 'rt-disco', name: 'Disco Floor', desc: 'Flashing colorful tiles', grad: 'repeating-linear-gradient(45deg, #000, #000 20px, #111 20px, #111 40px)',
    css: `.card{background:linear-gradient(45deg, #ef4444, #3b82f6, #eab308, #a855f7);background-size:400% 400%;border:4px solid #fff;border-radius:16px;padding:25px 45px;text-align:center;animation:disco 2s linear infinite, fade .5s both;box-shadow:0 0 40px rgba(255,255,255,.5)}.donor{font-size:24px;color:#fff;font-weight:900;text-shadow:0 2px 4px #000}.amount{font-size:50px;color:#fff;font-weight:900;text-shadow:0 4px 8px #000}@keyframes disco{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}@keyframes fade{from{opacity:0}to{opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">🕺 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },

  // CINEMATIC (36-40)
  { id: 'ci-ratio', name: 'Golden Ratio', desc: 'Perfectly balanced geometry', grad: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    css: `.card{background:#fff;border:1px solid #cbd5e1;padding:30px 48px;text-align:center;animation:expand .6s both;box-shadow:0 20px 40px rgba(0,0,0,.05)}.donor{font-size:16px;color:#64748b;letter-spacing:2px;text-transform:uppercase}.amount{font-size:55px;color:#0f172a;font-weight:300;font-family:serif}@keyframes expand{from{width:0;opacity:0}to{width:300px;opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">{{donor_name}}</div><div style="width:50px;height:1px;background:#cbd5e1;margin:15px auto"></div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'ci-bars', name: 'Cinematic Bars', desc: 'Letterbox movie style', grad: 'linear-gradient(to bottom, #000 20%, #1e293b 20%, #1e293b 80%, #000 80%)',
    css: `.card{background:transparent;width:100%;text-align:center;animation:slideDown .5s both}.donor{font-size:24px;color:#f8fafc;font-weight:700}.amount{font-size:60px;color:#fbbf24;font-weight:900;text-shadow:0 4px 10px rgba(0,0,0,.5)}@keyframes slideDown{from{transform:translateY(-100px);opacity:0}to{transform:translateY(0);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">DIRECTED BY {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'ci-film', name: 'Film Reel', desc: 'Countdown reel aesthetic', grad: 'linear-gradient(135deg, #262626, #171717)',
    css: `.card{background:#000;border:4px dashed #fff;border-radius:50%;width:240px;height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:spinStop 1s cubic-bezier(0.2, 0.8, 0.2, 1) both;color:#fff}.donor{font-size:20px;font-weight:700;margin-bottom:10px}.amount{font-size:50px;font-weight:900}@keyframes spinStop{from{transform:rotate(720deg) scale(0);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">{{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'ci-flash', name: 'Camera Flash', desc: 'Paparazzi bright flash', grad: 'linear-gradient(135deg, #1f2937, #111827)',
    css: `.card{background:#fff;color:#000;padding:20px 40px;text-align:center;animation:flashBg .6s both;border-radius:8px}.donor{font-size:24px;font-weight:900;text-transform:uppercase}.amount{font-size:46px;font-weight:900}@keyframes flashBg{0%{background:#fff;transform:scale(1.2);box-shadow:0 0 100px #fff;opacity:0}20%{background:#fff;box-shadow:0 0 100px #fff;opacity:1}100%{background:#f8fafc;transform:scale(1);opacity:1}}`,
    html: `<div data-alert class="card"><div class="donor">📸 {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  },
  { id: 'ci-spotlight', name: 'Spotlight Focus', desc: 'Intense center light', grad: 'radial-gradient(circle at center, #334155, #020617)',
    css: `.card{background:transparent;text-align:center;animation:spot .8s both;color:#fff}.donor{font-size:22px;color:#94a3b8;font-weight:700}.amount{font-size:55px;color:#fff;font-weight:900;text-shadow:0 0 30px #fff}@keyframes spot{from{filter:brightness(0);transform:scale(0.9)}to{filter:brightness(1);transform:scale(1)}}`,
    html: `<div data-alert class="card"><div class="donor">STAGE LEFT: {{donor_name}}</div><div class="amount">₹{{amount}}</div></div>`
  }
];

let sql = 'INSERT INTO overlay_templates (id, name, description, gradient, is_premium, is_active, sort_order, full_code) VALUES\n';

const values = templatesData.map((t, index) => {
    // Generate full code using helper
    const fullCodeRaw = buildFull({ css: t.css, html: t.html, js: t.js || '' });

    // Escape single quotes for SQL
    const full = fullCodeRaw.replace(/'/g, "''");
    const name = t.name.replace(/'/g, "''");
    const desc = t.desc.replace(/'/g, "''");
    const grad = t.grad.replace(/'/g, "''");
    
    // Sort order starts at 25 since we have 20 + some padding initially
    return `('${t.id}', '${name}', '${desc}', '${grad}', true, true, ${25 + index}, '${full}')`;
});

sql += values.join(',\n') + '\nON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, gradient = EXCLUDED.gradient, is_premium = EXCLUDED.is_premium, is_active = EXCLUDED.is_active, sort_order = EXCLUDED.sort_order, full_code = EXCLUDED.full_code;';

fs.writeFileSync('insert_40_templates.sql', sql);
console.log('SQL generated successfully: insert_40_templates.sql');
