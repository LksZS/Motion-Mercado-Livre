// Mapa 3D de ruas (cena 5), como o da ref da Amazon mas claro, nas cores do ML:
// quarteirões brancos, ruas brancas sobre chão cinza-claro, rota amarela que se desenha e
// uma cabeça de luz que corre na frente. Three.js via @remotion/three. Unidades: 1 = uma quadra. Chão no plano XZ.
import React, {useMemo} from "react";
import * as THREE from "three";
import {useThree} from "@react-three/fiber";
import {random} from "remotion";

// rota pelas ruas (x, z) e comprimento total
export const ROTA: [number, number][] = [[-5, 3], [-2, 3], [-2, 1], [1, 1], [1, -2], [4, -2]];
const SEG = ROTA.slice(1).map((b, i) => {
  const a = ROTA[i];
  return {a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1])};
});
export const ROTA_LEN = SEG.reduce((s, x) => s + x.len, 0);
export const pontoNaRota = (d: number): [number, number] => {
  let r = Math.max(0, Math.min(ROTA_LEN, d));
  for (const s of SEG) {
    if (r <= s.len) return [s.a[0] + ((s.b[0] - s.a[0]) * r) / s.len, s.a[1] + ((s.b[1] - s.a[1]) * r) / s.len];
    r -= s.len;
  }
  return ROTA[ROTA.length - 1];
};

export type CamMapa = {pos: [number, number, number]; alvo: [number, number, number]; fov: number};
export const cameraThree = (c: CamMapa, w: number, h: number) => {
  const cam = new THREE.PerspectiveCamera(c.fov, w / h, 0.05, 200);
  cam.position.set(...c.pos);
  cam.up.set(0, 1, 0);
  if (Math.abs(c.pos[0] - c.alvo[0]) < 1e-4 && Math.abs(c.pos[2] - c.alvo[2]) < 1e-4) cam.up.set(0, 0, -1);
  cam.lookAt(...c.alvo);
  cam.updateMatrixWorld();
  cam.updateProjectionMatrix();
  return cam;
};
export const projeta = (c: CamMapa, w: number, h: number, p: [number, number, number]) => {
  const v = new THREE.Vector3(...p).project(cameraThree(c, w, h));
  return {x: ((v.x + 1) / 2) * w, y: ((1 - v.y) / 2) * h};
};

const Camera: React.FC<{c: CamMapa}> = ({c}) => {
  const {camera, size} = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  cam.fov = c.fov;
  cam.aspect = size.width / size.height;
  cam.position.set(...c.pos);
  cam.up.set(0, 1, 0);
  if (Math.abs(c.pos[0] - c.alvo[0]) < 1e-4 && Math.abs(c.pos[2] - c.alvo[2]) < 1e-4) cam.up.set(0, 0, -1);
  cam.lookAt(...c.alvo);
  cam.updateProjectionMatrix();
  return null;
};

const N = 13; // quadras de -N a N
const Cidade: React.FC = () => {
  const {predios, mat, matTopo} = useMemo(() => {
    const lista: {x: number; z: number; w: number; d: number; h: number}[] = [];
    for (let i = -N; i < N; i++) for (let j = -N; j < N; j++) {
      // cada quadra (entre ruas) recebe de 2×2 a 3×3 prédios
      const n = random(`n${i},${j}`) > 0.55 ? 3 : 2;
      const m = 0.84, cel = m / n;
      for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
        if (random(`v${i},${j},${a},${b}`) < 0.07) continue; // praça ou terreno vazio
        const alto = random(`h${i},${j},${a},${b}`);
        const h = 0.06 + Math.pow(alto, 2.6) * 0.42;
        lista.push({x: i + 0.5 - m / 2 + cel * (a + 0.5), z: j + 0.5 - m / 2 + cel * (b + 0.5), w: cel * 0.86, d: cel * 0.86, h});
      }
    }
    const mat = new THREE.MeshStandardMaterial({color: "#e4e7ec", roughness: 0.85, metalness: 0});
    const matTopo = new THREE.MeshStandardMaterial({color: "#ffffff", roughness: 0.8, metalness: 0});
    return {predios: lista, mat, matTopo};
  }, []);
  const caixa = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const inst = useMemo(() => {
    const im = new THREE.InstancedMesh(caixa, [mat, mat, matTopo, mat, mat, mat] as unknown as THREE.Material, predios.length);
    const m4 = new THREE.Matrix4();
    predios.forEach((p, i) => {
      m4.compose(new THREE.Vector3(p.x, p.h / 2, p.z), new THREE.Quaternion(), new THREE.Vector3(p.w, p.h, p.d));
      im.setMatrixAt(i, m4);
    });
    im.instanceMatrix.needsUpdate = true;
    return im;
  }, [caixa, mat, matTopo, predios]);
  // ruas: linhas claras no chão (avenidas a cada 4 quadras, mais largas)
  const ruas = useMemo(() => {
    const g: React.ReactNode[] = [];
    for (let k = -N; k <= N; k++) {
      const av = k % 4 === 0;
      const lw = av ? 0.11 : 0.06, op = 1;
      g.push(<mesh key={`x${k}`} position={[0, 0.002, k]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2 * N, lw]} /><meshBasicMaterial color="#ffffff" transparent opacity={op} /></mesh>);
      g.push(<mesh key={`z${k}`} position={[k, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[lw, 2 * N]} /><meshBasicMaterial color="#ffffff" transparent opacity={op} /></mesh>);
    }
    return g;
  }, []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2 * N + 4, 2 * N + 4]} /><meshStandardMaterial color="#cdd2d9" roughness={0.95} /></mesh>
      {ruas}
      <primitive object={inst} />
    </group>
  );
};

// rota: trechos já percorridos em amarelo (núcleo + brilho largo) e a cabeça de luz
const Rota: React.FC<{d: number}> = ({d}) => {
  const partes: React.ReactNode[] = [];
  let r = d;
  SEG.forEach((s, i) => {
    if (r <= 0) return;
    const l = Math.min(s.len, r);
    r -= l;
    const dx = (s.b[0] - s.a[0]) / s.len, dz = (s.b[1] - s.a[1]) / s.len;
    const cx = s.a[0] + (dx * l) / 2, cz = s.a[1] + (dz * l) / 2;
    const horiz = Math.abs(dx) > 0.5;
    const dim = (w: number): [number, number, number] => (horiz ? [l + w, 0.025, w] : [w, 0.025, l + w]);
    partes.push(
      <group key={i}>
        <mesh position={[cx, 0.034, cz]}><boxGeometry args={dim(0.1)} /><meshBasicMaterial color="#FFD100" toneMapped={false} /></mesh>
        <mesh position={[cx, 0.028, cz]}><boxGeometry args={dim(0.15)} /><meshBasicMaterial color="#E0A800" toneMapped={false} /></mesh>
        <mesh position={[cx, 0.012, cz]}><boxGeometry args={dim(0.42)} /><meshBasicMaterial color="#FFD100" transparent opacity={0.22} toneMapped={false} depthWrite={false} /></mesh>
      </group>,
    );
  });
  const [hx, hz] = pontoNaRota(d);
  return (
    <group>
      {partes}
      {d > 0 && (
        <group position={[hx, 0.06, hz]}>
          <mesh><sphereGeometry args={[0.075, 20, 20]} /><meshBasicMaterial color="#FFFFFF" toneMapped={false} /></mesh>
          <mesh><sphereGeometry args={[0.12, 20, 20]} /><meshBasicMaterial color="#FFD100" toneMapped={false} /></mesh>
          <mesh><sphereGeometry args={[0.24, 20, 20]} /><meshBasicMaterial color="#FFD100" transparent opacity={0.3} toneMapped={false} depthWrite={false} /></mesh>
          <pointLight color="#FFD100" intensity={2.2} distance={2.6} decay={1.6} position={[0, 0.25, 0]} />
        </group>
      )}
    </group>
  );
};

export const Mapa: React.FC<{c: CamMapa; d: number; luzFim: number}> = ({c, d, luzFim}) => {
  const [ex, ez] = ROTA[ROTA.length - 1];
  return (
    <>
      <Camera c={c} />
      <color attach="background" args={["#eef0f3"]} />
      <fog attach="fog" args={["#eef0f3", 9, 19]} />
      <ambientLight intensity={1.1} />
      <hemisphereLight args={["#ffffff", "#c9ced6", 0.9]} />
      <directionalLight position={[-4, 8, 5]} intensity={1.6} color="#ffffff" />
      <Cidade />
      <Rota d={d} />
      {luzFim > 0 && <pointLight color="#FFD100" intensity={3 * luzFim} distance={3.5} decay={1.5} position={[ex, 0.5, ez]} />}
    </>
  );
};
