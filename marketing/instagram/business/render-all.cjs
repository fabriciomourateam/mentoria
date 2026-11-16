const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 8640, height: 1350 } });
  for (const d of fs.readdirSync(__dirname).filter(x => /^c\d\d-/.test(x)).sort()) {
    const dir = path.join(__dirname, d);
    await p.goto('file://' + dir + '/index.html', { waitUntil: 'networkidle' });
    await p.waitForFunction(() => document.body.dataset.ready === '1');
    await p.waitForTimeout(200);
    for (let i = 0; i < 8; i++) await p.screenshot({ path: `${dir}/slide-0${i+1}.png`, clip: { x: i*1080, y: 0, width: 1080, height: 1350 } });
    await p.screenshot({ path: `${dir}/pano.png`, scale: 'css', clip: { x: 0, y: 0, width: 8640, height: 1350 } });
    console.log('rendered', d);
  }
  await b.close();
})();
