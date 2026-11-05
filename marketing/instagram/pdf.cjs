const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const dir = path.resolve(process.argv[2] || '.');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + dir + '/index.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => {
    const pano = document.getElementById('pano');
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 8; i++) {
      const page = document.createElement('div');
      page.style.cssText = 'position:relative;width:1080px;height:1350px;overflow:hidden;break-after:page';
      const c = pano.cloneNode(true); c.removeAttribute('id');
      c.style.left = (-i * 1080) + 'px'; c.style.position = 'absolute'; c.style.top = '0';
      c.querySelectorAll('section.s').forEach((s, j) => { if (j !== i) s.remove(); });
      page.appendChild(c); frag.appendChild(page);
    }
    document.body.innerHTML = ''; document.body.appendChild(frag);
    const st = document.createElement('style'); st.textContent = '@page{size:1080px 1350px;margin:0} body{background:#EDEAE3}';
    document.head.appendChild(st);
  });
  await p.waitForTimeout(300);
  await p.pdf({ path: dir + '/carrossel.pdf', width: '1080px', height: '1350px', printBackground: true, margin: {top:0,right:0,bottom:0,left:0} });
  await b.close();
})();
