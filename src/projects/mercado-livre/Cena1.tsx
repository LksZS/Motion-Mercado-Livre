// Mercado Livre (anúncio conceito, 16:9, 30 qps), cena 1 v1 (18/10/2026): estilo do comercial da Amazon feito com o Claude (ref1).
// Mundo claro nas cores do ML; um risco de luz amarela desenha o contorno do símbolo do ML (0,3–3,4 s), as mãos se desenham por dentro,
// o símbolo se preenche com as cores do logo oficial e o nome "mercado livre" entra com uma varredura de luz.
// v2: tudo em 1,5 s.
// A música começa 2,3 s mais tarde (som v3), então a batida cai em 1,5 s, quando o logo acende. Às 2,4 s a câmera desce para o celular.
import React from "react";
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from "remotion";
import {NOME_D, SIMBOLO} from "./mlData";

const FPS = 30, W = 1920, H = 1080;
export const CENA1_FRAMES = Math.round(2.4 * FPS);
const eo = Easing.bezier(0.16, 1, 0.3, 1);
const io = Easing.bezier(0.65, 0, 0.35, 1);
const k = (t: number, a: number, b: number, e = eo) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e});
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;

// tempos (s)
const RISCO0 = 0.05, RISCO1 = 0.95, MAOS0 = 0.35, MAOS1 = 1.05, PREENCHE0 = 0.95, PREENCHE1 = 1.25, NOME0 = 1.0, NOME1 = 1.42, BATIDA = 1.5;
const LUZ = "#FFC400"; // luz do risco: o amarelo do logo, um pouco mais forte para aparecer no fundo claro

// símbolo: coordenadas do próprio arquivo (oval de 23,65 a 105,19 × 0 a 56,4)
const VB = {x: 20, y: -4, w: 89, h: 64};
const ELIPSE = {cx: 64.42, cy: 28.0, rx: 40.9, ry: 28.3};
const SH = 330, SS = SH / VB.h, SW = VB.w * SS; // símbolo na tela
const NOME_H = 236, NOME_W = (947.69 / 373.38) * NOME_H;
const GAP = 56;

// contorno como caminho que começa no mesmo ponto da cabeça do risco
const ELIPSE_D = Array.from({length: 121}).map((_, i) => {
  const a = Math.PI * 0.72 + (i / 120) * Math.PI * 2;
  return `${i ? "L" : "M"}${(ELIPSE.cx + ELIPSE.rx * Math.cos(a)).toFixed(3)} ${(ELIPSE.cy + ELIPSE.ry * Math.sin(a)).toFixed(3)}`;
}).join(" ");
const pontoNaElipse = (p: number) => {
  // começa embaixo à esquerda e roda no sentido horário
  const a = Math.PI * 0.72 + p * Math.PI * 2;
  return {x: ELIPSE.cx + ELIPSE.rx * Math.cos(a), y: ELIPSE.cy + ELIPSE.ry * Math.sin(a), a};
};

const Fundo: React.FC<{t: number; acende: number}> = ({t, acende}) => (
  <AbsoluteFill style={{background: "#F6F5F1"}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 55% at 50% 108%, rgba(255,209,0,${0.3 + acende * 0.2}) 0%, rgba(255,209,0,0.08) 45%, rgba(255,209,0,0) 75%)`}} />
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 48%, rgba(255,214,40,${0.1 + acende * 0.3}) 0%, rgba(255,214,40,0) ${38 + acende * 10}%)`}} />
    {/* poeira de luz subindo devagar */}
    {Array.from({length: 46}).map((_, i) => {
      const x = random(`px${i}`) * W, y0 = random(`py${i}`) * H, v = 10 + random(`pv${i}`) * 26;
      const y = ((y0 - t * v) % H + H) % H, r = 1 + random(`pr${i}`) * 2.2;
      const a = (0.25 + random(`pa${i}`) * 0.4) * (0.6 + 0.4 * Math.sin(t * 2 + i));
      return <div key={i} style={{position: "absolute", left: x, top: y, width: r * 2, height: r * 2, borderRadius: "50%", background: LUZ, opacity: a, filter: "blur(0.6px)"}} />;
    })}
    <AbsoluteFill style={{background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(120,105,60,0.16) 100%)"}} />
  </AbsoluteFill>
);

export const Cena1: React.FC<{semFundo?: boolean}> = ({semFundo = false}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const risco = k(t, RISCO0, RISCO1, io);
  const maos = k(t, MAOS0, MAOS1, io);
  const preenche = k(t, PREENCHE0, PREENCHE1);
  const nome = k(t, NOME0, NOME1, io);
  const clarao = t < BATIDA ? 0 : Math.exp(-(t - BATIDA) * 3.2);
  const acende = k(t, BATIDA - 0.1, BATIDA + 0.15) * (0.55 + 0.45 * clarao);
  // o símbolo começa no centro e anda para a esquerda quando o nome entra
  const lockW = SW + GAP + NOME_W;
  const xCentro = W / 2 - SW / 2, xLock = W / 2 - lockW / 2;
  const sx = lerp(xCentro, xLock, k(t, NOME0 - 0.15, NOME1, io));
  const sy = H / 2 - SH / 2 - 10;
  // câmera: aproximação lenta, pequeno empurrão na batida
  const cam = lerp(1.0, 1.05, k(t, 0, BATIDA, io)) + 0.035 * k(t, BATIDA, BATIDA + 0.5) + 0.012 * (t - BATIDA > 0 ? (t - BATIDA) : 0);
  const cabeca = pontoNaElipse(risco);
  const riscoVivo = risco > 0 && risco < 1;
  // faíscas soltas pela cabeça do risco
  const faiscas = Array.from({length: 40}).map((_, i) => {
    const nasce = RISCO0 + (i / 40) * (RISCO1 - RISCO0);
    const idade = t - nasce;
    if (idade < 0 || idade > 0.45) return null;
    const p = k(nasce, RISCO0, RISCO1, io), o = pontoNaElipse(p);
    const ang = o.a + Math.PI / 2 + (random(`fa${i}`) - 0.5) * 1.6;
    const vel = 9 + random(`fv${i}`) * 14;
    return {x: o.x + Math.cos(ang) * vel * 1.5 * idade, y: o.y + Math.sin(ang) * vel * 1.5 * idade + 9 * idade * idade, a: 1 - idade / 0.45, r: 0.35 + random(`fr${i}`) * 0.45};
  });
  // riscos longos de luz que saem do desenho (como na ref)
  const raios = [0.18, 0.35, 0.53, 0.73, 0.9].map((t0, i) => {
    const idade = t - t0;
    if (idade < 0 || idade > 0.3) return null;
    const p = k(t0, RISCO0, RISCO1, io), o = pontoNaElipse(p);
    const ang = o.a + (random(`ra${i}`) - 0.5) * 0.9;
    const len = 30 + random(`rl${i}`) * 30;
    const a0 = k(idade, 0, 0.3, eo);
    return {x1: o.x + Math.cos(ang) * len * a0 * 0.4, y1: o.y + Math.sin(ang) * len * a0 * 0.4, x2: o.x + Math.cos(ang) * len * a0, y2: o.y + Math.sin(ang) * len * a0, a: 1 - idade / 0.3};
  });
  const brilho = `drop-shadow(0 0 1.5px rgba(200,140,0,${0.6 * (1 - preenche)})) drop-shadow(0 0 ${8 + acende * 18}px rgba(255,200,0,${0.5 + acende * 0.3})) drop-shadow(0 14px 28px rgba(45,50,119,${0.16 * preenche}))`;
  const varre = lerp(-0.3, 1.3, k(t, NOME0, NOME1 + 0.1, io));
  return (
    <AbsoluteFill>
      {!semFundo && <Fundo t={t} acende={acende} />}
      <AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: "50% 48%"}}>
        {/* símbolo */}
        <svg width={SW} height={SH} viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} style={{position: "absolute", left: sx, top: sy, overflow: "visible", filter: brilho}}>
          <g opacity={preenche}>
            {SIMBOLO.map((p, i) => <path key={i} d={p.d} fill={p.fill} />)}
          </g>
          {/* risco do contorno */}
          <path d={ELIPSE_D} fill="none" stroke={LUZ} strokeWidth={0.9} strokeLinecap="round"
            pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - risco} opacity={1 - preenche} />
          {/* mãos desenhadas por dentro */}
          {SIMBOLO.slice(2, 5).map((p, i) => (
            <path key={i} d={p.d} fill="none" stroke={LUZ} strokeWidth={0.45} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k(maos, i * 0.12, 0.76 + i * 0.12, io)} opacity={(1 - preenche * 0.9) * (maos > 0 ? 1 : 0)} />
          ))}
          {raios.map((r, i) => r && <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke={LUZ} strokeWidth={0.35} strokeLinecap="round" opacity={r.a} />)}
          {faiscas.map((s, i) => s && <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={LUZ} opacity={s.a} />)}
          {riscoVivo && (
            <>
              <circle cx={cabeca.x} cy={cabeca.y} r={3.2} fill="rgba(255,200,0,0.35)" />
              <circle cx={cabeca.x} cy={cabeca.y} r={1.3} fill="#FFE34D" stroke="#E0A800" strokeWidth={0.25} />
            </>
          )}
        </svg>
        {/* nome "mercado livre" no azul do logo oficial, entrando com varredura de luz */}
        <div style={{position: "absolute", left: xLock + SW + GAP, top: H / 2 - NOME_H / 2 - 10, width: NOME_W, height: NOME_H,
          clipPath: varre >= 1.1 ? "none" : `inset(-60px ${Math.max(0, (1 - varre) * 100)}% -60px -60px)`, opacity: nome > 0 ? 1 : 0}}>
          <svg width={NOME_W} height={NOME_H} viewBox="0 0 947.69 373.37675" style={{overflow: "visible", filter: `drop-shadow(0 0 ${4 + acende * 14}px rgba(255,214,40,${0.25 + acende * 0.35})) drop-shadow(0 12px 24px rgba(45,50,119,0.12))`}}>
            <g transform="translate(0,-421.31026)"><path d={NOME_D} fill="#2D3277" /></g>
          </svg>
        </div>
        {/* linha de luz da varredura */}
        {varre > 0 && varre < 1.05 && (
          <div style={{position: "absolute", left: xLock + SW + GAP + varre * NOME_W - 3, top: H / 2 - NOME_H / 2 - 40, width: 6, height: NOME_H + 60, background: LUZ, borderRadius: 3, boxShadow: `0 0 18px 6px rgba(255,214,40,0.7)`, opacity: Math.sin(nome * Math.PI)}} />
        )}
      </AbsoluteFill>
      {/* clarão da batida */}
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 48%, rgba(255,226,60,${clarao * 0.4}) 0%, rgba(255,226,60,0) 45%)`}} />
    </AbsoluteFill>
  );
};
