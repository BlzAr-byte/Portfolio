import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

/* Camera path */
const KEYS = [
  { p: 0.0, pos: [7, 7.5, 44], look: [0, 3.8, 0] },
  { p: 0.14, pos: [4.5, 5.2, 29], look: [0, 3.1, 0] },
  { p: 0.3, pos: [1.4, 3.4, 17], look: [0, 2.5, 1.5] },
  { p: 0.48, pos: [0, 2.5, 10.2], look: [0, 1.9, 3] },
  { p: 0.62, pos: [0, 1.85, 5.4], look: [0, 1.5, 1.5] },
  { p: 0.72, pos: [0, 1.42, 2.2], look: [0, 1.28, -2.6] },
  { p: 0.84, pos: [0, 1.24, -0.4], look: [0, 1.16, -2.6] },
  { p: 0.93, pos: [0, 1.17, -1.3], look: [0, 1.14, -2.6] },
  { p: 1.0, pos: [0, 1.15, -1.72], look: [0, 1.13, -2.62] },
].map((k) => ({
  ...k,
  posV: new THREE.Vector3(...(k.pos as [number, number, number])),
  lookV: new THREE.Vector3(...(k.look as [number, number, number])),
}));

function CameraRig({ progress }: { progress: { current: number } }) {
  const lookRef = useRef(KEYS[0].lookV.clone());
  const tmpPos = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());
  const fovRef = useRef(50);
  useFrame((state, delta) => {
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    let i = 0;
    while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
    const a = KEYS[i];
    const b = KEYS[i + 1];
    const span = Math.max(0.0001, b.p - a.p);
    const t = THREE.MathUtils.smoothstep(THREE.MathUtils.clamp((p - a.p) / span, 0, 1), 0, 1);
    tmpPos.current.lerpVectors(a.posV, b.posV, t);
    tmpLook.current.lerpVectors(a.lookV, b.lookV, t);
    const k = 1 - Math.exp(-4.2 * delta);
    state.camera.position.lerp(tmpPos.current, k);
    lookRef.current.lerp(tmpLook.current, k);
    state.camera.lookAt(lookRef.current);
    const cam = state.camera as THREE.PerspectiveCamera;
    const targetFov = 50 - THREE.MathUtils.smoothstep(p, 0.88, 1) * 9;
    fovRef.current = THREE.MathUtils.damp(fovRef.current, targetFov, 5, delta);
    if (Math.abs(cam.fov - fovRef.current) > 0.01) {
      cam.fov = fovRef.current;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

function usePrism(width: number, height: number, depth: number) {
  return useMemo(() => {
    const w = width / 2;
    const d = depth / 2;
    const h = height;
    const A = [-w, 0, -d], B = [w, 0, -d], C = [w, 0, d], D = [-w, 0, d];
    const E = [0, h, -d], F = [0, h, d];
    const tris = [[D, C, F], [A, E, B], [A, D, F], [A, F, E], [B, F, C], [B, E, F]];
    const positions = new Float32Array(tris.flat(2));
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.computeVertexNormals();
    return geo;
  }, [width, height, depth]);
}

const WALL = "#d9d0bc";
const ROOF = "#58302f";
const TRIM = "#17130f";

function Roof() {
  const geo = usePrism(8.9, 2.3, 7.0);
  return (
    <mesh geometry={geo} position={[0, 3, 0]}>
      <meshStandardMaterial color={ROOF} roughness={0.9} flatShading />
    </mesh>
  );
}
function FrontWall() {
  return (
    <group position={[0, 0, 3]}>
      <mesh position={[-2.38, 1.5, 0]}>
        <boxGeometry args={[3.24, 3, 0.24]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
      <mesh position={[2.38, 1.5, 0]}>
        <boxGeometry args={[3.24, 3, 0.24]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[1.52, 1, 0.24]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
    </group>
  );
}
function WindowGlow({ position, rotY = 0, w = 1.15, h = 1.15 }: { position: [number, number, number]; rotY?: number; w?: number; h?: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0, 0.012]}>
        <boxGeometry args={[w + 0.2, h + 0.2, 0.024]} />
        <meshStandardMaterial color={TRIM} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.028]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#ffb85c" emissive="#ffab4d" emissiveIntensity={2.4} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[w + 0.16, 0.07, 0.03]} />
        <meshStandardMaterial color={TRIM} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[0.07, h + 0.16, 0.03]} />
        <meshStandardMaterial color={TRIM} />
      </mesh>
    </group>
  );
}
function Door({ progress }: { progress: { current: number } }) {
  const ref = useRef<THREE.Group>(null);
  const open = useRef(0);
  useFrame((_, delta) => {
    const target = THREE.MathUtils.smoothstep(progress.current, 0.52, 0.68);
    open.current = THREE.MathUtils.damp(open.current, target, 5, delta);
    if (ref.current) ref.current.rotation.y = open.current * 1.9;
  });
  return (
    <group ref={ref} position={[-0.72, 1.0, 3.02]}>
      <mesh position={[0.72, 0, 0]}>
        <boxGeometry args={[1.44, 2.0, 0.08]} />
        <meshStandardMaterial color="#6b4a2f" roughness={0.85} />
      </mesh>
      <mesh position={[0.72, 0.35, 0.05]}>
        <boxGeometry args={[1.0, 0.7, 0.02]} />
        <meshStandardMaterial color="#5a3d27" />
      </mesh>
      <mesh position={[0.72, -0.45, 0.05]}>
        <boxGeometry args={[1.0, 0.8, 0.02]} />
        <meshStandardMaterial color="#5a3d27" />
      </mesh>
      <mesh position={[1.24, 0, 0.08]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshStandardMaterial color="#d9a441" roughness={0.35} metalness={0.6} />
      </mesh>
    </group>
  );
}
function LitLantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 1.9, 8]} />
        <meshStandardMaterial color="#1d1a16" />
      </mesh>
      <mesh position={[0, 1.95, 0]}>
        <boxGeometry args={[0.22, 0.26, 0.22]} />
        <meshStandardMaterial color="#2b2119" emissive="#ffb45e" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 1.95, 0]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial color="#ffe0ae" emissive="#ffc06a" emissiveIntensity={3} />
      </mesh>
      <pointLight position={[0, 1.95, 0]} color="#ffb45e" intensity={5} distance={9} decay={2} />
    </group>
  );
}
function Smoke() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const ph = (t * 0.18 + i * 0.27) % 1;
      m.position.set(2.4 + Math.sin((ph + i) * 5) * 0.14, 5.05 + ph * 1.7, 0.8);
      m.scale.setScalar(0.14 + ph * 0.4);
      (m.material as THREE.MeshStandardMaterial).opacity = (1 - ph) * 0.3;
    });
  });
  return (
    <group>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial color="#aeb6c2" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}
function House({ progress }: { progress: { current: number } }) {
  return (
    <group>
      <mesh position={[0, 1.5, -2.88]}>
        <boxGeometry args={[8, 3, 0.24]} />
        <meshStandardMaterial color={WALL} />
      </mesh>
      {[-3.88, 3.88].map((x) => (
        <mesh key={x} position={[x, 1.5, 0]}>
          <boxGeometry args={[0.24, 3, 6]} />
          <meshStandardMaterial color={WALL} />
        </mesh>
      ))}
      <FrontWall />
      <Roof />
      <mesh position={[2.4, 4.35, 0.8]}>
        <boxGeometry args={[0.55, 1.5, 0.55]} />
        <meshStandardMaterial color="#4a3b33" />
      </mesh>
      <Smoke />
      <mesh position={[0, 0.08, 3.55]}>
        <boxGeometry args={[2.6, 0.16, 1.1]} />
        <meshStandardMaterial color="#4c453c" />
      </mesh>
      <mesh position={[0, 2.22, 3.5]}>
        <boxGeometry args={[2.5, 0.1, 1.15]} />
        <meshStandardMaterial color={ROOF} />
      </mesh>
      {[-1.06, 1.06].map((x) => (
        <mesh key={x} position={[x, 1.13, 4.0]}>
          <boxGeometry args={[0.09, 2.26, 0.09]} />
          <meshStandardMaterial color="#3a3129" />
        </mesh>
      ))}
      <LitLantern position={[1.7, 0, 4.3]} />
      <WindowGlow position={[-2.38, 1.7, 3.121]} />
      <WindowGlow position={[2.38, 1.7, 3.121]} />
      <WindowGlow position={[-4.001, 1.7, 0.4]} rotY={-Math.PI / 2} w={1.3} />
      <WindowGlow position={[4.001, 1.7, -0.6]} rotY={Math.PI / 2} w={1.3} />
      <Door progress={progress} />
    </group>
  );
}

/* Interior — much more detailed */
function Room() {
  return (
    <group>
      {/* floor */}
      <mesh position={[0, 0.012, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.6, 5.6]} />
        <meshStandardMaterial color="#3a2a1c" />
      </mesh>
      {/* floorboards overlay */}
      <mesh position={[0, 0.013, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.6, 5.6, 8, 1]} />
        <meshStandardMaterial color="#2f2216" wireframe transparent opacity={0.06} />
      </mesh>
      <mesh position={[0, 0.024, -0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, 1.7]} />
        <meshStandardMaterial color="#4b2420" />
      </mesh>
      <mesh position={[0, 0.025, -0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 1.6]} />
        <meshStandardMaterial color="#3b1e1a" wireframe transparent opacity={0.08} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, 1.5, -2.745]}>
        <planeGeometry args={[7.6, 3]} />
        <meshStandardMaterial color="#241b13" />
      </mesh>
      {/* side walls */}
      {[-3.75, 3.75].map((x) => (
        <mesh key={x} position={[x, 1.5, 0.05]} rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <planeGeometry args={[5.6, 3]} />
          <meshStandardMaterial color="#201812" />
        </mesh>
      ))}
      {/* ceiling */}
      <mesh position={[0, 2.94, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.6, 5.6]} />
        <meshStandardMaterial color="#161009" />
      </mesh>
      {/* baseboards */}
      <mesh position={[0, 0.08, -2.72]}>
        <boxGeometry args={[7.6, 0.12, 0.04]} />
        <meshStandardMaterial color="#1a120c" />
      </mesh>
      {/* posters */}
      <group position={[-2.4, 1.85, -2.74]}>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[1.05, 1.4]} />
          <meshStandardMaterial color="#0e0a14" />
        </mesh>
        <mesh position={[0, 0.12, 0.02]}>
          <planeGeometry args={[0.8, 0.9]} />
          <meshStandardMaterial color="#151021" emissive="#b18cff" emissiveIntensity={0.85} />
        </mesh>
        <mesh position={[0, -0.52, 0.02]}>
          <planeGeometry args={[0.8, 0.12]} />
          <meshStandardMaterial color="#151021" emissive="#6fd6ff" emissiveIntensity={0.9} />
        </mesh>
      </group>
      {/* second frame - blueprint */}
      <group position={[-1.1, 1.92, -2.74]}>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.9, 0.6]} />
          <meshStandardMaterial color="#1d1a12" />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[0.82, 0.52]} />
          <meshStandardMaterial color="#0f1110" emissive="#8affb0" emissiveIntensity={0.22} />
        </mesh>
        {/* blueprint lines */}
        <mesh position={[-0.18, 0.05, 0.03]}>
          <planeGeometry args={[0.4, 0.02]} />
          <meshStandardMaterial color="#0a0f0a" emissive="#46ff9c" emissiveIntensity={0.9} transparent opacity={0.8} />
        </mesh>
        <mesh position={[0.1, -0.08, 0.03]}>
          <planeGeometry args={[0.28, 0.02]} />
          <meshStandardMaterial emissive="#46ff9c" emissiveIntensity={0.6} color="#0a0f0a" transparent opacity={0.7} />
        </mesh>
      </group>
      {/* corkboard */}
      <group position={[1.35, 1.75, -2.735]}>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.3, 0.9]} />
          <meshStandardMaterial color="#5a3b20" roughness={0.9} />
        </mesh>
        <mesh position={[0.1, 0.1, 0.02]}>
          <planeGeometry args={[0.5, 0.35]} />
          <meshStandardMaterial color="#f0e6c2" />
        </mesh>
        <mesh position={[-0.35, 0.05, 0.02]}>
          <planeGeometry args={[0.35, 0.45]} />
          <meshStandardMaterial color="#9fc6ff" />
        </mesh>
        <mesh position={[0.45, -0.2, 0.02]}>
          <planeGeometry args={[0.3, 0.25]} />
          <meshStandardMaterial color="#ffb4a6" />
        </mesh>
        {/* pins */}
        {[[0.2, 0.28], [-0.2, 0.22], [0.55, 0.02]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.03]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshStandardMaterial color={i === 0 ? "#ff5f56" : i === 1 ? "#46ff9c" : "#ffd23d"} emissive={i === 0 ? "#ff5f56" : i === 1 ? "#46ff9c" : "#ffd23d"} emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>

      {/* bookshelf left wall */}
      <group position={[-3.45, 0, -0.4]}>
        {/* sides */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[0.06, 2.2, 0.8]} />
          <meshStandardMaterial color="#3d2c1b" />
        </mesh>
        <mesh position={[0.7, 1.1, 0]}>
          <boxGeometry args={[0.06, 2.2, 0.8]} />
          <meshStandardMaterial color="#3d2c1b" />
        </mesh>
        {/* shelves */}
        {[0.45, 0.95, 1.45, 1.95].map((y) => (
          <mesh key={y} position={[0.35, y, 0]}>
            <boxGeometry args={[0.76, 0.04, 0.82]} />
            <meshStandardMaterial color="#4a3826" />
          </mesh>
        ))}
        {/* books bottom shelf */}
        {[
          { x: -0.05, c: "#7a3030" },
          { x: 0.08, c: "#2c4a56" },
          { x: 0.20, c: "#b18cff" },
          { x: 0.32, c: "#ff5f56" },
          { x: 0.45, c: "#ffd23d" },
          { x: 0.57, c: "#46ff9c" },
        ].map((b, i) => (
          <mesh key={i} position={[b.x, 0.63, 0.05]}>
            <boxGeometry args={[0.08, 0.32, 0.22]} />
            <meshStandardMaterial color={b.c} roughness={0.8} />
          </mesh>
        ))}
        {/* middle shelf crates */}
        <mesh position={[0.15, 1.12, 0]}>
          <boxGeometry args={[0.28, 0.26, 0.28]} />
          <meshStandardMaterial color="#6b543d" />
        </mesh>
        <mesh position={[0.5, 1.15, 0.05]}>
          <boxGeometry args={[0.18, 0.32, 0.2]} />
          <meshStandardMaterial color="#d9d0bc" />
        </mesh>
        {/* top shelf plant */}
        <mesh position={[0.35, 2.15, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.16, 8]} />
          <meshStandardMaterial color="#2e4a2e" />
        </mesh>
        <mesh position={[0.35, 2.28, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#3f8a4a" />
        </mesh>
      </group>

      {/* side table with big plant */}
      <group position={[-3.1, 0, -2.1]}>
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.5, 0.84, 0.5]} />
          <meshStandardMaterial color="#2f2115" />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.14, 0.16, 0.18, 10]} />
          <meshStandardMaterial color="#1f3520" />
        </mesh>
        <mesh position={[0, 1.05, 0]}>
          <sphereGeometry args={[0.22, 10, 10]} />
          <meshStandardMaterial color="#2a6a35" emissive="#2a6a35" emissiveIntensity={0.18} />
        </mesh>
        <mesh position={[0.08, 1.22, 0.05]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#3a8a46" />
        </mesh>
      </group>

      {/* cable snake on floor */}
      <mesh position={[0.6, 0.02, -1.6]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[1.2, 0.02, 0.02]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[1.1, 0.02, -1.2]} rotation={[0, 0.6, 0]}>
        <boxGeometry args={[0.6, 0.02, 0.02]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* ceiling pendant */}
      <group position={[0, 2.7, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
          <meshStandardMaterial color="#0f0f0f" />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <coneGeometry args={[0.18, 0.18, 12, 1, true]} />
          <meshStandardMaterial color="#111" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#ffdab0" emissive="#ffb86a" emissiveIntensity={2.8} />
        </mesh>
        <pointLight position={[0, -0.32, 0]} intensity={1.6} color="#ffb86a" distance={5} decay={2} />
      </group>

      <pointLight position={[0, 1.9, 0.6]} color="#ff9c4d" intensity={3.2} distance={9} decay={2} />
      <pointLight position={[0, 2.4, 0]} color="#ffc691" intensity={1.4} distance={6} decay={2} />
    </group>
  );
}

function Laptop() {
  const screenMat = useRef<THREE.MeshStandardMaterial>(null);
  const lineMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const lineWidths = [0.66, 0.42, 0.56, 0.32, 0.5];
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (screenMat.current) {
      screenMat.current.emissiveIntensity = 1.5 + Math.sin(t * 11) * 0.07 + Math.sin(t * 3.3) * 0.05;
    }
    lineMats.current.forEach((m, i) => {
      if (m) m.opacity = 0.45 + 0.4 * Math.max(0, Math.sin(t * 1.6 + i * 1.1));
    });
  });
  return (
    <group position={[0, 0.795, -2.34]}>
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[1.05, 0.05, 0.68]} />
        <meshStandardMaterial color="#181a1c" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.052, -0.02]}>
        <planeGeometry args={[0.8, 0.4]} />
        <meshStandardMaterial color="#101315" />
      </mesh>
      <group position={[0, 0.05, -0.32]} rotation={[-0.16, 0, 0]}>
        <mesh position={[0, 0.345, 0]}>
          <boxGeometry args={[1.05, 0.72, 0.035]} />
          <meshStandardMaterial color="#111315" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.345, 0.02]}>
          <planeGeometry args={[0.95, 0.62]} />
          <meshStandardMaterial ref={screenMat} color="#071510" emissive="#46ff9c" emissiveIntensity={1.5} />
        </mesh>
        {lineWidths.map((w, i) => (
          <mesh key={i} position={[-(0.95 / 2) + 0.08 + w / 2, 0.52 - i * 0.1, 0.032]}>
            <planeGeometry args={[w, 0.04]} />
            <meshStandardMaterial
              ref={(el) => { lineMats.current[i] = el; }}
              color="#08130c"
              emissive={i % 2 ? "#6fd6ff" : "#c9ffd9"}
              emissiveIntensity={1.3}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>
      <pointLight position={[0, 0.45, -0.05]} color="#46ff9c" intensity={1.6} distance={2.8} decay={2} />
    </group>
  );
}

function Chair() {
  return (
    <group position={[0, 0, -1.35]}>
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.55, 0.06, 0.55]} />
        <meshStandardMaterial color="#121212" />
      </mesh>
      <mesh position={[0, 0.7, -0.26]}>
        <boxGeometry args={[0.55, 0.5, 0.06]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {[[-0.24, 0.16], [0.24, 0.16], [-0.24, -0.16], [0.24, -0.16]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.19, z]}>
          <cylinderGeometry args={[0.025, 0.025, 0.38, 6]} />
          <meshStandardMaterial color="#0f0f0f" />
        </mesh>
      ))}
    </group>
  );
}

function Desk() {
  return (
    <group>
      <mesh position={[0, 0.75, -2.32]}>
        <boxGeometry args={[2.3, 0.08, 0.85]} />
        <meshStandardMaterial color="#5a4128" roughness={0.85} />
      </mesh>
      {[-1.05, 1.05].map((x) =>
        [-2.64, -2.0].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.36, z]}>
            <boxGeometry args={[0.07, 0.72, 0.07]} />
            <meshStandardMaterial color="#3d2c1b" />
          </mesh>
        ))
      )}
      {/* lamp */}
      <group position={[0.82, 0.79, -2.42]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.09, 0.11, 0.04, 12]} />
          <meshStandardMaterial color="#202226" />
        </mesh>
        <mesh position={[0, 0.16, 0]} rotation={[0, 0, -0.25]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#202226" />
        </mesh>
        <mesh position={[-0.05, 0.33, 0]} rotation={[0, 0, 0.5]}>
          <coneGeometry args={[0.12, 0.16, 14, 1, true]} />
          <meshStandardMaterial color="#c96a2c" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.06, 0.3, 0]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color="#ffd9a8" emissive="#ffbe6e" emissiveIntensity={3.2} />
        </mesh>
        <pointLight position={[-0.06, 0.3, 0]} color="#ffbe6e" intensity={1.8} distance={3} decay={2} />
      </group>
      {/* mug */}
      <mesh position={[-0.72, 0.86, -2.27]}>
        <cylinderGeometry args={[0.055, 0.05, 0.14, 12]} />
        <meshStandardMaterial color="#33586b" />
      </mesh>
      {/* external keyboard */}
      <mesh position={[0.05, 0.805, -1.95]}>
        <boxGeometry args={[0.9, 0.02, 0.32]} />
        <meshStandardMaterial color="#0e0e0e" />
      </mesh>
      {/* mouse */}
      <mesh position={[0.62, 0.805, -1.96]}>
        <boxGeometry args={[0.12, 0.03, 0.18]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* sticky notes */}
      <mesh position={[0.92, 0.805, -2.12]}>
        <planeGeometry args={[0.18, 0.18]} />
        <meshStandardMaterial color="#ffe97a" />
      </mesh>
      <mesh position={[0.92, 0.806, -2.12]}>
        <planeGeometry args={[0.14, 0.02]} />
        <meshStandardMaterial color="#111" emissive="#111" />
      </mesh>
      {/* book stack + headphones */}
      <mesh position={[-0.38, 0.815, -2.54]}>
        <boxGeometry args={[0.3, 0.035, 0.22]} />
        <meshStandardMaterial color="#7a3030" />
      </mesh>
      <mesh position={[-0.37, 0.85, -2.52]}>
        <boxGeometry args={[0.26, 0.035, 0.2]} />
        <meshStandardMaterial color="#2c4a56" />
      </mesh>
      <mesh position={[-0.72, 0.81, -2.02]}>
        <torusGeometry args={[0.10, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#151515" />
      </mesh>
      <Laptop />
      <Chair />
    </group>
  );
}

const TREES: [number, number, number][] = [
  [-6.5, 8, 2.1], [6.8, 10, 1.4], [-8, 16, 0.9], [8.5, 20, 2.6],
  [-5.2, 20, 1.1], [5.6, 26, 1.8], [-9, 26, 1.5], [9.2, 6, 1.2],
  [-7.5, -4, 1.6], [7.8, -6, 1.0], [-4.6, -8, 1.3], [4.9, -10, 1.7],
];
function Woods() {
  return (
    <group>
      {TREES.map(([x, z, s], i) => (
        <group key={i} position={[x, 0, z]} scale={s} rotation={[0, (i * 1.7) % Math.PI, 0]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.13, 0.19, 0.8, 7]} />
            <meshStandardMaterial color="#16100a" />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <coneGeometry args={[0.95, 2.3, 8]} />
            <meshStandardMaterial color="#101d12" flatShading />
          </mesh>
          <mesh position={[0, 2.5, 0]}>
            <coneGeometry args={[0.55, 1.5, 8]} />
            <meshStandardMaterial color="#142417" flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}
function Environment() {
  return (
    <group>
      <color attach="background" args={["#05070c"]} />
      <fog attach="fog" args={["#05070c", 24, 95]} />
      <ambientLight intensity={0.22} color="#8fa1c7" />
      <hemisphereLight args={["#28334f", "#0a0d08", 0.55]} />
      <directionalLight position={[-18, 24, -12]} intensity={0.6} color="#9fb8ff" />
      <Stars radius={130} depth={45} count={2400} factor={3.2} saturation={0} fade speed={0.6} />
      <mesh position={[-18, 17, -34]}>
        <sphereGeometry args={[2.2, 24, 24]} />
        <meshStandardMaterial color="#f5f3e6" emissive="#f0ecd9" emissiveIntensity={1.6} />
      </mesh>
      <Sparkles count={36} scale={[26, 7, 34]} position={[0, 3, 12]} size={2.4} speed={0.35} color="#46ff9c" opacity={0.45} />
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[420, 420]} />
        <meshStandardMaterial color="#0a0f0a" />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[10.5, 12, 0.2, 28]} />
        <meshStandardMaterial color="#0c120b" />
      </mesh>
      <mesh position={[0, 0.022, 23]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.7, 40]} />
        <meshStandardMaterial color="#181d13" />
      </mesh>
      <Woods />
    </group>
  );
}

export function HouseScene({ progress, active }: { progress: { current: number }; active: boolean }) {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{ pointerEvents: "none", opacity: active ? 1 : 0, visibility: active ? "visible" : "hidden", transition: "opacity 300ms ease" }}
      aria-hidden="true"
    >
      <Canvas dpr={[1, 1.8]} gl={{ antialias: true, powerPreference: "high-performance" }} camera={{ fov: 50, near: 0.1, far: 320, position: [7, 7.5, 44] }} frameloop={active ? "always" : "never"}>
        <Environment />
        <House progress={progress} />
        <Room />
        <Desk />
        <CameraRig progress={progress} />
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur intensity={0.95} luminanceThreshold={0.58} luminanceSmoothing={0.15} />
          <Noise opacity={0.055} />
          <Vignette eskil={false} offset={0.22} darkness={0.62} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
