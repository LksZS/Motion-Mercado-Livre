// Cena "Entregue": a caixa amarela do ML na porta (fundo renderizado no Blender, caixa-ml-blender.py), como a caixa da ref da Amazon.
// O risco de luz dá a volta na caixa (passa por trás dela), sobe para a frente e desenha o símbolo, que fica impresso em azul.
// Tudo em px da imagem do Blender (2304×1296); a câmera é um empurrão lento em volta da caixa.
import React from "react";
import {Easing, Img, interpolate, staticFile} from "remotion";
import P from "./caixaPontos.json";
import {SIMBOLO} from "./mlData";
import {FONTE, SimboloML} from "./Telas";

const cl = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const eo = Easing.bezier(0.16, 1, 0.3, 1);
const io = Easing.bezier(0.65, 0, 0.35, 1);
const volta = Easing.bezier(0.34, 1.45, 0.64, 1);
const pT = (t: number, a: number, d: number, e = eo) => interpolate(t, [a, a + d], [0, 1], {...cl, easing: e});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

type Pt = {x: number; y: number};
const IW = P.W, IH = P.H;
const S0 = 1920 / IW;
const CENTRO: Pt = {x: P.centro[0], y: P.centro[1]};

// contorno da caixa na imagem (casco dos 8 cantos) — esconde o risco quando ele passa por trás
const casco = (() => {
  const pts = P.cantos.map((c) => ({x: c[0], y: c[1]})).sort((a, b) => a.x - b.x || a.y - b.y);
  const cr = (o: Pt, a: Pt, b: Pt) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lo: Pt[] = [], hi: Pt[] = [];
  for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of [...pts].reverse()) { while (hi.length >= 2 && cr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
  return [...lo.slice(0, -1), ...hi.slice(0, -1)];
})();
const CASCO_D = casco.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ") + "Z";

// anel em volta da caixa, reordenado para terminar na frente (ponto 36 = frente)
const ANEL = [...P.anel.slice(37, 96), ...P.anel.slice(0, 37)].map((a) => ({x: a[0], y: a[1], tras: a[3] > 0.05}));

// retângulo 890×640 (símbolo, viewBox 20 -4 89 64 ×10) → quadrilátero da frente da caixa (matrix3d)
const matrizFrente = (() => {
  const [p0, p1, p2, p3] = P.simbolo.map((c) => ({x: c[0], y: c[1]}));
  const dx1 = p1.x - p2.x, dx2 = p3.x - p2.x, dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy1 = p1.y - p2.y, dy2 = p3.y - p2.y, dy3 = p0.y - p1.y + p2.y - p3.y;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den, h = (dx1 * dy3 - dx3 * dy1) / den;
  const a = p1.x - p0.x + g * p1.x, b = p3.x - p0.x + h * p3.x, c = p0.x;
  const d = p1.y - p0.y + g * p1.y, e = p3.y - p0.y + h * p3.y, f = p0.y;
  const w = 890, hh = 640;
  return `matrix3d(${a / w},${d / w},0,${g / w},${b / hh},${e / hh},0,${h / hh},0,0,1,0,${c},${f},0,1)`;
})();
const QUAD_C: Pt = {x: P.simbolo.reduce((s, c) => s + c[0], 0) / 4, y: P.simbolo.reduce((s, c) => s + c[1], 0) / 4};
const QUAD_W = (P.simbolo[1][0] - P.simbolo[0][0] + P.simbolo[2][0] - P.simbolo[3][0]) / 2;

// oval do símbolo (mesma do risco da cena 1), começando embaixo à esquerda — é por onde o risco chega da frente
const EL = {cx: 64.42, cy: 28.0, rx: 40.9, ry: 28.3};
const OVAL_D = Array.from({length: 121}).map((_, i) => {
  const a = Math.PI * 0.62 + (i / 120) * Math.PI * 2;
  return `${i ? "L" : "M"}${(EL.cx + EL.rx * Math.cos(a)).toFixed(3)} ${(EL.cy + EL.ry * Math.sin(a)).toFixed(3)}`;
}).join(" ");

const LUZ = "#FFC400";

// câmera: tela = Q + (p − CENTRO)·S, a caixa fica parada e o mundo cresce em volta dela
export const camCaixa = (t: number, t0: number, tFim: number) => {
  const entra = pT(t, t0, 0.6, io);
  const z = lerp(1.22, 1, pT(t, t0, 0.9)) * (1 + 0.07 * interpolate(t, [t0, tFim], [0, 1], cl));
  return {S: S0 * z, Q: {x: CENTRO.x * S0, y: CENTRO.y * S0 - 20}};
};
export const caixaNaTela = (t: number, t0: number, tFim: number, p: Pt = QUAD_C) => {
  const c = camCaixa(t, t0, tFim);
  return {x: c.Q.x + (p.x - CENTRO.x) * c.S, y: c.Q.y + (p.y - CENTRO.y) * c.S, w: QUAD_W * c.S};
};

export const Caixa: React.FC<{t: number; t0: number; orb0: number; orb1: number; risca1: number; tFim: number}> = ({t, t0, orb0, orb1, risca1, tFim}) => {
  const cam = camCaixa(t, t0, tFim);
  const entra = pT(t, t0, 0.6, io);
  const sai = pT(t, tFim, 0.7, io);

  // risco em volta: cabeça anda pelo anel; cauda ~30% do anel
  const kOrb = interpolate(t, [orb0, orb1], [0, 1], {...cl, easing: Easing.bezier(0.45, 0, 0.55, 1)});
  const n = ANEL.length - 1;
  const cab = kOrb * n, cauda = Math.max(0, cab - n * 0.45);
  const fimOrb = pT(t, orb1, 0.18);
  const segs: {a: Pt; b: Pt; tras: boolean; o: number; w: number}[] = [];
  if (kOrb > 0 && fimOrb < 1) {
    for (let i = Math.floor(cauda); i < Math.ceil(cab); i++) {
      const u0 = Math.max(i, cauda), u1 = Math.min(i + 1, cab);
      if (u1 <= u0) continue;
      const A = ANEL[i], B = ANEL[i + 1];
      const pa = {x: lerp(A.x, B.x, u0 - i), y: lerp(A.y, B.y, u0 - i)}, pb = {x: lerp(A.x, B.x, u1 - i), y: lerp(A.y, B.y, u1 - i)};
      const rel = (u1 - cauda) / Math.max(1e-6, cab - cauda);
      segs.push({a: pa, b: pb, tras: A.tras && B.tras, o: rel * (1 - fimOrb), w: 5 + 13 * rel});
    }
  }
  const cabP = kOrb > 0 && kOrb < 1 ? (() => { const i = Math.min(n - 1, Math.floor(cab)); return {x: lerp(ANEL[i].x, ANEL[i + 1].x, cab - i), y: lerp(ANEL[i].y, ANEL[i + 1].y, cab - i), tras: ANEL[i].tras}; })() : null;

  // traço do símbolo na frente e impressão
  const kOval = interpolate(t, [orb1 - 0.04, risca1], [0, 1], {...cl, easing: Easing.bezier(0.3, 0, 0.2, 1)});
  const kMaos = interpolate(t, [orb1 + 0.02, risca1], [0, 1], {...cl, easing: Easing.bezier(0.3, 0, 0.2, 1)});
  const imprime = pT(t, risca1 - 0.06, 0.25);
  const luzSai = pT(t, risca1, 0.35);
  const flash = interpolate(t, [risca1 - 0.05, risca1 + 0.04, risca1 + 0.5], [0, 1, 0], cl);
  const voa = pT(t, tFim, 0.2); // o símbolo sai da caixa (vira o símbolo colorido que voa para a assinatura)

  return (
    <div style={{position: "absolute", inset: 0, overflow: "hidden", opacity: entra, filter: `blur(${(1 - entra) * 22 + sai * 14}px) brightness(${(1 + (1 - entra) * 0.4) * (1 + 0.12 * sai)}) saturate(${1 - 0.45 * sai})`}}>
      <div style={{position: "absolute", left: 0, top: 0, width: IW, height: IH, transformOrigin: "0 0",
        transform: `translate(${cam.Q.x - CENTRO.x * cam.S}px, ${cam.Q.y - CENTRO.y * cam.S}px) scale(${cam.S})`}}>
        <Img src={staticFile("caixa/caixa-fundo.png")} style={{position: "absolute", left: 0, top: 0, width: IW, height: IH}} />
        {/* luz do risco batendo na caixa e no chão */}
        {cabP && <div style={{position: "absolute", left: cabP.x - 260, top: cabP.y - 160, width: 520, height: 320, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,214,60,0.35), rgba(255,214,60,0))", mixBlendMode: "screen", opacity: cabP.tras ? 0.5 : 1}} />}

        {/* símbolo impresso na frente (azul do ML) + o traço de luz que o desenha */}
        <div style={{position: "absolute", left: 0, top: 0, width: 890, height: 640, transformOrigin: "0 0", transform: matrizFrente}}>
          <svg width={890} height={640} viewBox="20 -4 89 64" style={{overflow: "visible"}}>
            <defs>
              <mask id="aro" maskUnits="userSpaceOnUse" x="0" y="-20" width="140" height="100">
                <path d={SIMBOLO[0].d} fill="#fff" />
                <path d={SIMBOLO[1].d} fill="#000" />
              </mask>
            </defs>
            <g opacity={imprime * (1 - voa) * 0.94}>
              <rect x="0" y="-20" width="140" height="100" fill="#2D3277" mask="url(#aro)" />
              <path d={SIMBOLO[5].d} fill="#2D3277" />
            </g>
            {kOval > 0 && luzSai < 1 && (
              <g opacity={1 - luzSai} style={{filter: "drop-shadow(0 0 0.4px rgba(150,100,0,0.9)) drop-shadow(0 0 3px #FFB000)"}}>
                <path d={OVAL_D} fill="none" stroke={LUZ} strokeWidth={1.1} strokeLinecap="round" pathLength={1} strokeDasharray={`${kOval} 1`} />
                {[2, 3, 4].map((i) => <path key={i} d={SIMBOLO[i].d} fill="none" stroke={LUZ} strokeWidth={0.7} strokeLinejoin="round" pathLength={1} strokeDasharray={`${kMaos} 1`} />)}
              </g>
            )}
          </svg>
        </div>

        {/* risco em volta da caixa: a parte de trás some atrás do contorno da caixa */}
        <svg width={IW} height={IH} style={{position: "absolute", left: 0, top: 0}}>
          <defs>
            <mask id="atras" maskUnits="userSpaceOnUse" x="0" y="0" width={IW} height={IH}>
              <rect width={IW} height={IH} fill="#fff" />
              <path d={CASCO_D} fill="#000" />
            </mask>
          </defs>
          <g style={{filter: "drop-shadow(0 0 2px rgba(190,130,0,0.7)) drop-shadow(0 0 12px #FFC400)"}}>
            <g mask="url(#atras)">{segs.filter((s) => s.tras).map((s, i) => <line key={i} x1={s.a.x} y1={s.a.y} x2={s.b.x} y2={s.b.y} stroke={LUZ} strokeWidth={s.w} strokeLinecap="round" opacity={s.o} />)}</g>
            {segs.filter((s) => !s.tras).map((s, i) => <line key={i} x1={s.a.x} y1={s.a.y} x2={s.b.x} y2={s.b.y} stroke={LUZ} strokeWidth={s.w} strokeLinecap="round" opacity={s.o} />)}
            {cabP && <circle cx={cabP.x} cy={cabP.y} r={14} fill="#FFE34D" mask={cabP.tras ? "url(#atras)" : undefined} />}
          </g>
        </svg>
        {/* brilho do símbolo acendendo */}
        {flash > 0 && <div style={{position: "absolute", left: QUAD_C.x - 420, top: QUAD_C.y - 300, width: 840, height: 600, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,236,150,0.55), rgba(255,214,60,0))", mixBlendMode: "screen", opacity: flash}} />}
      </div>
      {/* véu claro por baixo da assinatura (a caixa some no fundo do mundo) */}
      {sai > 0 && <div style={{position: "absolute", inset: 0, background: "#F6F5F1", opacity: 0.82 * sai}} />}
      {/* vinheta leve (mundo claro) */}
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse 75% 80% at 55% 60%, rgba(0,0,0,0) 55%, rgba(110,90,50,0.18) 100%)"}} />
    </div>
  );
};

// notificação "Entregue" (vidro escuro descendo do topo, como o "Delivered" da ref; palavras de Minhas Compras)
export const NotificacaoEntregue: React.FC<{t: number; t0: number; tFim: number}> = ({t, t0, tFim}) => {
  const k = pT(t, t0, 0.5, volta);
  const sai = pT(t, tFim, 0.35);
  if (k <= 0 || sai >= 1) return null;
  return (
    <div style={{position: "absolute", left: 960 - 330, top: 46 + (1 - Math.min(1, k)) * -150, width: 660, padding: "20px 24px", borderRadius: 26, display: "flex", gap: 18, alignItems: "center",
      background: "rgba(255,255,255,0.88)", backdropFilter: "blur(18px)", boxShadow: "0 0 0 1px rgba(0,0,0,0.05), 0 18px 44px rgba(60,50,20,0.22)", fontFamily: FONTE, color: "#111",
      opacity: Math.min(1, k * 2.5) * (1 - sai), filter: sai > 0 ? `blur(${sai * 10}px)` : undefined}}>
      <div style={{width: 64, height: 64, borderRadius: 15, background: "#FFE600", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0}}>
        <SimboloML w={50} />
      </div>
      <div style={{flex: 1}}>
        <div style={{display: "flex", justifyContent: "space-between", fontSize: 19, color: "rgba(0,0,0,0.5)"}}><span>Mercado Livre</span><span>agora</span></div>
        <div style={{fontSize: 27, fontWeight: 700, marginTop: 2, display: "flex", alignItems: "center", gap: 10}}>
          <svg width="26" height="26" viewBox="0 0 30 30"><circle cx="15" cy="15" r="14" fill="#00A650" /><path d="M8.5 15.5l4.2 4.2 8.8-9" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Entregue
        </div>
        <div style={{fontSize: 21, color: "rgba(0,0,0,0.7)", marginTop: 2}}>Chegou no dia 18 de outubro</div>
      </div>
    </div>
  );
};
