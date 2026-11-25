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
    if sys.argv[1:2] in (["dark"], ["glass"], ["flow"], ["glassflow"]):
        return (f'<div class="a chrome mono"><span class="brand"><b>FM</b>Fabricio Moura · Mentoria</span>'
                f'<span>{i:02d} <em>/ 08</em></span></div>')
    return f'<div class="a chrome mono"><span>Fabricio Moura</span><span>{i:02d}/08</span></div>'


def foot(i):
    if sys.argv[1:2] in (["dark"], ["glass"], ["flow"], ["glassflow"]):
        bars = "".join(f'<i class="{"on" if k <= i else ""}"></i>' for k in range(1, 9))
        go = "Arraste" if i == 1 else ("" if i == 8 else "")
        return f'<div class="a foot mono"><span class="prog">{bars}</span><span class="go">{go}{" →" if i < 8 else ""}</span></div>'
    return '<div class="a foot mono"><span></span><span class="go">{}</span></div>'.format("Arraste →" if i == 1 else "→")


DARK = sys.argv[1:2] in (["dark"], ["glass"], ["flow"], ["glassflow"])
FLOW = sys.argv[1:2] in (["flow"], ["glassflow"])
GLASS = sys.argv[1:2] in (["glass"], ["glassflow"])
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


FLOW_CSS = """
#pano{background:
 radial-gradient(900px 700px at 300px 1300px,rgba(242,88,31,.30),transparent 70%),
 radial-gradient(1100px 800px at 2700px 1350px,rgba(242,88,31,.22),transparent 70%),
 radial-gradient(1000px 700px at 5100px 1400px,rgba(242,88,31,.30),transparent 70%),
 radial-gradient(1200px 900px at 8200px 1300px,rgba(242,88,31,.45),transparent 70%),
 #111113}
.s,.s.k-final{background:transparent}
.s.k-cover .photo{display:none}
.s:not(.k-cover) .low{height:390px}
.low:has(> .ck:nth-of-type(4)){gap:14px}
.low:has(> .ck:nth-of-type(4)) .ck{padding:10px 20px;font-size:40px}
.ck{padding:16px 22px;font-size:44px}
.k-final .low .B{font-size:38px}
.k-final .box .H{white-space:nowrap;font-size:100px}
.k-cover .low .B{font-size:60px!important}
.k-cover .lab{display:none}
.flowph{position:absolute;left:0;top:0;width:1400px;height:900px;background-size:cover;background-position:30% 35%;z-index:0;
 -webkit-mask-image:linear-gradient(90deg,#000 68%,transparent 100%),linear-gradient(180deg,#000 45%,transparent 92%);-webkit-mask-composite:source-in;
 mask-image:linear-gradient(90deg,#000 68%,transparent 100%),linear-gradient(180deg,#000 45%,transparent 92%);mask-composite:intersect;opacity:.95}
.flowph::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(242,88,31,.16),transparent 40%),linear-gradient(180deg,transparent 40%,rgba(17,17,19,.6))}
.s.k-stmt:nth-of-type(2) .H,.s.k-stmt:nth-of-type(2) .B{text-shadow:0 2px 24px rgba(0,0,0,.6)}
svg#flow{position:absolute;left:0;top:0;pointer-events:none;z-index:4}
.s{z-index:2}
"""

GF_CSS = """
#pano{background:
 radial-gradient(900px 650px at 250px 1350px,rgba(255,138,42,.07),transparent 70%),
 linear-gradient(90deg,#050505 0px,#070707 1080px,transparent 1500px),
 radial-gradient(1000px 700px at 2400px 1400px,rgba(255,120,30,.22),transparent 70%),
 radial-gradient(1100px 900px at 3780px 700px,rgba(255,138,42,.30),transparent 70%),
 radial-gradient(1000px 700px at 5600px 1400px,rgba(255,120,30,.24),transparent 70%),
 radial-gradient(1300px 900px at 8300px 1250px,rgba(255,150,50,.50),transparent 70%),
 linear-gradient(180deg,#0b0a09,#120d09)}
.s,.s.red,.s.dark,.s.k-final{background:transparent!important}
.r,.H .r{text-shadow:none!important}
.cblock{position:absolute;top:0;height:1350px;z-index:1;
 box-shadow:inset 2px 0 0 rgba(255,236,210,.55),inset -2px 0 0 rgba(255,236,210,.55),inset 60px 0 80px -60px rgba(60,20,0,.28),inset -60px 0 80px -60px rgba(60,20,0,.28)!important}
.cseam{position:absolute;top:0;height:1350px;width:150px;z-index:1;pointer-events:none}
.cseam.orange.l{background:linear-gradient(270deg,rgba(255,138,42,.30),rgba(255,138,42,.08) 45%,transparent)}
.cseam.orange.r{background:linear-gradient(90deg,rgba(255,138,42,.30),rgba(255,138,42,.08) 45%,transparent)}
.cseam.cream.l{background:linear-gradient(270deg,rgba(255,226,196,.16),rgba(255,226,196,.04) 45%,transparent)}
.cseam.cream.r{background:linear-gradient(90deg,rgba(255,226,196,.16),rgba(255,226,196,.04) 45%,transparent)}
.cseam::after{content:"";position:absolute;top:8%;bottom:8%;width:2px;background:linear-gradient(180deg,transparent,rgba(255,200,140,.75) 30%,rgba(255,200,140,.75) 70%,transparent)}
.cseam.l::after{right:0} .cseam.r::after{left:0}
.cblock.orange{background:radial-gradient(70% 50% at 80% 10%,rgba(255,220,160,.45),transparent 60%),linear-gradient(165deg,#FFA049 0%,#F46A1E 45%,#D9480F 100%);
 box-shadow:0 0 120px rgba(255,138,42,.45)}
.cblock.cream{background:radial-gradient(80% 60% at 100% 100%,rgba(255,170,90,.28),transparent 60%),linear-gradient(170deg,#FBF6EF,#EFE6DA)}
.red .H,.red .B,.red .B b,.red .lab{color:#140c06!important}
.red .r{background:none;-webkit-text-fill-color:#fff;color:#fff;filter:none}
.red .chrome,.dark .chrome{color:rgba(20,12,6,.6)}
.red .prog i,.dark .prog i{background:rgba(20,12,6,.18)} .red .prog i.on{background:#140c06;box-shadow:none}
.dark .H,.dark .B,.dark .B b{color:#17110c!important}
.dark .r{background:linear-gradient(90deg,#E5520F,#F28A2A);-webkit-background-clip:text;background-clip:text;color:transparent;filter:none}
.dark .lab{color:#D9530F!important}
.red .lab::before,.dark .lab::before{background:currentColor}
.flowph::after{background:linear-gradient(180deg,rgba(0,0,0,.20) 0%,rgba(0,0,0,.32) 35%,rgba(0,0,0,.86) 78%),rgba(0,0,0,.04)}
.k-cover .H,.k-cover .B,.k-cover .a.top div{text-shadow:0 4px 30px rgba(0,0,0,.65)}
.flowph{filter:brightness(1.07) saturate(.95) contrast(1.04)}
"""


FLOWTXT = {
    # main, pre (antes da virada), post (depois), end (seta), ticks (sobre os 4 pontos)
    "c03-agenda-cheia": ("FATURAMENTO", "AGENDA LOTADA", "MENOS GENTE, MAIS MARGEM", "SUA CONSULTORIA", None),
    "c05-semana-1": ("CONFIANÇA DO ALUNO", "DIAS SEM NOTÍCIA", "CONTATO · META · VITÓRIA", "RENOVAÇÃO", ("24H", "DIA 3", "DIA 5", "DIA 7")),
    "c06-renovacao": ("TAXA DE RENOVAÇÃO", "PEDIDO NO ÚLTIMO DIA", "FASE 1 · FASE 2 · FASE 3", "ALUNO QUE FICA", ("MÊS 1", "MÊS 3", "MÊS 6", "MÊS 9")),
    "c08-bastidor-placas": ("CRESCIMENTO", "AGENDA NO LIMITE", "ESTRUTURA · PROCESSO · TIME", "AS PLACAS", ("ENTRADA", "ENTREGA", "RENOVAÇÃO", "NÚMEROS")),
    "c07-4-numeros": ("SEUS NÚMEROS", "SÓ O PLACAR", "CONTATOS · CONVERSÃO · VENDAS · CAIXA", "DONO DO NEGÓCIO", ("SEM 1", "SEM 2", "SEM 3", "SEM 4")),
}


def flow_overlay(slides, slug=""):
    W = 1080
    t_main, t_pre, t_post, t_end, ticks = FLOWTXT.get(slug, FLOWTXT["c03-agenda-cheia"])
    red = next(i for i, s in enumerate(slides) if s["k"] == "red")      # 0-based
    cream = [i for i, s in enumerate(slides) if s["k"] == "dark"]
    base, flat = 1250, 1196
    parts = []
    # barras: agenda lotando antes da virada (mais e mais altas); depois, menos e espaçadas
    x = 80
    while x < red * W - 40:
        h = 24 + (x / (red * W)) ** 1.4 * 150
        parts.append(f'<rect x="{x:.0f}" y="{base-h:.0f}" width="26" height="{h:.0f}" rx="6" fill="rgba(244,239,232,.14)"/>')
        x += 46
    x = (red + 1) * W + 90
    k = 0
    while x < 7 * W + 600:
        h = 40 + 16 * (k % 3)
        sl = int(x // W)
        col = "rgba(18,18,20,.16)" if sl in cream else "rgba(244,239,232,.14)"
        parts.append(f'<rect x="{x:.0f}" y="{base-h:.0f}" width="40" height="{h:.0f}" rx="8" fill="{col}"/>')
        x += 190; k += 1
    # linha do faturamento: parada até a virada, sobe no slide laranja e segue subindo até o CTA
    x0, xr = 80, red * W
    pts = [(x0, flat), (xr + 60, flat), (xr + W - 60, 1110), ((red + 1) * W + 400, 1098), (5 * W + 500, 1084), (6 * W + 520, 1074), (7 * W + 60, 1080), (7 * W + 900, 1072)]
    d = "M" + " L".join(f"{a:.0f},{b:.0f}" for a, b in pts)
    rx = red * W
    clip = f'<clipPath id="cr"><rect x="{rx}" y="0" width="{W}" height="1350"/></clipPath><clipPath id="notcr"><rect x="0" y="0" width="{rx}" height="1350"/><rect x="{rx+W}" y="0" width="{8*W}" height="1350"/></clipPath>'
    glow = '<filter id="gw" x="-5%" y="-50%" width="110%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>'
    line = (f'<g clip-path="url(#notcr)"><path d="{d}" stroke="#F2581F" stroke-width="26" fill="none" opacity=".55" filter="url(#gw)"/>'
            f'<path d="{d}" stroke="#F2581F" stroke-width="12" fill="none" stroke-linejoin="round" stroke-linecap="round"/></g>'
            f'<g clip-path="url(#cr)"><path d="{d}" stroke="#121214" stroke-width="12" fill="none" stroke-linejoin="round"/></g>')
    ex, ey = pts[-1]
    arrow = f'<path d="M{ex-6},{ey-28} L{ex+40},{ey} L{ex-6},{ey+28} Z" fill="#F2581F" transform="rotate(-2 {ex} {ey})"/><text x="{ex-330}" y="{ey-30}" fill="#F2581F" font-family="Space Mono" font-size="20" letter-spacing="3" font-weight="700">{t_end}</text>'
    labels = (f'<text x="{W+80}" y="{flat-26}" fill="#F2581F" font-family="Space Mono" font-size="20" letter-spacing="3" font-weight="700">{t_main}</text>'
              f'<text x="{W+80}" y="{base+0}" dy="-0" fill="rgba(244,239,232,.45)" font-family="Space Mono" font-size="20" letter-spacing="3"></text>'
              f'<text x="{red*W-100}" y="{base-185}" text-anchor="end" fill="rgba(244,239,232,.5)" font-family="Space Mono" font-size="20" letter-spacing="3">{t_pre}</text>'
              f'<text x="{(red+1)*W+90}" y="{base-90}" fill="rgba(244,239,232,.5)" font-family="Space Mono" font-size="20" letter-spacing="3">{t_post}</text>')
    dots = "".join(f'<circle cx="{a}" cy="{b}" r="9" fill="#fff" stroke="#F2581F" stroke-width="5"/>' for a, b in pts[2:-1])
    if ticks:
        cols = {red: "#140c06"} | {c: "#C2470C" for c in cream}
        labels += "".join(f'<text x="{a}" y="{b-30}" text-anchor="middle" fill="{cols.get(int(a//W), "#F2581F")}" font-family="Space Mono" font-size="20" letter-spacing="2" font-weight="700">{t}</text>'
                          for (a, b), t in zip(pts[2:-1], ticks))
    if GLASS:
        parts = [p.replace('fill="rgba(244,239,232,.14)"', 'fill="rgba(255,170,90,.10)" stroke="rgba(255,180,100,.35)" stroke-width="1.5"')
                  .replace('fill="rgba(18,18,20,.16)"', 'fill="rgba(217,72,15,.10)" stroke="rgba(217,72,15,.35)" stroke-width="1.5"') for p in parts]
        grad = f'<linearGradient id="lg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="{8*W}" y2="0"><stop offset="0" stop-color="#FF7A1A"/><stop offset=".5" stop-color="#FFB050"/><stop offset="1" stop-color="#FFD27A"/></linearGradient>'
        glow2 = '<filter id="gw2" x="-5%" y="-80%" width="110%" height="260%"><feGaussianBlur stdDeviation="14"/></filter>'
        streaks = (f'<g fill="none" stroke="url(#lg)" opacity=".55">'
                   f'<path d="M-20 1180 C 1500 1020, 2800 1330, 4300 1150 S 7200 1000, 8660 1120" stroke-width="2" filter="url(#gl2)"/>'
                   f'<path d="M-20 1180 C 1500 1020, 2800 1330, 4300 1150 S 7200 1000, 8660 1120" stroke-width="1.2"/>'
                   f'<path d="M-20 1260 C 1700 1150, 3200 1350, 4700 1240 S 7400 1130, 8660 1220" stroke-width="1" opacity=".6"/>'
                   f'<path d="M-20 1310 C 1900 1250, 3500 1360, 5000 1300 S 7600 1230, 8660 1290" stroke-width="1" opacity=".35"/></g>')
        line = (f'<g clip-path="url(#notcr)"><path d="{d}" stroke="url(#lg)" stroke-width="34" fill="none" opacity=".55" filter="url(#gw2)"/>'
                f'<path d="{d}" stroke="url(#lg)" stroke-width="10" fill="none" stroke-linejoin="round" stroke-linecap="round"/></g>'
                f'<g clip-path="url(#cr)"><path d="{d}" stroke="#140c06" stroke-width="10" fill="none" stroke-linejoin="round"/></g>')
        dots = "".join(f'<circle cx="{a}" cy="{b}" r="10" fill="#FFD27A" stroke="#FF8A2A" stroke-width="4" filter="drop-shadow(0 0 10px #FF8A2A)"/>' for a, b in pts[2:-1])
        arrow = arrow.replace('fill="#F2581F"', 'fill="#FFC15A"')
        labels = labels.replace('fill="#F2581F"', 'fill="#FFB050"').replace('fill="rgba(244,239,232,.5)"', 'fill="rgba(255,200,140,.6)"')
        defs = f'{clip}{grad}{glow2}<filter id="gl2"><feGaussianBlur stdDeviation="5"/></filter>'
        return f'<svg id="flow" width="{8*W}" height="1350" viewBox="0 0 {8*W} 1350"><defs>{defs}</defs>{streaks}{"".join(parts)}{line}{dots}{arrow}{labels}</svg>'
    return f'<svg id="flow" width="{8*W}" height="1350" viewBox="0 0 {8*W} 1350"><defs>{clip}{glow}</defs>{"".join(parts)}{line}{dots}{arrow}{labels}</svg>'


def slide(i, sl):
    kind = sl["k"]
    cls = {"red": " red", "dark": " dark"}.get(kind, "")
    out = [f'<section class="s{cls} k-{kind}" style="left:{(i-1)*1080}px">']
    if DARK and kind == "cover" and sl.get("photo"):
        out.append(f'<div class="photo" style="background-image:url(../fotos/{sl["photo"]})"></div>')
    if GLASS and not FLOW:
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


def cblocks(slides):
    W, b = 1080, 70
    out = []
    for i, s in enumerate(slides):
        if s["k"] in ("red", "dark"):
            cls = "orange" if s["k"] == "red" else "cream"
            # paralelogramo: invade o slide anterior embaixo e o seguinte em cima
            out.append(f'<div class="cblock {cls}" style="left:{i*W}px;width:{W}px"></div>')
            if i > 0:
                out.append(f'<div class="cseam {cls} l" style="left:{i*W-150}px"></div>')
            if i < len(slides) - 1:
                out.append(f'<div class="cseam {cls} r" style="left:{(i+1)*W}px"></div>')
    return "".join(out)


def flowph(slides):
    ph = slides[0].get("photo")
    extra = slides[0].get("phstyle", "")
    return f'<div class="flowph" style="background-image:url(../fotos/{ph});{extra}"></div>' if ph else ""


def build(slug, slides):
    assert len(slides) == 8, slug
    red_idx = next(i for i, s in enumerate(slides, 1) if s["k"] == "red")
    body = "\n".join(slide(i, s) for i, s in enumerate(slides, 1))
    doc = f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>{CSS}{DARK_CSS if DARK else ""}{GLASS_CSS if GLASS else ""}{FLOW_CSS if FLOW else ""}{GF_CSS if GLASS and FLOW else ""}</style></head>
<body><div id="pano">
{flowph(slides) if FLOW else ""}
{cblocks(slides) if GLASS and FLOW else ""}
{body}
{flow_overlay(slides, slug) if FLOW else ""}
{"" if DARK else thread(red_idx)}
</div>{FIT_JS}</body></html>"""
    d = os.path.join(HERE, slug + ("-glassflow" if GLASS and FLOW else "-flow" if FLOW else "-glass" if GLASS else "-dark" if DARK else ""))
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "index.html"), "w").write(doc)


from posts import POSTS  # noqa: E402

ONLY = sys.argv[2:]
for slug, p in POSTS.items():
    if ONLY and slug not in ONLY:
        continue
    build(slug, p["slides"])
    print("ok", slug)
