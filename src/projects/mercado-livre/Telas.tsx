// Telas do app do Mercado Livre para o anúncio conceito (18/10/2026). Claras como o app real,
// com as cores e as palavras copiadas do site real (prints do site real, estilos lidos da página):
// cabeçalho #FFF159, "Comprar agora" #3483FA, verde #00A650, "Chegará grátis …", "⚡FULL", "+10mil vendidos", "sem juros".
// Preço e frete de exemplo: R$ 499 riscado, R$ 349, 30% OFF, 10x R$ 34,90 sem juros, "Chegará grátis hoje".
import React from "react";
import {Img, staticFile} from "remotion";
import {loadFont} from "@remotion/fonts";
import {SIMBOLO} from "./mlData";

loadFont({family: "Figtree", url: staticFile("fonts/figtree/Figtree_wght.ttf"), weight: "300 900"});
export const FONTE = "Figtree, sans-serif";

export const ML = {cabecalho: "#FFF159", azul: "#3483FA", verde: "#00A650", amarelo: "#FFD100", azulMarca: "#2D3277"};
const FUNDO = "#EDEDED", CARTAO = "#FFFFFF", TXT = "rgba(0,0,0,0.9)", TXT2 = "rgba(0,0,0,0.55)";

// tela do celular (px do mundo)
export const SW = 500, SH = 1084, BORDA = 14, BW = SW + 2 * BORDA, BH = SH + 2 * BORDA;

export const SimboloML: React.FC<{w: number; style?: React.CSSProperties}> = ({w, style}) => (
  <svg width={w} height={(w * 64) / 89} viewBox="20 -4 89 64" style={style}>
    {SIMBOLO.map((p, i) => <path key={i} d={p.d} fill={p.fill} />)}
  </svg>
);

const Raio: React.FC<{h: number; cor?: string}> = ({h, cor = ML.verde}) => (
  <svg width={h * 0.62} height={h} viewBox="0 0 10 16" style={{display: "inline-block", verticalAlign: "-2px"}}><path d="M6.5 0 0 9h4l-1 7 7-10H6z" fill={cor} /></svg>
);
export const Full: React.FC<{s?: number}> = ({s = 15}) => (
  <span style={{color: ML.verde, fontWeight: 800, fontStyle: "italic", fontSize: s, letterSpacing: 0.3, whiteSpace: "nowrap"}}><Raio h={s * 0.95} /> FULL</span>
);

const Status: React.FC<{escuro?: boolean}> = ({escuro}) => (
  <div style={{height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 34px 0 40px", fontFamily: FONTE, fontWeight: 700, fontSize: 19, color: escuro ? "#111" : "#fff"}}>
    <span>9:41</span>
    <span style={{display: "flex", gap: 7, alignItems: "center"}}>
      <svg width="20" height="12" viewBox="0 0 20 12">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 5.3} y={9 - i * 3} width="3.6" height={3 + i * 3} rx="1" fill="currentColor" />)}</svg>
      <svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity="0.45" /><rect x="2.5" y="2.5" width="17" height="8" rx="2" fill="currentColor" /><rect x="24.5" y="4.5" width="2" height="4" rx="1" fill="currentColor" opacity="0.45" /></svg>
    </span>
  </div>
);

// cabeçalho amarelo com a busca ("Estou buscando..." é o texto real do campo vazio)
export const Cabecalho: React.FC<{texto: string; cursor?: boolean; foco?: number}> = ({texto, cursor = false, foco = 0}) => (
  <div style={{background: ML.cabecalho, paddingBottom: 14}}>
    <Status escuro />
    <div style={{display: "flex", alignItems: "center", gap: 12, padding: "6px 18px 0 16px"}}>
      <SimboloML w={50} />
      <div style={{flex: 1, height: 46, borderRadius: 23, background: "#fff", display: "flex", alignItems: "center", gap: 10, padding: "0 16px",
        boxShadow: `0 1px 3px rgba(0,0,0,0.12), 0 0 0 ${foco * 3}px rgba(52,131,250,${0.35 * foco})`}}>
        <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="6" fill="none" stroke="#999" strokeWidth="2" /><path d="M13 13l5 5" stroke="#999" strokeWidth="2" strokeLinecap="round" /></svg>
        <span style={{fontFamily: FONTE, fontSize: 20, color: texto ? "#222" : "#999", whiteSpace: "nowrap"}}>
          {texto || "Estou buscando..."}
          {cursor && <span style={{display: "inline-block", width: 2, height: 22, background: ML.azul, marginLeft: 2, verticalAlign: "-4px"}} />}
        </span>
      </div>
      <svg width="30" height="30" viewBox="0 0 30 30"><path d="M3 5h4l3 14h14l3-10H9" fill="none" stroke="#333" strokeWidth="2" strokeLinejoin="round" /><circle cx="12" cy="24" r="2" fill="#333" /><circle cx="22" cy="24" r="2" fill="#333" /></svg>
    </div>
  </div>
);

export type Produto = {img: string; filtro?: string; titulo: string; de: string; por: string; cent?: string; off: string; vendidos: string; nota: string};
export const PRODUTOS: Produto[] = [
  {img: "fone/fone-frente.png", titulo: "Fone de Ouvido Bluetooth Sem Fio Over-ear", de: "R$ 499", por: "349", off: "30% OFF", vendidos: "+10mil vendidos", nota: "4.9"},
  {img: "fone/fone-tres4.png", filtro: "brightness(0.42) contrast(1.15)", titulo: "Headphone Sem Fio Cancelamento de Ruído", de: "R$ 459", por: "389", off: "15% OFF", vendidos: "+5mil vendidos", nota: "4.8"},
  {img: "fone/fone-lado.png", filtro: "sepia(0.5) hue-rotate(175deg) saturate(1.6)", titulo: "Fone Bluetooth Over-ear Dobrável", de: "R$ 299", por: "229", off: "23% OFF", vendidos: "+1000 vendidos", nota: "4.7"},
  {img: "fone/fone-frente.png", filtro: "saturate(0) brightness(1.18)", titulo: "Fone de Ouvido Sem Fio Bluetooth 6.0", de: "R$ 389", por: "279", off: "28% OFF", vendidos: "+5mil vendidos", nota: "4.8"},
];

const Foto: React.FC<{p: Produto; h: number; flutua?: number}> = ({p, h, flutua = 0}) => (
  <div style={{height: h, background: "#F5F5F5", position: "relative", overflow: "hidden"}}>
    <Img src={staticFile(p.img)} style={{position: "absolute", left: "50%", top: "50%", height: h * 1.9, width: h * 1.9, maxWidth: "none", filter: p.filtro, transform: `translate(-50%, -50%) translateY(${flutua}px)`}} />
  </div>
);

// cartão da grade (copiado do cartão real da busca: foto, título, nota, preço riscado, preço, % OFF, "Chegará grátis …" + FULL)
export const Cartao: React.FC<{p: Produto; destaque?: number}> = ({p, destaque = 0}) => (
  <div style={{background: CARTAO, borderRadius: 12, overflow: "hidden", fontFamily: FONTE, position: "relative",
    boxShadow: destaque > 0 ? `0 0 0 ${2 + destaque * 2}px rgba(255,209,0,${destaque}), 0 0 ${34 * destaque}px rgba(255,200,0,${0.7 * destaque}), 0 1px 2px rgba(0,0,0,0.12)` : "0 1px 2px rgba(0,0,0,0.12)"}}>
    <Foto p={p} h={196} />
    <div style={{padding: "12px 12px 14px"}}>
      <div style={{fontSize: 15.5, lineHeight: "19px", color: TXT, height: 38, overflow: "hidden"}}>{p.titulo}</div>
      <div style={{fontSize: 13, color: TXT2, marginTop: 5}}><span style={{color: ML.azul}}>★</span> {p.nota} | {p.vendidos}</div>
      <div style={{fontSize: 13, color: TXT2, textDecoration: "line-through", marginTop: 6}}>{p.de}</div>
      <div style={{display: "flex", alignItems: "center", gap: 7}}>
        <span style={{fontSize: 26, color: TXT}}>R$ {p.por}</span>
        <span style={{fontSize: 12.5, fontWeight: 700, color: "#fff", background: ML.verde, padding: "2px 5px", borderRadius: 3}}>{p.off}</span>
      </div>
      <div style={{marginTop: 6, fontSize: 13.5, fontWeight: 600, color: ML.verde, display: "flex", gap: 6, alignItems: "center", whiteSpace: "nowrap"}}><span style={{background: "rgba(0,166,80,0.1)", padding: "1px 4px", borderRadius: 3}}>Chegará grátis hoje</span> <Full s={12.5} /></div>
    </div>
  </div>
);

// tela 1: busca e resultados. aparece[i] = 0..1 de cada cartão; destaque = halo no 1º cartão
export const TelaBusca: React.FC<{texto: string; cursor: boolean; resultados: number; aparece: number[]; destaque: number; foco: number}> = ({texto, cursor, resultados, aparece, destaque, foco}) => (
  <div style={{width: SW, height: SH, background: FUNDO, overflow: "hidden", position: "relative"}}>
    <Cabecalho texto={texto} cursor={cursor} foco={foco} />
    <div style={{padding: "16px 16px 0", opacity: resultados, transform: `translateY(${(1 - resultados) * 14}px)`, fontFamily: FONTE}}>
      <div style={{fontSize: 24, fontWeight: 700, color: TXT}}>Fone sem fio</div>
      <div style={{fontSize: 14, color: TXT2, marginTop: 2}}>2.486 resultados</div>
    </div>
    <div style={{display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 12, padding: "16px 16px"}}>
      {PRODUTOS.map((p, i) => (
        <div key={i} style={{opacity: Math.min(1, aparece[i] * 1.6), transform: `translateY(${(1 - aparece[i]) * 40}px) scale(${0.92 + 0.08 * aparece[i]})`}}>
          <Cartao p={p} destaque={i === 0 ? destaque : 0} />
        </div>
      ))}
    </div>
  </div>
);
// posição do 1º cartão na tela (para a câmera mergulhar nele)
export const CARTAO1 = {x: 16, y: 52 + 66 + 14 + 16 + 54 + 16, w: (SW - 44) / 2, h: 196 + 140};

// tela 2: página do produto (ordem e palavras da página real). compra: 0..1 o botão vira "Compra feita"
export const BOTAO_Y = 712; // topo do "Comprar agora" na tela
export const BOTAO = {x: 18, w: SW - 36, h: 60};
export const TelaProduto: React.FC<{compra: number; check: number; flutua: number; brilhoBotao: number}> = ({compra, check, flutua, brilhoBotao}) => {
  const p = PRODUTOS[0];
  return (
    <div style={{width: SW, height: SH, background: "#FFFFFF", overflow: "hidden", position: "relative", fontFamily: FONTE}}>
      <Cabecalho texto="fone sem fio" />
      <div style={{padding: "12px 18px 0"}}>
        <div style={{display: "flex", justifyContent: "space-between", fontSize: 14, color: TXT2}}>
          <span>Novo | +10mil vendidos</span><span><span style={{color: ML.azul}}>★★★★★</span> 4.9</span>
        </div>
        <div style={{marginTop: 8, display: "flex", gap: 8, alignItems: "center"}}>
          <span style={{fontSize: 12, fontWeight: 700, color: "#fff", background: "#FF7733", padding: "3px 6px", borderRadius: 3}}>MAIS VENDIDO</span>
          <span style={{fontSize: 13, color: ML.azul}}>1º em Fones</span>
        </div>
        <div style={{fontSize: 19, lineHeight: "24px", color: TXT, marginTop: 8}}>{p.titulo}</div>
      </div>
      <div style={{margin: "12px 18px 0", borderRadius: 12, overflow: "hidden"}}><Foto p={p} h={300} flutua={flutua} /></div>
      <div style={{padding: "14px 18px 0"}}>
        <div style={{fontSize: 16, color: TXT2, textDecoration: "line-through"}}>{p.de}</div>
        <div style={{display: "flex", alignItems: "center", gap: 10}}>
          <span style={{fontSize: 42, color: TXT, fontWeight: 400}}>R$ {p.por}</span>
          <span style={{fontSize: 17, fontWeight: 700, color: "#fff", background: ML.verde, padding: "2px 7px", borderRadius: 3}}>{p.off}</span>
        </div>
        <div style={{fontSize: 17, color: TXT}}>10x R$ 34,90 <span style={{color: ML.verde, fontWeight: 600}}>sem juros</span></div>
        <div style={{marginTop: 14, fontSize: 20, fontWeight: 700, color: ML.verde}}>Chegará grátis hoje</div>
        <div style={{marginTop: 4, fontSize: 15, color: TXT2, display: "flex", gap: 6, alignItems: "center"}}>Armazenado e enviado pelo <Full s={15} /></div>
      </div>
      {/* botões (tamanho e cantos do site: 48 px, raio 6, peso 600, na escala do celular) */}
      <div style={{position: "absolute", left: BOTAO.x, top: BOTAO_Y, width: BOTAO.w}}>
        <div style={{height: BOTAO.h, borderRadius: 8, background: compra < 0.5 ? ML.azul : ML.verde, display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          color: "#fff", fontSize: 21, fontWeight: 600, transform: `scale(${1 + 0.05 * Math.sin(Math.min(1, compra) * Math.PI)})`,
          boxShadow: `0 0 ${24 * brilhoBotao}px rgba(255,214,40,${0.6 * brilhoBotao})`, position: "relative", overflow: "hidden"}}>
          {compra < 0.5 ? (
            <span style={{opacity: 1 - compra * 2}}>Comprar agora</span>
          ) : (
            <>
              <svg width="30" height="30" viewBox="0 0 30 30" style={{opacity: (compra - 0.5) * 2}}>
                <circle cx="15" cy="15" r="14" fill="#fff" />
                <path d="M8.5 15.5l4.2 4.2 8.8-9" fill="none" stroke={ML.verde} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - check} />
              </svg>
              <span style={{opacity: (compra - 0.5) * 2}}>Compra feita</span>
            </>
          )}
        </div>
        <div style={{height: BOTAO.h, borderRadius: 8, marginTop: 12, background: "rgba(65,137,230,0.15)", color: ML.azul, fontSize: 21, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: 1 - 0.6 * Math.min(1, compra)}}>
          Adicionar ao carrinho
        </div>
      </div>
    </div>
  );
};
