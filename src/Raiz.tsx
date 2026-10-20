// Comercial conceito do Mercado Livre (16:9, 30 qps).
import React from "react";
import {Composition, Sequence} from "remotion";
import {CENA1_FRAMES, Cena1} from "./projects/mercado-livre/Cena1";
import {FILME_FRAMES, Filme} from "./projects/mercado-livre/Filme";

export const Bloco1: React.FC = () => (
  <Sequence from={0} durationInFrames={180}>
    <Filme />
  </Sequence>
);

export const Bloco2: React.FC = () => (
  <Sequence from={-177} durationInFrames={110}>
    <Filme />
  </Sequence>
);

export const Bloco3: React.FC = () => (
  <Sequence from={-287} durationInFrames={100}>
    <Filme />
  </Sequence>
);

export const Bloco4: React.FC = () => (
  <Sequence from={-387} durationInFrames={214}>
    <Filme />
  </Sequence>
);

export const Raiz: React.FC = () => (
  <>
    <Composition id="ml-filme" component={Filme} width={1920} height={1080} fps={30} durationInFrames={FILME_FRAMES} />
    <Composition id="ml-cena1" component={Cena1} width={1920} height={1080} fps={30} durationInFrames={CENA1_FRAMES} />
    <Composition id="bloco-1" component={Bloco1} width={1920} height={1080} fps={30} durationInFrames={180} />
    <Composition id="bloco-2" component={Bloco2} width={1920} height={1080} fps={30} durationInFrames={110} />
    <Composition id="bloco-3" component={Bloco3} width={1920} height={1080} fps={30} durationInFrames={100} />
    <Composition id="bloco-4" component={Bloco4} width={1920} height={1080} fps={30} durationInFrames={214} />
  </>
);
