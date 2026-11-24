import cv2, numpy as np, sys
src, out, dbg = sys.argv[1:4]
im = cv2.imread(src)
# regioes (x1,y1,x2,y2) no original 600x752: numero + texto de cada placa
R = [(62,200,178,298), (225,295,330,382), (340,320,412,392), (95,405,182,462)]
d = im.copy()
for x1,y1,x2,y2 in R: cv2.rectangle(d,(x1,y1),(x2,y2),(0,255,0),2)
cv2.ellipse(d,(357,128),(50,64),0,0,360,(0,0,255),2)
cv2.imwrite(dbg, d)
res = im.copy()
for x1,y1,x2,y2 in R:
    roi = res[y1:y2, x1:x2]
    b = cv2.GaussianBlur(roi, (0,0), 9)
    b = cv2.GaussianBlur(b, (0,0), 6)
    m = np.zeros(roi.shape[:2], np.float32); cv2.rectangle(m,(4,4),(roi.shape[1]-5,roi.shape[0]-5),1,-1)
    m = cv2.GaussianBlur(m,(0,0),3)[...,None]
    res[y1:y2, x1:x2] = (b*m + roi*(1-m)).astype(np.uint8)
# pele: suaviza preservando bordas
sm = res.copy()
for _ in range(3): sm = cv2.bilateralFilter(sm, 7, 30, 5)
m = np.zeros(res.shape[:2], np.float32); cv2.ellipse(m,(357,128),(50,64),0,0,360,1,-1)
m = cv2.GaussianBlur(m,(0,0),8)*0.72
m2 = np.zeros_like(m)
for c in ((340,142),(378,142)): cv2.ellipse(m2,c,(14,9),0,0,360,1,-1)
m = np.maximum(m, cv2.GaussianBlur(m2,(0,0),4)*0.9)[...,None]
noise = np.random.default_rng(1).normal(0,2.2,res.shape)
res = np.clip(sm*m + res*(1-m) + noise*m, 0, 255).astype(np.uint8)
# pes de galinha: blur suave localizado
g = cv2.GaussianBlur(res,(0,0),2.6)
m3 = np.zeros(res.shape[:2], np.float32)
for c in ((319,121),(397,119)): cv2.ellipse(m3,c,(9,12),0,0,360,1,-1)
m3 = (cv2.GaussianBlur(m3,(0,0),3)*0.9)[...,None]
res = np.clip(g*m3 + res*(1-m3) + noise*m3*0.8, 0, 255).astype(np.uint8)
res = cv2.resize(res, None, fx=2, fy=2, interpolation=cv2.INTER_LANCZOS4)
cv2.imwrite(out, res, [cv2.IMWRITE_JPEG_QUALITY, 92])
