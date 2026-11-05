# Carrosséis do @fabriciomoura.mentor: como são feitos

Molde aprovado pelo Fabricio em 05/11/2026 ("ficou sensacional"). Primeiro carrossel:
`carrossel-01-programa/` ("Você não precisa de mais paciente"). Use este guia para
os próximos e mantenha a mesma linguagem.

## A ideia central
Fugir do "premium feito por IA" (fundo preto, dourado, serifa itálica, linhas finas,
rótulos espaçados com tracinho). Aqui o visual é de **revista editorial / esporte**:
papel claro, tipografia pesada, uma cor só, e **uma linha que atravessa os 8 slides**
sem interrupção, contando a história enquanto a pessoa arrasta.

## Sistema visual
- **Cores:** papel `#EDEAE3`, tinta `#111111`, laranja sinal `#FF4A1C`. Nada além disso.
- **Fontes (todas existem no Canva):**
  - Títulos: **Anton**, caixa alta, entrelinha 1.04 (menos que isso o acento encosta
    na linha de cima: TÉCNICO, É, JÁ).
  - Texto: **Inter** 500/800, 38 a 62px.
  - Rótulos e dados: **Space Mono**, caixa alta, 22px.
- **Destaque:** a palavra-chave do título em laranja. Um destaque por slide.
- **Tamanho:** 1080x1350 (4:5), margem lateral 80px.
- **Ritmo de fundo:** slides claros, um slide **todo laranja** (o número/conta) e um
  slide **preto** (a prova), voltando ao claro na chamada final.
- **Cabeçalho:** "FABRICIO MOURA" à esquerda e "01/08" à direita, Space Mono, 55% de opacidade.
- **Rodapé:** só "ARRASTE →" na capa (laranja) e uma setinha nos demais. Sem @ e sem
  assinatura (o Fabricio pediu para tirar).

## A linha (o recurso que faz o carrossel)
Um único traço de 22px, laranja (preto por cima no slide laranja), desenhado num SVG
de 8640x1350 (8 slides lado a lado). Cada trecho ilustra o slide:
1. Capa: risca a palavra **PACIENTE**.
2. Zigue-zague irregular = o ciclo (atende, o aluno some, do zero), com rótulos.
3. Tracejada ("consulta solta") virando sólida ("programa").
4. Linha reta de base sob a lista.
5. Escada subindo mês a mês (previsibilidade), com Jan a Jun.
6. Vira a "linha de soma" da conta (50 alunos × R$ 400 / R$ 20 MIL).
7. Subida forte entre o "20" e o "200+".
8. Corre no topo e desce em seta apontando para o "Comenta MENTORIA".
Regra: texto nunca encosta na linha; a linha entra num slide na mesma altura em que saiu do anterior.

## Como gerar
1. Edite `carrossel-XX/index.html` (todo o carrossel é um painel `#pano` de 8640px;
   cada `<section class="s">` é um slide em `left: i*1080px`; a linha é o `<polyline>`).
2. Imagens: `node marketing/instagram/render.cjs marketing/instagram/carrossel-XX`
   (gera `slide-01..08.png` e `pano.png`; precisa do Playwright com Chromium).
3. PDF para o Canva: `node marketing/instagram/pdf.cjs marketing/instagram/carrossel-XX`.
   No Canva: Criar > Importar arquivo > PDF vira design editável. A importação às vezes
   cola palavras em textos pequenos: confira e corrija (o conector do Canva consegue
   editar o texto direto no design).
4. Sempre olhe cada PNG antes de entregar: texto estourando a borda, acento encostando,
   linha passando por cima de texto.

## Copy
- Sem travessão. Nome "Fabricio" sem acento.
- Dinheiro como possibilidade ou exemplo ("Exemplo ilustrativo"), nunca promessa.
- Números do Fabricio que podem ser usados: +R$ 3 milhões faturados com consultoria
  online, R$ 20 mil no primeiro mês com processo, de 20/30 para mais de 200 alunos em
  um ano, ex-servidor público (R$ 5 mil/mês).
- Chamada final padrão: "Comenta MENTORIA" + avaliação gratuita no direct.
