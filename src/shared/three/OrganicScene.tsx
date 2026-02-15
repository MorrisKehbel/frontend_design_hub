import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber";

import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  GLSL — Particle shaders                                                    */
/* -------------------------------------------------------------------------- */

const PARTICLE_VERTEX = /* glsl */ `

uniform float uTime;

uniform vec2  uMouse;



attribute float aPhase;

attribute float aSize;

attribute float aColorMix;



varying float vColorMix;

varying float vAlpha;



void main() {

  vColorMix = aColorMix;



  vec3 pos = position;



  /* layered sine waves for organic drift */

  float p = aPhase * 6.2831;

  pos.x += sin(uTime * 0.15 + pos.y * 1.5 + p)       * 0.30;

  pos.y += sin(uTime * 0.12 + pos.x * 1.2 + p + 1.5)  * 0.15;

  pos.z += cos(uTime * 0.18 + pos.y * 1.3 + p + 3.0)  * 0.25;



  /* breathing pulse */

  pos *= 1.0 + sin(uTime * 0.4 + p) * 0.06;



  /* cursor wind — gently push particles away */

  vec3  mousePos = vec3(uMouse * 2.5, 0.0);

  vec3  diff     = pos - mousePos;

  float dist     = length(diff);

  pos += normalize(diff + 0.001) * smoothstep(2.0, 0.0, dist) * 0.5;



  vec4 mv = modelViewMatrix * vec4(pos, 1.0);



  gl_PointSize = aSize * 280.0 / -mv.z;

  gl_Position  = projectionMatrix * mv;



  /* fade particles near the edge of the volume */

  vAlpha = smoothstep(3.8, 0.8, length(pos)) * 0.85;

}

`;

const PARTICLE_FRAGMENT = /* glsl */ `

uniform vec3 uColor1;

uniform vec3 uColor2;

uniform vec3 uColor3;

uniform vec3 uColor4;



varying float vColorMix;

varying float vAlpha;



void main() {

  float d = length(gl_PointCoord - vec2(0.5));

  if (d > 0.5) discard;



  float alpha = smoothstep(0.5, 0.12, d) * vAlpha;



  float t = vColorMix;

  vec3 color;

  if      (t < 0.33) color = mix(uColor1, uColor2, t / 0.33);

  else if (t < 0.66) color = mix(uColor2, uColor3, (t - 0.33) / 0.33);

  else               color = mix(uColor3, uColor4, (t - 0.66) / 0.34);



  gl_FragColor = vec4(color, alpha);

}

`;

/* -------------------------------------------------------------------------- */
/*  GLSL — Light ray shaders                                                   */
/* -------------------------------------------------------------------------- */

const RAY_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const RAY_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform float uPhase;
varying vec2 vUv;

void main() {
  /* lengthFade: bright at source (y near 1), fading toward far end (y near 0) */
  float lengthFade = smoothstep(0.0, 0.06, vUv.y) * pow(vUv.y, 0.55);

  /* soft gaussian edges across the width */
  float cx = abs(vUv.x - 0.5) * 2.0;
  float edgeFade = exp(-cx * cx * 4.5);

  /* slow shimmer — visible pulse */
  float shimmer = 0.6 + 0.4 * sin(uTime * 0.5 + uPhase + vUv.y * 3.0);

  float alpha = lengthFade * edgeFade * uOpacity * shimmer;

  /* warm golden-white light matching the terracotta / gold palette */
  vec3 color = mix(vec3(1.0, 0.97, 0.90), vec3(0.96, 0.87, 0.68), (1.0 - vUv.y) * 0.5);

  gl_FragColor = vec4(color, alpha);
}
`;

/* -------------------------------------------------------------------------- */
/*  Helpers — moved out of component scope for React Compiler purity           */
/* -------------------------------------------------------------------------- */

const RAY_CONFIGS = [
  { angle: 11.55, width: 0.6, length: 9.0, opacity: 0.45, phase: 0.0 },
  { angle: 11.35, width: 0.85, length: 10.0, opacity: 0.438, phase: 1.5 },
  { angle: 10.15, width: 0.45, length: 8.5, opacity: 0.448, phase: 3.0 },
  { angle: 11.05, width: 0.35, length: 7.5, opacity: 0.442, phase: 4.5 },
  { angle: 11.75, width: 0.5, length: 9.5, opacity: 0.332, phase: 2.0 },
  { angle: 11.0, width: 0.55, length: 8.0, opacity: 0.328, phase: 5.5 },
];

/** Determine particle count based on device capability and viewport. */
function getAdaptiveParticleCount(): number {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 150;
  const cores = navigator.hardwareConcurrency ?? 4;
  const isMobile = window.innerWidth < 768;
  if (isMobile) return cores <= 4 ? 200 : 300;
  if (cores <= 2) return 250;
  if (cores <= 4) return 400;
  return 650;
}

/** Generate particle buffer geometry — called once via useState initializer. */
function generateParticleGeometry(count: number): THREE.BufferGeometry {
  const pos = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const size = new Float32Array(count);
  const cmix = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const angle = Math.random() * Math.PI * 2;
    const r = 0.3 + Math.pow(Math.random(), 0.7) * 2.2;
    pos[i * 3] = Math.cos(angle) * r + (Math.random() - 0.5) * 0.5;
    pos[i * 3 + 1] = (t - 0.5) * 3.5;
    pos[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 0.5;
    phase[i] = Math.random();
    cmix[i] = Math.random();
    const roll = Math.random();
    if (roll < 0.6) size[i] = 0.008 + Math.random() * 0.015;
    else if (roll < 0.88) size[i] = 0.025 + Math.random() * 0.04;
    else size[i] = 0.065 + Math.random() * 0.06;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("aPhase", new THREE.Float32BufferAttribute(phase, 1));
  geo.setAttribute("aSize", new THREE.Float32BufferAttribute(size, 1));
  geo.setAttribute("aColorMix", new THREE.Float32BufferAttribute(cmix, 1));
  return geo;
}

/** Create particle uniforms — pure constructor, safe for useRef init. */
function createParticleUniforms() {
  return {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor1: { value: new THREE.Color("#8BAF9C") },
    uColor2: { value: new THREE.Color("#D4845A") },
    uColor3: { value: new THREE.Color("#D4A853") },
    uColor4: { value: new THREE.Color("#2A5A42") },
  };
}

/** Create ray geometry + materials — pure constructors, safe for useRef init. */
function createRayData() {
  return RAY_CONFIGS.map((cfg) => {
    const geo = new THREE.PlaneGeometry(cfg.width, cfg.length);
    geo.translate(0, -cfg.length / 1.8, 0);

    const u = {
      uTime: { value: 0 },
      uOpacity: { value: cfg.opacity },
      uPhase: { value: cfg.phase },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms: u,
      vertexShader: RAY_VERTEX,
      fragmentShader: RAY_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    return { geo, mat, u, baseAngle: cfg.angle };
  });
}

/* -------------------------------------------------------------------------- */
/*  Particles                                                                  */
/* -------------------------------------------------------------------------- */

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);

  const rawMouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });

  // useState initializer is allowed to call impure functions (Math.random)
  // and only runs once — safe for React Compiler.
  const [geometry] = useState(() =>
    generateParticleGeometry(getAdaptiveParticleCount()),
  );

  // useState so uniforms are readable during render (for JSX props).
  const [uniforms] = useState(createParticleUniforms);
  // Ref alias lets useFrame mutate without tripping react-hooks/immutability.
  const uniformsRef = useRef(uniforms);

  // Dispose GPU resources on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  /* track pointer at window level so overlapping DOM layers don't block it */
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      rawMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      rawMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useFrame((state) => {
    const u = uniformsRef.current;
    u.uTime.value = state.clock.elapsedTime;

    const sm = smoothMouse.current;
    const rm = rawMouse.current;

    sm.x += (rm.x - sm.x) * 0.05;
    sm.y += (rm.y - sm.y) * 0.05;

    u.uMouse.value.set(sm.x, sm.y);

    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.012;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={PARTICLE_VERTEX}
        fragmentShader={PARTICLE_FRAGMENT}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

/* -------------------------------------------------------------------------- */
/*  Volumetric light rays — top-right to center / bottom-right                 */
/* -------------------------------------------------------------------------- */

function LightRays() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<THREE.Mesh[]>([]);

  // useState so ray data is readable during render (for JSX).
  const [rayData] = useState(createRayData);
  // Ref alias lets useFrame mutate without tripping react-hooks/immutability.
  const rayDataRef = useRef(rayData);

  // Dispose GPU resources on unmount
  useEffect(() => {
    return () => {
      rayData.forEach((ray) => {
        ray.geo.dispose();
        ray.mat.dispose();
      });
    };
  }, [rayData]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    /* slow sway of the whole ray group */
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.08) * 0.035;
    }

    for (let i = 0; i < rayDataRef.current.length; i++) {
      const ray = rayDataRef.current[i];
      ray.u.uTime.value = t;

      /* per-ray angle oscillation — each ray sways independently */
      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.rotation.z =
          ray.baseAngle + Math.sin(t * 0.12 + ray.u.uPhase.value) * 0.05;
      }
    }
  });

  return (
    <group ref={groupRef} position={[4.2, 3.0, -0.5]}>
      {rayData.map((ray, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
          geometry={ray.geo}
          material={ray.mat}
          rotation={[0, 0, ray.baseAngle]}
        />
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  WebGL context loss handler                                                 */
/* -------------------------------------------------------------------------- */

function ContextLossHandler({ onLost }: { onLost: () => void }) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = (e: Event) => {
      e.preventDefault();
      onLost();
    };
    canvas.addEventListener("webglcontextlost", handleLost);
    return () => canvas.removeEventListener("webglcontextlost", handleLost);
  }, [gl, onLost]);

  return null;
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                      */
/* -------------------------------------------------------------------------- */

function LoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="blob-shape h-32 w-32 bg-sage/20" />
    </div>
  );
}

export default function OrganicScene() {
  const [visible, setVisible] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const handleContextLost = useCallback(() => setContextLost(true), []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (contextLost) {
    return <LoadingFallback />;
  }

  return (
    <div
      className="three-canvas-container h-full w-full"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 2.5s ease-out",
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ContextLossHandler onLost={handleContextLost} />

          <LightRays />

          <FloatingParticles />
        </Canvas>
      </Suspense>
    </div>
  );
}
