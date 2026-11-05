const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const dir = path.resolve(process.argv[2] || ".");
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 8640, height: 1350 } });
  await p.goto('file://' + dir + '/index.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  for (let i = 0; i < 8; i++) await p.screenshot({ path: `${dir}/slide-0${i+1}.png`, clip: { x: i*1080, y: 0, width: 1080, height: 1350 } });
  await p.screenshot({ path: `${dir}/pano.png`, clip: { x: 0, y: 0, width: 8640, height: 1350 } });
  await b.close();
})();
