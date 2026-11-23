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
    return f'<div class="a chrome mono"><span>Fabricio Moura</span><span>{i:02d}/08</span></div>'


def foot(i):
    return '<div class="a foot mono"><span></span><span class="go">{}</span></div>'.format("Arraste →" if i == 1 else "→")


DARK = sys.argv[1:2] == ["dark"]
DARK_CSS = """
:root{--paper:#F4EFE8;--ink:#121214;--red:#F2581F;--mute:rgba(244,239,232,.55)}
.s{background:radial-gradient(120% 80% at 100% 100%,rgba(242,88,31,.22),transparent 55%),#121214;color:var(--paper)}
.s.red{background:#F2581F;color:#121214}
.s.dark{background:#F4EFE8;color:#121214}
.s.dark .B,.s.dark .B b{color:#121214}
.s.dark .lab{color:#C8441A}
.H{font-family:Manrope,sans-serif;font-weight:800;text-transform:none;letter-spacing:-.035em;line-height:1.04}
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
"""
import sys


def slide(i, sl):
    kind = sl["k"]
    cls = {"red": " red", "dark": " dark"}.get(kind, "")
    out = [f'<section class="s{cls} k-{kind}" style="left:{(i-1)*1080}px">']
    if DARK and kind == "cover" and sl.get("photo"):
        out.append(f'<div class="photo" style="background-image:url(../fotos/{sl["photo"]})"></div>')
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
<style>{CSS}{DARK_CSS if DARK else ""}</style></head>
<body><div id="pano">
{body}
{"" if DARK else thread(red_idx)}
</div>{FIT_JS}</body></html>"""
    d = os.path.join(HERE, slug + ("-dark" if DARK else ""))
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "index.html"), "w").write(doc)


from posts import POSTS  # noqa: E402

ONLY = sys.argv[2:]
for slug, p in POSTS.items():
    if ONLY and slug not in ONLY:
        continue
    build(slug, p["slides"])
    print("ok", slug)
