// Comercial conceito do Mercado Livre (16:9, 30 qps). "ml-filme" é o filme inteiro; "ml-cena1" é só o gancho do logo.
import React from "react";
import {Composition} from "remotion";
import {CENA1_FRAMES, Cena1} from "./projects/mercado-livre/Cena1.tsx";
import {FILME_FRAMES, Filme} from "./projects/mercado-livre/Filme.tsx";

export const Raiz: React.FC = () => (
  <>
    <Composition id="ml-filme" component={Filme} width={1920} height={1080} fps={30} durationInFrames={FILME_FRAMES} />
    <Composition id="ml-cena1" component={Cena1} width={1920} height={1080} fps={30} durationInFrames={CENA1_FRAMES} />
  </>
);
