// Anúncio conceito do Mercado Livre (16:9, 30 qps, 23,7 s), um mundo só e a câmera passando de cena em cena.
// Som: mapa-de-som-v2 (música desde 0 s + efeitos; v1 aprovado em 18/10/2026, v2 = 2 tempos a menos em 18,0 s). Tempos:
//  0–4,7 cena 1 (Cena1.tsx): o risco de luz desenha o logo, que acende na batida (3,8).
//  4,7 a câmera desce até o celular · 5,45 digita "fone sem fio" · 6,85 a grade aparece com o halo amarelo.
//  8,2 a câmera mergulha no 1º fone → página do produto · 10,3 a luz contorna "Comprar agora" · 10,95 vira "Compra feita" (check).
//  13,2 a câmera recua, um risco de luz sai do check e vira o começo da rota · 14,0 (volta o grave) o mapa 3D inclina e a rota anda.
//  16,55 a câmera mergulha no destino → a caixa amarela na porta; o risco de luz dá a volta nela e desenha o símbolo,
//  17,55 o símbolo fica impresso e desce a notificação "Entregue" · 18,875 assinatura: o símbolo sai da caixa (toque do app),
//  20,5 "+" e a estrela da Supernova, depois a estrela vira o nome SUPERNOVA STUDIO (~2 s), música abafada até 23,7.
import React from "react";
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import * as THREE from "three";
import {Cena1} from "./Cena1";
import {BH, BORDA, BOTAO, BOTAO_Y, BW, CARTAO1, FONTE, Full, ML, SH, SimboloML, SW, TelaBusca, TelaProduto} from "./Telas";
import {CamMapa, Mapa, pontoNaRota, ROTA, ROTA_LEN} from "./Mapa";
import {Caixa, caixaNaTela, NotificacaoEntregue} from "./Caixa";
import {CAP, ESTRELA, ESTRELA_H, ESTRELA_W, LETRAS, NOME_X0, NOME_X1} from "../../kit/supernova/logoData";

const FPS = 30, W = 1920, H = 1080;
// som v3: a música começa 2,3 s mais tarde na faixa (logo formado em 1,5 s). Os tempos abaixo seguem no relógio antigo (v2);
// o quadro f do vídeo é o instante f/30 + OFS desse relógio. A cena 1 usa o próprio relógio (Cena1.tsx).
const OFS = 2.3;
// som v4: 2 tempos a menos na espera do "Compra feita" (música 11,81 a 12,692 s).
// A imagem acompanha: o trecho 11,4 a 13,15 do relógio antigo passa mais rápido e tudo depois chega 0,882 s antes.
const CORTE_COMPRA = 1.346, J0 = 11.4, J1 = 13.15; // 3 tempos (11,81 a 13,156): mais 1 a pedido, "reduz mais 0,5s"
const relogio = (u: number) => (u < J0 ? u : u < J1 - CORTE_COMPRA ? J0 + ((u - J0) * (J1 - J0)) / (J1 - CORTE_COMPRA - J0) : u + CORTE_COMPRA);
export const FILME_FRAMES = Math.round((23.695 - OFS - CORTE_COMPRA) * FPS);
const eo = Easing.bezier(0.16, 1, 0.3, 1);
const io = Easing.bezier(0.65, 0, 0.35, 1);
const ei = Easing.bezier(0.55, 0, 0.9, 0.4);
const volta = Easing.bezier(0.34, 1.45, 0.64, 1);
const gesto = Easing.bezier(0.3, 0, 0.1, 1);
const cl = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const pT = (t: number, a: number, d: number, e = eo) => interpolate(t, [a, a + d], [0, 1], {...cl, easing: e});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerpLog = (a: number, b: number, k: number) => Math.exp(lerp(Math.log(a), Math.log(b), k));

// tempos (s)
const PAN0 = 4.7, PAN1 = 5.35, DIG0 = 5.45, GRADE = 6.85, MERGULHO = 8.2, TROCA = 8.48, CLIQUE = 10.3, COMPRA = 10.95;
const SAI = 13.2, POUSA = 13.75, ROTA0 = 14.0, INCL1 = 14.8, ROTA1 = 16.45, MERG2 = 16.55, CX0 = 16.9, ORB0 = 17.05, ORB1 = 17.4, ENTREGUE = 17.55, ASS = 18.875, MAIS = 20.495, TRAVA = 21.245, FIM = 23.695; // v2 do som: 2 tempos a menos depois do "Entregue"
const BUSCA = "fone sem fio";

// ---------- câmera do celular (coordenadas do corpo do celular; z = escala) ----------
type K = [number, number, number, number, ((x: number) => number)?]; // t, z, fx, fy, easing do trecho que CHEGA nesta chave
const cx1 = BORDA + CARTAO1.x + CARTAO1.w / 2, cy1 = BORDA + CARTAO1.y + 98;
const HERO_Y = BORDA + 118 + 112 + 12 + 150;
const FOCO_BOTAO = BORDA + BOTAO_Y - 40;
const KB: K[] = [
  [PAN1, 0.86, BW / 2, BH / 2],
  [5.62, 1.5, BW / 2, 150, io],
  [6.72, 1.56, BW / 2, 150],
  [7.02, 0.9, BW / 2, BH / 2, io],
  [MERGULHO, 0.97, BW / 2 - 30, BH / 2 - 40],
  [TROCA, 3.6, cx1, cy1, ei],
];
const KP: K[] = [
  [TROCA, 2.4, BW / 2, HERO_Y],
  [8.95, 1.0, BW / 2, BH / 2, eo],
  [9.6, 1.03, BW / 2, BH / 2 + 30],
  [10.15, 1.72, BW / 2, FOCO_BOTAO, io],
  [SAI, 1.86, BW / 2, FOCO_BOTAO + 6],
  [13.62, 0.42, BW / 2, FOCO_BOTAO + 80, eo],
];
const chaves = (t: number, ks: K[]) => {
  if (t <= ks[0][0]) return {z: ks[0][1], fx: ks[0][2], fy: ks[0][3]};
  for (let i = 1; i < ks.length; i++) {
    const [t1, z1, x1, y1, e] = ks[i];
    if (t <= t1) {
      const [t0, z0, x0, y0] = ks[i - 1];
      const k = interpolate(t, [t0, t1], [0, 1], {...cl, easing: e ?? ((x: number) => x)});
      return {z: lerpLog(z0, z1, k), fx: lerp(x0, x1, k), fy: lerp(y0, y1, k)};
    }
  }
  const l = ks[ks.length - 1];
  return {z: l[1], fx: l[2], fy: l[3]};
};
const camCel = (t: number) => {
  const c = chaves(t, t < TROCA ? KB : KP);
  const pan = 1300 * (1 - pT(t, PAN0, PAN1 - PAN0, io)); // o celular sobe de baixo enquanto o logo sai por cima
  const soco = t >= COMPRA ? 0.04 * Math.exp(-(t - COMPRA) * 7) : 0;
  return {...c, z: c.z * (1 + soco), pan};
};
const naTela = (c: ReturnType<typeof camCel>, wx: number, wy: number) => ({x: 960 + (wx - c.fx) * c.z, y: 540 + (wy - c.fy) * c.z + c.pan});

// perspectiva do celular.
// O celular gira em volta do ponto que a câmera olha: vira para um lado na grade, fica reto no mergulho do cartão,
// vira para o outro lado na página do produto e gira de novo ao ir para o botão. Um balanço leve por cima, nunca parado.
type R = [number, number, number, number]; // t, rx, ry, rz (graus)
const KR: R[] = [
  [6.72, 0, 0, 0],
  [7.02, 9, 16, -2.5],
  [7.9, 6, 9, -1.2],
  [8.2, 2, 3, 0],
  [8.48, 0, 0, 0],
  [8.95, 11, -18, 2.5],
  [9.6, 8, -12, 1.5],
  [10.15, 12, 9, -1.5],
  [10.95, 9, 12, -2],
  [SAI, 8, 15, -2.5],
  [13.62, 18, 26, -5],
];
const rotCel = (t: number) => {
  let r = [0, 0, 0];
  if (t >= KR[KR.length - 1][0]) r = KR[KR.length - 1].slice(1);
  else if (t > KR[0][0]) for (let i = 1; i < KR.length; i++) if (t <= KR[i][0]) {
    const k = interpolate(t, [KR[i - 1][0], KR[i][0]], [0, 1], {...cl, easing: io});
    r = [1, 2, 3].map((j) => lerp(KR[i - 1][j], KR[i][j], k));
    break;
  }
  const bal = pT(t, 6.72, 0.4) * (1 - pT(t, 8.2, 0.28)) + pT(t, 8.48, 0.4); // o balanço some só no mergulho do cartão
  return {rx: r[0] + 1.6 * bal * Math.sin(t * 1.7 + 0.6), ry: r[1] + 2.4 * bal * Math.sin(t * 1.25), rz: r[2]};
};
const PERSP = 2400;
const transfCel = (c: ReturnType<typeof camCel>, r: ReturnType<typeof rotCel>) =>
  `translate(${960 - c.fx * c.z}px, ${540 - c.fy * c.z + c.pan}px) scale3d(${c.z}, ${c.z}, ${c.z}) translate(${c.fx}px, ${c.fy}px) rotateX(${r.rx}deg) rotateY(${r.ry}deg) rotateZ(${r.rz}deg) translate(${-c.fx}px, ${-c.fy}px)`;
// ponto do celular na tela, já com a perspectiva (para as faíscas e o cometa saírem do lugar certo)
const naTela3d = (c: ReturnType<typeof camCel>, r: ReturnType<typeof rotCel>, wx: number, wy: number) => {
  const p = new DOMMatrix(transfCel(c, r)).transformPoint(new DOMPoint(wx, wy, 0));
  const k = PERSP / (PERSP - p.z);
  return {x: 960 + (p.x - 960) * k, y: 540 + (p.y - 540) * k};
};

// ---------- câmera do mapa ----------
const [SX, SZ] = ROTA[0];
const [EX, EZ] = ROTA[ROTA.length - 1];
const dRota = (t: number) => ROTA_LEN * pT(t, ROTA0, ROTA1 - ROTA0, io);
const camMapa = (t: number): CamMapa => {
  const alto = 9.6 - 0.9 * pT(t, 13.6, 0.45);
  const cima: CamMapa = {pos: [SX, alto, SZ + 0.08], alvo: [SX, 0, SZ], fov: 40};
  const [hx, hz] = pontoNaRota(dRota(t));
  const fimK = pT(t, 16.6, 1.8, io);
  const ax = lerp(hx + 0.7, EX - 0.3, fimK), az = lerp(hz - 0.5, EZ + 0.2, fimK);
  const giro = (-14 + 22 * interpolate(t, [ROTA0, ASS], [0, 1], cl)) * (Math.PI / 180);
  const dist = 8.4 - 0.9 * interpolate(t, [ROTA0, ASS], [0, 1], cl);
  const segue: CamMapa = {pos: [ax + Math.sin(giro) * dist * 0.5, dist * 0.86, az + Math.cos(giro) * dist * 0.5], alvo: [ax, 0, az], fov: 40};
  const k = pT(t, ROTA0, INCL1 - ROTA0, io);
  const c0: CamMapa = {pos: [lerp(cima.pos[0], segue.pos[0], k), lerp(cima.pos[1], segue.pos[1], k), lerp(cima.pos[2], segue.pos[2], k)], alvo: [lerp(cima.alvo[0], segue.alvo[0], k), 0, lerp(cima.alvo[2], segue.alvo[2], k)], fov: 40};
  // mergulho no destino (a rota chegou): a câmera desce até a luz da entrega
  const m = pT(t, MERG2, CX0 + 0.2 - MERG2, ei);
  if (m <= 0) return c0;
  const dest: CamMapa = {pos: [EX + 0.2, 0.28, EZ + 0.55], alvo: [EX, 0.05, EZ], fov: 40};
  return {pos: [lerp(c0.pos[0], dest.pos[0], m), lerp(c0.pos[1], dest.pos[1], m), lerp(c0.pos[2], dest.pos[2], m)], alvo: [lerp(c0.alvo[0], dest.alvo[0], m), lerp(0, dest.alvo[1], m), lerp(c0.alvo[2], dest.alvo[2], m)], fov: 40};
};

// ---------- fundo do mundo escuro ----------
const Fundo: React.FC<{t: number; hx: number; hy: number; halo: number}> = ({t, hx, hy, halo}) => (
  <AbsoluteFill style={{background: "#F6F5F1"}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 70% at ${(hx / W) * 100}% ${(hy / H) * 100}%, rgba(255,209,0,${0.22 + 0.3 * halo}) 0%, rgba(255,209,0,${0.06 + 0.08 * halo}) 40%, rgba(255,209,0,0) 72%)`}} />
    {Array.from({length: 40}).map((_, i) => {
      const x = random(`qx${i}`) * W, y0 = random(`qy${i}`) * H, v = 10 + random(`qv${i}`) * 26;
      const y = ((y0 - t * v) % H + H) % H, r = 1 + random(`qr${i}`) * 2;
      return <div key={i} style={{position: "absolute", left: x, top: y, width: r * 2, height: r * 2, borderRadius: "50%", background: "#FFC400", opacity: (0.2 + random(`qa${i}`) * 0.35) * (0.6 + 0.4 * Math.sin(t * 2 + i))}} />;
    })}
    <AbsoluteFill style={{background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(120,105,60,0.16) 100%)"}} />
  </AbsoluteFill>
);

// ---------- celular (corpo escuro, ilha, aro de luz amarela como na ref) ----------
const Celular: React.FC<{halo: number; children: React.ReactNode}> = ({halo, children}) => (
  <div style={{position: "absolute", left: 0, top: 0, width: BW, height: BH, borderRadius: 82, background: "linear-gradient(150deg, #3a3a3e 0%, #161618 40%, #0b0b0c 100%)",
    boxShadow: `0 0 0 2px rgba(255,220,90,${0.55 + 0.4 * halo}), 0 0 ${26 + 30 * halo}px rgba(255,205,0,${0.5 + 0.35 * halo}), 0 0 ${120 + 120 * halo}px rgba(255,200,0,${0.3 + 0.3 * halo}), 0 40px 80px rgba(60,50,20,0.28)`}}>
    <div style={{position: "absolute", left: BORDA, top: BORDA, width: SW, height: SH, borderRadius: 68, overflow: "hidden", background: "#000"}}>
      {children}
      <div style={{position: "absolute", left: SW / 2 - 62, top: 14, width: 124, height: 36, borderRadius: 18, background: "#000"}} />
      <div style={{position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.04) 100%)", pointerEvents: "none"}} />
    </div>
  </div>
);

// luz que contorna o botão "Comprar agora" (como o risco que contorna o "Buy Now" na ref)
const LuzBotao: React.FC<{k: number}> = ({k}) => {
  if (k <= 0 || k >= 1) return null;
  const w = BOTAO.w + 8, h = BOTAO.h + 8, r = 12;
  const d = `M${r},0 H${w - r} Q${w},0 ${w},${r} V${h - r} Q${w},${h} ${w - r},${h} H${r} Q0,${h} 0,${h - r} V${r} Q0,0 ${r},0`;
  const a = Math.sin(k * Math.PI);
  return (
    <svg width={w} height={h} style={{position: "absolute", left: BOTAO.x - 4, top: BOTAO_Y - 4, overflow: "visible"}}>
      <path d={d} fill="none" stroke="#FFE45C" strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="0.28 0.72" strokeDashoffset={-k * 1.25} opacity={a} style={{filter: "drop-shadow(0 0 6px #FFD100) drop-shadow(0 0 14px #FFB000)"}} />
    </svg>
  );
};

const Faiscas: React.FC<{t: number; t0: number; x: number; y: number}> = ({t, t0, x, y}) => {
  const idade = t - t0;
  if (idade < 0 || idade > 1.1) return null;
  return (
    <>
      {Array.from({length: 26}).map((_, i) => {
        const ang = random(`fa${i}`) * Math.PI * 2, v = 120 + random(`fv${i}`) * 260;
        const k = 1 - Math.pow(1 - Math.min(1, idade / 0.9), 3);
        const px = x + Math.cos(ang) * v * k, py = y + Math.sin(ang) * v * k * 0.6 + 40 * idade * idade;
        const r = 2 + random(`fr${i}`) * 3.5;
        return <div key={i} style={{position: "absolute", left: px - r, top: py - r, width: r * 2, height: r * 2, borderRadius: "50%", background: i % 3 ? "#FFE45C" : "#7CF0A8", opacity: 1 - idade / 1.1, boxShadow: "0 0 8px #FFD100"}} />;
      })}
    </>
  );
};

// risco de luz (cometa) entre dois pontos da tela, por uma curva
const Cometa: React.FC<{k: number; a: {x: number; y: number}; b: {x: number; y: number}}> = ({k, a, b}) => {
  if (k <= 0 || k >= 1) return null;
  const c = {x: lerp(a.x, b.x, 0.5) + 380, y: Math.min(a.y, b.y) - 260};
  const q = (u: number) => ({x: (1 - u) * (1 - u) * a.x + 2 * (1 - u) * u * c.x + u * u * b.x, y: (1 - u) * (1 - u) * a.y + 2 * (1 - u) * u * c.y + u * u * b.y});
  const cab = q(k);
  const pts = Array.from({length: 24}).map((_, i) => q(Math.max(0, k - 0.32 * (i / 23))));
  return (
    <svg width={W} height={H} style={{position: "absolute", inset: 0}}>
      {pts.slice(1).map((p, i) => (
        <line key={i} x1={pts[i].x} y1={pts[i].y} x2={p.x} y2={p.y} stroke="#FFC400" strokeWidth={9 * (1 - i / 23)} strokeLinecap="round" opacity={1 - i / 23} style={{filter: "drop-shadow(0 0 2px rgba(200,140,0,0.6)) drop-shadow(0 0 8px #FFC400)"}} />
      ))}
      <circle cx={cab.x} cy={cab.y} r={18} fill="rgba(255,200,0,0.35)" />
      <circle cx={cab.x} cy={cab.y} r={7} fill="#FFE34D" stroke="#E0A800" strokeWidth={1.5} />
    </svg>
  );
};

// aviso de entrega (cartão de vidro escuro no canto, como o "Arriving today" da ref; palavras do app real)
const Aviso: React.FC<{t: number; d: number}> = ({t, d}) => {
  const entra = pT(t, 14.3, 0.45);
  const sai = pT(t, MERG2, 0.3);
  if (entra <= 0 || sai >= 1) return null;
  const ok = pT(t, ENTREGUE, 0.3, volta);
  const prog = 0.34 + 0.66 * (d / ROTA_LEN);
  return (
    <div style={{position: "absolute", left: 70, top: 64, width: 500, padding: "26px 30px 28px", borderRadius: 18, background: "rgba(255,255,255,0.94)",
      boxShadow: "0 0 0 1px rgba(0,0,0,0.05), 0 18px 44px rgba(40,50,70,0.22)", fontFamily: FONTE, color: "#333",
      opacity: entra * (1 - sai), transform: `translateX(${(1 - entra) * -40}px) scale(${1 + 0.05 * Math.sin(Math.min(1, ok) * Math.PI)})`}}>
      <div style={{position: "relative", height: 36}}>
        <div style={{position: "absolute", fontSize: 30, fontWeight: 700, color: ML.verde, opacity: 1 - Math.min(1, ok * 2)}}>Chegará grátis hoje</div>
        <div style={{position: "absolute", fontSize: 30, fontWeight: 700, display: "flex", alignItems: "center", gap: 12, opacity: Math.min(1, ok * 2), transform: `translateY(${(1 - Math.min(1, ok)) * 10}px)`}}>
          <svg width="32" height="32" viewBox="0 0 30 30"><circle cx="15" cy="15" r="14" fill={ML.verde} /><path d="M8.5 15.5l4.2 4.2 8.8-9" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Entregue
        </div>
      </div>
      <div style={{fontSize: 18, color: "rgba(0,0,0,0.55)", marginTop: 6, display: "flex", gap: 7, alignItems: "center"}}>Armazenado e enviado pelo <Full s={18} /></div>
      <div style={{position: "relative", height: 16, marginTop: 20}}>
        <div style={{position: "absolute", left: 6, right: 6, top: 6, height: 4, borderRadius: 2, background: "#e6e6e6"}} />
        <div style={{position: "absolute", left: 6, top: 6, height: 4, borderRadius: 2, width: `calc(${prog * 100}% - 12px)`, background: "#FFD100"}} />
        {[0, 1, 2, 3].map((i) => {
          const aceso = prog >= i / 3 - 0.001;
          return <div key={i} style={{position: "absolute", left: `calc(${(i / 3) * 100}% - ${i === 0 ? 0 : i === 3 ? 16 : 8}px)`, top: 0, width: 16, height: 16, borderRadius: 8, background: aceso ? "#FFD100" : "#d4d6da", boxShadow: aceso ? "0 0 0 3px rgba(255,209,0,0.25)" : "none"}} />;
        })}
      </div>
    </div>
  );
};

export const Filme: React.FC = () => {
  const f = useCurrentFrame();
  const t = relogio(f / FPS + OFS);

  // ---------- celular ----------
  const c = camCel(t), cA = camCel(t - 1 / FPS);
  const vel = Math.hypot((c.fx - cA.fx) * c.z, (c.fy - cA.fy) * c.z + (c.pan - cA.pan)) + Math.abs(Math.log(c.z / cA.z)) * 1400;
  const borrao = Math.min(16, Math.max(0, vel - 40) * 0.05);
  const nChars = Math.max(0, Math.min(BUSCA.length, Math.floor((t - DIG0) / 0.1) + 1));
  const halo = 0.35 + 0.65 * pT(t, GRADE, 0.6) - 0.3 * pT(t, TROCA, 0.5);
  const someCel = pT(t, 13.32, 0.3);
  const mostraCel = t >= PAN0 - 0.05 && someCel < 1;
  const centroCel = naTela(c, BW / 2, BH / 2);
  const rc = rotCel(t);
  const pBotao = naTela3d(c, rc, BORDA + BOTAO.x + BOTAO.w / 2, BORDA + BOTAO_Y + BOTAO.h / 2);
  const pCheck = naTela3d(camCel(SAI), rotCel(SAI), BORDA + BOTAO.x + BOTAO.w / 2 - 92, BORDA + BOTAO_Y + BOTAO.h / 2);

  // ---------- mapa ----------
  const mostraMapa = t >= 13.55 && t < CX0 + 0.4;
  const cm = camMapa(t);
  const d = dRota(t);
  const mapaVis = pT(t, 13.62, 0.4);
  const fimBorrao = pT(t, MERG2 + 0.1, CX0 + 0.45 - MERG2 - 0.1, io);
  const luzDestino = pT(t, ROTA1 - 0.3, 0.5);
  const clarao = interpolate(t, [MERG2 + 0.1, CX0 + 0.15, CX0 + 0.6], [0, 0.9, 0], cl);
  const pEntrega = caixaNaTela(ASS, CX0, ASS);

  // ---------- assinatura ----------
  const vai = pT(t, ASS, 0.55, io); // o símbolo do destino sobe para o centro da tela
  const sEs = pT(t, MAIS, 0.42, gesto);
  const trava = pT(t, TRAVA, 0.6, gesto);
  const saiPar = pT(t, TRAVA - 0.08, 0.18, Easing.in(Easing.quad));
  const nomeW = NOME_X1 - NOME_X0;
  const se = (2.6 * CAP) / ESTRELA_H, respiro = (1000 * 16) / 22;
  const kN = (W * 0.55) / (ESTRELA_W * se + respiro + nomeW), sk = se * kN;
  const esq = (W - (ESTRELA_W * se + respiro + nomeW) * kN) / 2;
  const exL = esq + 54 * sk, eyL = 540, nx = esq + (ESTRELA_W * se + respiro - NOME_X0) * kN, ny = 540 + (CAP * kN) / 2;
  const symW = lerp(pEntrega.w, 300, vai), symX = lerp(pEntrega.x, 960 - 200, vai), symY = lerp(pEntrega.y, 540, vai);
  const exP = 960 + 200, eyP = 540;
  const eP = interpolate(sEs, [0, 0.6], [0, 1], cl);
  const esX = lerp(exP, exL, trava), esY = lerp(eyP, eyL, trava), esS = lerp(1.25, sk, trava) * (0.12 + 0.88 * eP);
  const nP = interpolate(trava, [0.22, 1], [0, 1], cl);
  const empurra = 1 + 0.03 * interpolate(t, [ASS, FIM], [0, 1], cl);
  const mostraSimbolo = t >= ASS && saiPar < 1;

  // ---------- passagem check → mapa ----------
  const cometa = interpolate(t, [SAI + 0.05, POUSA], [0, 1], {...cl, easing: io});
  const pRotaIni = {x: 960, y: 540};

  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#F6F5F1"}}>
      <Fundo t={t} hx={t < PAN0 ? 960 : centroCel.x} hy={t < PAN0 ? 1080 : Math.min(1300, centroCel.y)} halo={t < PAN0 ? 0 : halo * (1 - someCel)} />

      {/* cena 1: o logo (sai por cima quando a câmera desce) */}
      {t < PAN1 + 0.1 && (
        <AbsoluteFill style={{transform: `translateY(${-1300 * pT(t, PAN0, PAN1 - PAN0, io)}px)`, filter: t > PAN0 ? `blur(${borrao * 0.8}px)` : undefined}}>
          <Cena1 semFundo />
        </AbsoluteFill>
      )}

      {/* cenas 2 a 4: o celular */}
      {mostraCel && (
        <AbsoluteFill style={{perspective: PERSP, perspectiveOrigin: "960px 540px"}}>
        <div style={{position: "absolute", left: 0, top: 0, width: BW, height: BH, transformOrigin: "0 0",
          transform: transfCel(c, rc),
          filter: borrao > 0.3 || someCel > 0 ? `blur(${borrao + someCel * 10}px)` : undefined, opacity: 1 - someCel}}>
          <Celular halo={halo}>
            {t < TROCA ? (
              <TelaBusca texto={BUSCA.slice(0, nChars)} cursor={t >= DIG0 - 0.15 && t < GRADE} resultados={pT(t, GRADE, 0.3)}
                aparece={[0, 1, 2, 3].map((i) => pT(t, GRADE + 0.03 + i * 0.07, 0.38, volta))} destaque={pT(t, 7.35, 0.45)} foco={pT(t, 5.3, 0.2) * (1 - pT(t, GRADE, 0.2))} />
            ) : (
              <div style={{position: "relative"}}>
                <TelaProduto compra={pT(t, COMPRA, 0.3)} check={pT(t, COMPRA + 0.08, 0.35, io)} flutua={Math.sin(t * 2.2) * 5} brilhoBotao={Math.sin(Math.PI * pT(t, CLIQUE, 0.65, (x) => x))} />
                <LuzBotao k={interpolate(t, [CLIQUE, COMPRA - 0.03], [0, 1], cl)} />
              </div>
            )}
          </Celular>
        </div>
        </AbsoluteFill>
      )}
      {t >= COMPRA && t < COMPRA + 1.2 && <Faiscas t={t} t0={COMPRA} x={pBotao.x} y={pBotao.y} />}

      {/* cena 5: o mapa 3D */}
      {mostraMapa && (
        <AbsoluteFill style={{opacity: mapaVis * (1 - fimBorrao), filter: fimBorrao > 0 ? `blur(${fimBorrao * 16}px) brightness(${1 + 0.8 * fimBorrao})` : undefined}}>
          <ThreeCanvas width={W} height={H} camera={{fov: 40, near: 0.05, far: 200, position: [0, 8, 0]}} gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping}}>
            <Mapa c={cm} d={t >= POUSA ? Math.max(0.0001, d) : 0} luzFim={luzDestino} />
          </ThreeCanvas>
          <Aviso t={t} d={d} />
        </AbsoluteFill>
      )}

      {/* cena da caixa: a caixa amarela do ML na porta */}
      {t >= CX0 - 0.05 && <Caixa t={t} t0={CX0} orb0={ORB0} orb1={ORB1} risca1={ENTREGUE} tFim={ASS} />}
      {clarao > 0 && <AbsoluteFill style={{background: "radial-gradient(ellipse 70% 70% at 50% 55%, rgba(255,236,140,1) 0%, rgba(255,226,90,0.75) 45%, rgba(255,240,190,0.4) 80%)", opacity: clarao}} />}
      <NotificacaoEntregue t={t} t0={ENTREGUE} tFim={ASS} />
      <Cometa k={cometa} a={pCheck} b={pRotaIni} />

      {/* símbolo do ML: acende no destino e vira o primeiro símbolo da assinatura */}
      {mostraSimbolo && (
        <div style={{position: "absolute", left: symX - symW / 2 - saiPar * 260, top: symY - (symW * 64) / 89 / 2, 
          opacity: Math.min(1, (t - ASS) / 0.15) * (1 - saiPar), filter: `drop-shadow(0 ${10 * vai}px ${24 * vai}px rgba(45,50,119,0.22)) ${saiPar > 0 ? `blur(${saiPar * 14}px)` : ""}`}}>
          <SimboloML w={symW} />
        </div>
      )}
      {t >= MAIS && saiPar < 1 && (
        <svg width="70" height="70" viewBox="0 0 60 60" style={{position: "absolute", left: 960 - 35 - saiPar * 80, top: 540 - 35, opacity: Math.min(1, sEs * 3) * (1 - saiPar), filter: saiPar > 0 ? `blur(${saiPar * 12}px)` : "none"}}>
          <path d="M30 10 V50 M10 30 H50" stroke="#1A1A1A" strokeWidth="3.4" strokeLinecap="round" />
        </svg>
      )}
      {t >= MAIS && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0, transformOrigin: "960px 540px", transform: `scale(${empurra})`}}>
          {nP > 0 && (
            <g opacity={Math.min(1, nP * 2.2)} style={{filter: nP < 1 ? `blur(${(1 - nP) * 18}px)` : undefined}}
              transform={`translate(${exL},${ny - (CAP * kN) / 2}) rotate(${(1 - nP) * -4}) scale(${0.1 + 0.9 * nP}) translate(${-exL},${-(ny - (CAP * kN) / 2)})`}>
              <g transform={`translate(${nx},${ny}) scale(${kN})`} fill="#141414">
                {LETRAS.map((l, i) => <path key={i} d={l.d} transform={`translate(${l.x},0)`} />)}
              </g>
            </g>
          )}
          <path d={ESTRELA} fill="#141414" opacity={Math.min(1, eP * 3)} style={{filter: eP < 1 ? `blur(${(1 - eP) * 10}px)` : undefined}}
            transform={`translate(${esX},${esY}) rotate(${(1 - eP) * -35}) scale(${esS}) translate(0,-13)`} />
        </svg>
      )}

      {/* linha pequena no fim */}
      {t >= TRAVA && (
        <div style={{
          position: "absolute",
          bottom: 48,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTE,
          fontSize: 18,
          fontWeight: 500,
          color: "rgba(0,0,0,0.45)",
          letterSpacing: 0.5,
          opacity: interpolate(t, [TRAVA, TRAVA + 0.4], [0, 1], cl),
        }}>
          Anúncio conceito, não oficial.
        </div>
      )}
    </AbsoluteFill>
  );
};
