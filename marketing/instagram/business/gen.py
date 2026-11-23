# Gera os carrosséis educativos do @fabriciomoura.business no molde aprovado (DESIGN.md).
# Uso: python3 gen.py  -> cria cNN-slug/index.html; depois render.cjs em cada pasta.
import html, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
LINE_Y = 600
NW = ";white-space:nowrap"  # a linha corre aqui; texto de cima termina antes, texto de baixo começa depois

CSS = """
:root{--paper:#EDEAE3;--ink:#111111;--red:#FF4A1C;--mute:rgba(17,17,17,.55)}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#333;font-family:Inter,sans-serif;color:var(--ink)}
#pano{position:relative;width:8640px;height:1350px;overflow:hidden}
.s{position:absolute;top:0;width:1080px;height:1350px;background:var(--paper);overflow:hidden}
.s.red{background:var(--red)}
.s.dark{background:var(--ink);color:var(--paper)}
.a{position:absolute}
.mono{font-family:"Space Mono",monospace;font-size:22px;letter-spacing:.06em;text-transform:uppercase}
.chrome{top:58px;left:80px;right:80px;display:flex;justify-content:space-between;color:var(--mute)}
.dark .chrome,.dark .foot{color:rgba(237,234,227,.55)}
.red .chrome,.red .foot{color:rgba(17,17,17,.7)}
.foot{bottom:56px;left:80px;right:80px;display:flex;justify-content:space-between;color:var(--mute)}
.foot .go{color:var(--red);font-weight:700}
.red .foot .go{color:var(--ink)}
.H{font-family:Anton,sans-serif;text-transform:uppercase;line-height:1.1;letter-spacing:.005em}
.r{color:var(--red)}
.red .r{color:var(--paper)}
.lab{font-family:"Space Mono",monospace;font-size:22px;letter-spacing:.06em;text-transform:uppercase;font-weight:700}
.dark .lab{color:var(--red)}
.top{left:80px;width:920px;bottom:%(ab)spx;display:flex;flex-direction:column;justify-content:flex-end;gap:22px}
.low{left:80px;width:920px;top:%(bt)spx;height:%(bh)spx;display:flex;flex-direction:column;gap:34px}
.B{font-size:52px;line-height:1.3;font-weight:500;letter-spacing:-.01em}
.dark .B{color:rgba(237,234,227,.82)}
.B b{font-weight:800}
.dark .B b{color:var(--paper)}
.ck{display:flex;gap:24px;align-items:baseline;font-size:58px;line-height:1.15;font-weight:800;letter-spacing:-.03em}
.ck i{font-style:normal;font-family:Anton,sans-serif;font-weight:400;color:var(--red);min-width:1.1em}
.tr{display:grid;grid-template-columns:400px 1fr;gap:28px;align-items:baseline;padding:22px 0;border-top:3px solid var(--ink);font-size:42px;line-height:1.2}
.tr .x{color:var(--mute);text-decoration:line-through;text-decoration-thickness:3px;font-weight:600}
.tr .ok{font-weight:800;letter-spacing:-.02em}
.tr .ok::before{content:"→ ";color:var(--red)}
.box{background:var(--ink);color:var(--paper);padding:40px 48px}
svg#thread{position:absolute;left:0;top:0;pointer-events:none;z-index:3}
""" % {"ab": 1350 - (LINE_Y - 50), "bt": LINE_Y + 62, "bh": 1350 - (LINE_Y + 62) - 130}

FIT_JS = """
<script>
document.fonts.ready.then(()=>{
  // Nenhum título pode passar da largura (palavra longa ou linha sem quebra).
  document.querySelectorAll('.H').forEach(t=>{
    let guard = 80;
    while (t.scrollWidth > t.clientWidth + 1 && guard--) t.style.fontSize = (parseFloat(getComputedStyle(t).fontSize)*0.96)+'px';
  });
  // Encolhe a fonte de cada bloco até caber na sua faixa (acima ou abaixo da linha).
  document.querySelectorAll('.top').forEach(el=>{
    const max = %(top)d - 170;
    let guard = 60;
    while (el.offsetHeight > max && guard--) el.querySelectorAll('.H,.B').forEach(t=>{
      t.style.fontSize = (parseFloat(getComputedStyle(t).fontSize)*0.95)+'px';
    });
  });
  document.querySelectorAll('.low').forEach(el=>{
    let guard = 60;
    while (el.scrollHeight > el.clientHeight + 1 && guard--) el.querySelectorAll('.H,.B,.ck,.tr').forEach(t=>{
      t.style.fontSize = (parseFloat(getComputedStyle(t).fontSize)*0.95)+'px';
    });
  });
  document.body.dataset.ready = '1';
});
</script>
""" % {"top": LINE_Y - 50}


def md(s):
    """**negrito** e [[laranja]]."""
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"\[\[(.+?)\]\]", r'<span class="r">\1</span>', s)
    return s


def chrome(i):
    if sys.argv[1:2] in (["dark"], ["glass"]):
        return (f'<div class="a chrome mono"><span class="brand"><b>FM</b>Fabricio Moura · Mentoria</span>'
                f'<span>{i:02d} <em>/ 08</em></span></div>')
    return f'<div class="a chrome mono"><span>Fabricio Moura</span><span>{i:02d}/08</span></div>'


def foot(i):
    if sys.argv[1:2] in (["dark"], ["glass"]):
        bars = "".join(f'<i class="{"on" if k <= i else ""}"></i>' for k in range(1, 9))
        go = "Arraste" if i == 1 else ("" if i == 8 else "")
        return f'<div class="a foot mono"><span class="prog">{bars}</span><span class="go">{go}{" →" if i < 8 else ""}</span></div>'
    return '<div class="a foot mono"><span></span><span class="go">{}</span></div>'.format("Arraste →" if i == 1 else "→")


DARK = sys.argv[1:2] in (["dark"], ["glass"])
GLASS = sys.argv[1:2] == ["glass"]
DARK_CSS = """
:root{--paper:#F4EFE8;--ink:#121214;--red:#F2581F;--mute:rgba(244,239,232,.55)}
.s{background:radial-gradient(120% 80% at 100% 100%,rgba(242,88,31,.22),transparent 55%),#121214;color:var(--paper)}
.s.red{background:#F2581F;color:#121214}
.s.dark{background:#F4EFE8;color:#121214}
.s.dark .B,.s.dark .B b{color:#121214}
.s.dark .lab{color:#C8441A}
.H{font-family:Anton,sans-serif;font-weight:400;text-transform:uppercase;letter-spacing:.005em;line-height:1.08}
.chrome{color:rgba(244,239,232,.5)}
.red .chrome,.dark .chrome{color:rgba(18,18,20,.55)}
.B{color:rgba(244,239,232,.86)} .B b{color:#fff}
.red .B,.red .B b{color:#121214}
.r{color:var(--red)} .red .r{color:#fff} .dark .r{color:var(--red)}
.ck{background:rgba(244,239,232,.05);border:1.5px solid rgba(244,239,232,.14);border-radius:22px;padding:22px 26px;font-size:50px}
.ck i{font-family:Manrope,sans-serif;font-weight:800}
.box{background:var(--red);color:#121214;border-radius:24px}
.box .H.r{color:#121214}
.foot .go{color:var(--red)}
.photo{position:absolute;inset:0;background-size:cover;background-position:center 20%}
.photo::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,18,20,.15) 0%,rgba(18,18,20,.35) 35%,#121214 72%)}
.k-cover .top{bottom:auto;top:620px;gap:10px}
.k-cover .low{top:930px;height:300px}

/* ---- premium ---- */
.s::before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;opacity:.07;mix-blend-mode:overlay;
 background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.s>*{z-index:1}
.s{background:radial-gradient(90% 60% at 105% 108%,rgba(242,88,31,.30),transparent 60%),radial-gradient(60% 40% at -10% -10%,rgba(255,255,255,.05),transparent 60%),#111113}
.s.red{background:radial-gradient(80% 70% at 100% 0%,rgba(255,170,120,.35),transparent 60%),linear-gradient(160deg,#F46A2A,#E24A12)}
.s.dark{background:radial-gradient(90% 70% at 100% 100%,rgba(242,88,31,.12),transparent 60%),#F4EFE8}
.s.k-final{background:radial-gradient(100% 70% at 50% 110%,rgba(242,88,31,.45),transparent 62%),#111113}
.chrome{font-size:20px;letter-spacing:.14em;align-items:center}
.chrome .brand{display:flex;align-items:center;gap:14px}
.chrome .brand b{font-family:Anton,sans-serif;font-weight:400;letter-spacing:.02em;font-size:22px;color:#121214;background:var(--red);width:42px;height:42px;border-radius:50%;display:grid;place-items:center}
.red .chrome .brand b{background:#121214;color:#F46A2A}
.chrome em{font-style:normal;opacity:.5}
.foot{align-items:center}
.prog{display:flex;gap:8px}
.prog i{display:block;width:34px;height:4px;border-radius:4px;background:rgba(244,239,232,.18)}
.prog i.on{background:var(--red)}
.red .prog i{background:rgba(18,18,20,.2)} .red .prog i.on{background:#121214}
.dark .prog i{background:rgba(18,18,20,.15)} .dark .prog i.on{background:var(--red)}
.lab{display:flex;align-items:center;gap:14px}
.lab::before{content:"";width:34px;height:3px;background:currentColor;border-radius:3px;opacity:.9}
.s:not(.red):not(.dark) .lab{color:var(--red)!important}
.ck{background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02));border:1.5px solid rgba(255,255,255,.12);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 20px 40px rgba(0,0,0,.25)}
.ck i{width:58px;height:58px;min-width:58px;border-radius:50%;background:var(--red);color:#121214;display:grid;place-items:center;font-size:30px;font-family:Anton,sans-serif}
.box{background:linear-gradient(135deg,#F46A2A,#E04812);box-shadow:0 30px 60px rgba(242,88,31,.35);position:relative;overflow:hidden}
.box::after{content:"";position:absolute;top:-60%;right:-20%;width:60%;height:220%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);transform:rotate(20deg)}
.photo{bottom:auto;height:860px;background-position:center 35%}
.photo::after{background:linear-gradient(180deg,rgba(17,17,19,.05) 0%,rgba(17,17,19,.25) 30%,rgba(17,17,19,.85) 58%,#111113 74%),linear-gradient(90deg,rgba(242,88,31,.18),transparent 45%)}
.k-cover .lab{color:var(--paper)!important;opacity:.75}
"""

GLASS_CSS = """
:root{--red:#FF8A2A;--amber:#FFC15A}
.s,.s.dark,.s.red,.s.k-final{background:radial-gradient(70% 45% at 85% 105%,rgba(255,138,42,.42),transparent 65%),radial-gradient(60% 35% at 0% 100%,rgba(255,120,30,.18),transparent 60%),linear-gradient(180deg,#0d0a08,#140d08);color:#F6EEE6}
.s.red{background:radial-gradient(80% 60% at 50% 55%,rgba(255,138,42,.38),transparent 70%),linear-gradient(180deg,#120c07,#1a0f07)}
.s.dark .B,.s.dark .B b,.red .B,.red .B b{color:rgba(246,238,230,.88)} .s.dark .B b,.red .B b{color:#fff}
.chrome,.red .chrome,.dark .chrome{color:rgba(246,238,230,.5)}
.chrome .brand b,.red .chrome .brand b{background:linear-gradient(135deg,#FFC15A,#FF7A1A);color:#120c07;box-shadow:0 0 24px rgba(255,138,42,.6)}
.r,.red .r,.dark .r{background:linear-gradient(90deg,#FF7A1A,#FFC15A);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 18px rgba(255,138,42,.35))}
.lab,.red .lab,.dark .lab,.s:not(.red):not(.dark) .lab{color:#FFB050!important}
.ck,.box,.glass{background:linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.03));border:1.5px solid rgba(255,170,90,.28);border-radius:26px;
 box-shadow:0 0 0 1px rgba(255,255,255,.03) inset,0 1px 0 rgba(255,255,255,.12) inset,0 18px 50px rgba(0,0,0,.45),0 0 40px rgba(255,138,42,.10);backdrop-filter:blur(14px)}
.ck i{background:linear-gradient(135deg,#FFC15A,#FF7A1A);box-shadow:0 0 22px rgba(255,138,42,.55)}
.box{background:linear-gradient(180deg,rgba(255,150,60,.22),rgba(255,120,30,.08));border-color:rgba(255,180,100,.55)}
.box::after{display:none}
.box .H.r{color:transparent;filter:drop-shadow(0 0 24px rgba(255,138,42,.6))}
.box .lab{color:rgba(246,238,230,.7)!important}
.red .H{filter:drop-shadow(0 0 30px rgba(255,138,42,.35))}
.prog i,.red .prog i,.dark .prog i{background:rgba(246,238,230,.15)} .prog i.on,.red .prog i.on,.dark .prog i.on{background:linear-gradient(90deg,#FF7A1A,#FFC15A);box-shadow:0 0 10px rgba(255,138,42,.7)}
.foot .go{color:#FFB050}
.photo::after{background:linear-gradient(180deg,rgba(13,10,8,.05) 0%,rgba(13,10,8,.25) 35%,rgba(13,10,8,.9) 62%,#0d0a08 76%),radial-gradient(60% 50% at 30% 40%,rgba(255,138,42,.22),transparent 70%)}
.photo{filter:sepia(.25) saturate(1.1)}
.waves{position:absolute;left:0;right:0;bottom:0;height:520px;pointer-events:none;z-index:0}
.k-cover .low{top:940px}
"""
import sys

WAVES = ('<svg class="waves" viewBox="0 0 1080 520" preserveAspectRatio="none"><defs><filter id="gl"><feGaussianBlur stdDeviation="4"/></filter>'
         '<linearGradient id="wg" x1="0" x2="1"><stop offset="0" stop-color="#FF7A1A" stop-opacity="0"/><stop offset=".5" stop-color="#FFB050"/><stop offset="1" stop-color="#FF7A1A" stop-opacity=".2"/></linearGradient></defs>'
         '<g fill="none" stroke="url(#wg)"><path d="M-20 430 C 260 330, 520 520, 1100 300" stroke-width="3" filter="url(#gl)"/><path d="M-20 430 C 260 330, 520 520, 1100 300" stroke-width="1.5"/>'
         '<path d="M-20 470 C 300 390, 600 540, 1100 360" stroke-width="1" opacity=".6"/><path d="M-20 500 C 340 440, 640 560, 1100 420" stroke-width="1" opacity=".35"/></g></svg>')


def slide(i, sl):
    kind = sl["k"]
    cls = {"red": " red", "dark": " dark"}.get(kind, "")
    out = [f'<section class="s{cls} k-{kind}" style="left:{(i-1)*1080}px">']
    if DARK and kind == "cover" and sl.get("photo"):
        out.append(f'<div class="photo" style="background-image:url(../fotos/{sl["photo"]})"></div>')
    if GLASS:
        out.append(WAVES)
    out.append(chrome(i))
    if kind == "cover":
        out.append(f'<div class="a top"><div style="font-size:54px;font-weight:700;letter-spacing:-.02em">{md(sl["kicker"])}</div>'
                   f'<div class="H" style="font-size:{sl.get("bs",250)}px;line-height:1;white-space:nowrap">{md(sl["big"])}</div></div>')
        out.append(f'<div class="a low"><div class="B" style="font-size:72px;line-height:1.1;font-weight:800;letter-spacing:-.035em">{md(sl["sub"])}</div>'
                   f'<div style="flex:1"></div><div class="lab" style="color:var(--mute)">{md(sl["lab"])}</div></div>')
    elif kind == "final":
        out.append(f'<div class="a top"><div class="H" style="font-size:132px">{md(sl["H"])}</div></div>')
        out.append('<div class="a low"><div class="box"><div class="lab" style="font-weight:400;opacity:.6;color:var(--paper)">Quer aplicar isso no seu negócio?</div>'
                   '<div class="H r" style="font-size:112px;line-height:1;margin-top:10px">Comenta MENTORIA</div></div>'
                   f'<div class="B">{md(sl.get("B","E manda pra um colega que precisa ver isso. **Todo dia tem post novo aqui.**"))}</div></div>')
    else:
        top = []
        if sl.get("lab"):
            top.append(f'<div class="lab" style="{"color:var(--mute)" if kind=="stmt" else ""}">{md(sl["lab"])}</div>')
        top.append(f'<div class="H" style="font-size:{sl.get("hs",132)}px{NW if sl.get("nw") else ""}">{md(sl["H"])}</div>')
        out.append('<div class="a top">' + "".join(top) + "</div>")
        low = []
        if sl.get("big"):
            low.append(f'<div class="H" style="font-size:{sl.get("bigs",120)}px;line-height:1.02">{md(sl["big"])}</div>')
        for n, it in enumerate(sl.get("items", []), 1):
            low.append(f'<div class="ck"><i>{n}</i><span>{md(it)}</span></div>')
        if sl.get("rows"):
            low.append("<div>" + "".join(f'<div class="tr"><span class="x">{md(a)}</span><span class="ok">{md(b)}</span></div>' for a, b in sl["rows"]) + "</div>")
        if sl.get("B"):
            low.append(f'<div class="B">{md(sl["B"])}</div>')
        out.append('<div class="a low">' + "".join(low) + "</div>")
    out.append(foot(i))
    out.append("</section>")
    return "\n".join(out)


def thread(red_idx):
    # Linha contínua na altura LINE_Y; no último slide desce em seta até o "Salva esse post".
    y = LINE_Y
    x_end = 7 * 1080 + 860
    pts = f"40,{y} {x_end},{y} {x_end},{y+40}"
    rx = (red_idx - 1) * 1080
    return f"""<svg id="thread" width="8640" height="1350" viewBox="0 0 8640 1350">
  <defs><clipPath id="cr"><rect x="{rx}" y="0" width="1080" height="1350"/></clipPath></defs>
  <g fill="none" stroke-width="22" stroke-linejoin="miter" stroke-linecap="butt">
    <polyline points="{pts}" stroke="#FF4A1C"/>
    <polyline points="{pts}" stroke="#111111" clip-path="url(#cr)"/>
  </g>
  <path d="M{x_end-35},{y+38} L{x_end+35},{y+38} L{x_end},{y+80} Z" fill="#FF4A1C"/>
</svg>"""


def build(slug, slides):
    assert len(slides) == 8, slug
    red_idx = next(i for i, s in enumerate(slides, 1) if s["k"] == "red")
    body = "\n".join(slide(i, s) for i, s in enumerate(slides, 1))
    doc = f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>{CSS}{DARK_CSS if DARK else ""}{GLASS_CSS if GLASS else ""}</style></head>
<body><div id="pano">
{body}
{"" if DARK else thread(red_idx)}
</div>{FIT_JS}</body></html>"""
    d = os.path.join(HERE, slug + ("-glass" if GLASS else "-dark" if DARK else ""))
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "index.html"), "w").write(doc)


from posts import POSTS  # noqa: E402

ONLY = sys.argv[2:]
for slug, p in POSTS.items():
    if ONLY and slug not in ONLY:
        continue
    build(slug, p["slides"])
    print("ok", slug)
