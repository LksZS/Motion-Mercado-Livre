import React from "react";
import {Audio, Sequence, staticFile} from "remotion";

export const EfeitosSonoros: React.FC = () => {
  return (
    <>
      {/* Cena 1: Gancho - risco de luz desenha contorno */}
      <Sequence from={2} durationInFrames={40}>
        <Audio src={staticFile("sfx/risco-luz.mp3")} volume={0.7} />
      </Sequence>

      {/* Cena 1: Logo acende com brilho na batida */}
      <Sequence from={45} durationInFrames={45}>
        <Audio src={staticFile("sfx/logo-acende.mp3")} volume={0.85} />
      </Sequence>

      {/* Cena 2: Transição da câmera descendo até o celular */}
      <Sequence from={72} durationInFrames={30}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.6} />
      </Sequence>

      {/* Cena 2: Digitação rápida no campo de busca */}
      <Sequence from={95} durationInFrames={10}>
        <Audio src={staticFile("sfx/digitacao.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={102} durationInFrames={10}>
        <Audio src={staticFile("sfx/digitacao.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={109} durationInFrames={10}>
        <Audio src={staticFile("sfx/digitacao.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={116} durationInFrames={10}>
        <Audio src={staticFile("sfx/digitacao.mp3")} volume={0.45} />
      </Sequence>

      {/* Cena 2: Grade de produtos surge com halo */}
      <Sequence from={137} durationInFrames={20}>
        <Audio src={staticFile("sfx/carimbo-caixa.mp3")} volume={0.45} />
      </Sequence>

      {/* Cena 3: Câmera mergulha no 1º fone (transição para a página do produto) */}
      <Sequence from={177} durationInFrames={30}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>

      {/* Cena 3: Risco de luz contorna o botão "Comprar agora" */}
      <Sequence from={240} durationInFrames={30}>
        <Audio src={staticFile("sfx/risco-luz.mp3")} volume={0.6} />
      </Sequence>

      {/* Cena 4: Botão vira "Compra feita" (punch / check de compra) */}
      <Sequence from={260} durationInFrames={35}>
        <Audio src={staticFile("sfx/check-compra.mp3")} volume={0.9} />
      </Sequence>

      {/* Cena 5: Risco sai do check e câmera recua para o mapa 3D */}
      <Sequence from={287} durationInFrames={30}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>

      {/* Cena 5: Rota avançando pelas ruas */}
      <Sequence from={311} durationInFrames={20}>
        <Audio src={staticFile("sfx/rota-passo.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={335} durationInFrames={20}>
        <Audio src={staticFile("sfx/rota-passo.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={360} durationInFrames={20}>
        <Audio src={staticFile("sfx/rota-passo.mp3")} volume={0.45} />
      </Sequence>

      {/* Cena 6: Câmera mergulha no destino (caixa na porta) */}
      <Sequence from={387} durationInFrames={30}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>

      {/* Cena 6: Risco dá a volta na caixa */}
      <Sequence from={405} durationInFrames={25}>
        <Audio src={staticFile("sfx/risco-luz.mp3")} volume={0.5} />
      </Sequence>

      {/* Cena 6: Símbolo fica impresso na caixa */}
      <Sequence from={418} durationInFrames={20}>
        <Audio src={staticFile("sfx/carimbo-caixa.mp3")} volume={0.65} />
      </Sequence>

      {/* Cena 6: Notificação "Entregue" desce */}
      <Sequence from={425} durationInFrames={30}>
        <Audio src={staticFile("sfx/notificacao.mp3")} volume={0.8} />
      </Sequence>

      {/* Cena 7: Transição para a assinatura da marca */}
      <Sequence from={457} durationInFrames={35}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} />
      </Sequence>

      {/* Cena 7: Fechamento suave da assinatura */}
      <Sequence from={528} durationInFrames={60}>
        <Audio src={staticFile("sfx/assinatura.mp3")} volume={0.7} />
      </Sequence>
    </>
  );
};
