"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import type { LonelinessPose } from "@/lib/types";

type Scene3DProps = {
  peopleCount: number;
  supportLevel: number;
  wellbeing: number;
  wellbeingColor: string;
  pose: LonelinessPose;
};

type NeutralPersonProps = {
  index: number;
  active: boolean;
  central?: boolean;
  target: [number, number, number];
  pose?: LonelinessPose;
  color: string;
  reducedMotion: boolean;
};

const OUTSIDE_POSITIONS: [number, number, number][] = [
  [-11.5, 0, -6.5],
  [11.5, 0, -6.5],
  [-12, 0, 0],
  [12, 0, 0],
  [-11, 0, 7.5],
  [11, 0, 7.5],
  [-5.5, 0, -9],
  [5.5, 0, -9],
  [-5.8, 0, 9.5],
  [5.8, 0, 9.5],
];

const OPEN_POSITIONS: [number, number, number][] = [
  [0, 0, -3.5],
  [-4.6, 0, -2.3],
  [4.6, 0, -2.3],
  [-5.2, 0, 1.2],
  [5.2, 0, 1.2],
  [-3.6, 0, 3.6],
  [3.6, 0, 3.6],
  [-2.8, 0, -3.8],
  [2.8, 0, -3.8],
  [0, 0, 4.5],
];

const GROUPED_POSITIONS: [number, number, number][] = [
  [0, 0, -3.1],
  [-3.9, 0, -1.9],
  [3.9, 0, -1.9],
  [-4.1, 0, 1.4],
  [4.1, 0, 1.4],
  [-2.8, 0, 3],
  [2.8, 0, 3],
  [-2.9, 0, -1.4],
  [2.9, 0, -1.4],
  [0, 0, 3.8],
];

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setReducedMotion(mediaQuery.matches);
    };
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}

function NeutralPerson({
  index,
  active,
  central = false,
  target,
  pose = "neutral",
  color,
  reducedMotion,
}: NeutralPersonProps) {
  const rootRef = useRef<Group>(null);
  const shadowRef = useRef<Mesh>(null);
  const bodyRef = useRef<Group>(null);
  const upperBodyRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const leftForearmRef = useRef<Group>(null);
  const rightForearmRef = useRef<Group>(null);
  const leftLegRef = useRef<Group>(null);
  const rightLegRef = useRef<Group>(null);
  const leftShinRef = useRef<Group>(null);
  const rightShinRef = useRef<Group>(null);
  const destinationRef = useRef(new Vector3(...target));
  const activeRef = useRef(active);
  const initializedRef = useRef(false);
  const walkingAmountRef = useRef(0);
  const elapsedRef = useRef(index * 0.47);
  const outsidePosition = OUTSIDE_POSITIONS[index % OUTSIDE_POSITIONS.length];

  useEffect(() => {
    const root = rootRef.current;
    if (!root || central) return;
    activeRef.current = active;
    destinationRef.current.set(...(active ? target : outsidePosition));
    if (active) root.visible = true;
  }, [active, central, outsidePosition, target]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || initializedRef.current) return;
    initializedRef.current = true;
    if (central) {
      root.position.set(...target);
      root.visible = true;
      return;
    }
    root.position.set(...outsidePosition);
    root.visible = active;
  }, [active, central, outsidePosition, target]);

  useFrame((_, delta) => {
    const root = rootRef.current;
    const shadow = shadowRef.current;
    const body = bodyRef.current;
    const upperBody = upperBodyRef.current;
    const head = headRef.current;
    const leftArm = leftArmRef.current;
    const rightArm = rightArmRef.current;
    const leftForearm = leftForearmRef.current;
    const rightForearm = rightForearmRef.current;
    const leftLeg = leftLegRef.current;
    const rightLeg = rightLegRef.current;
    const leftShin = leftShinRef.current;
    const rightShin = rightShinRef.current;
    if (
      !root ||
      !shadow ||
      !body ||
      !upperBody ||
      !head ||
      !leftArm ||
      !rightArm ||
      !leftForearm ||
      !rightForearm ||
      !leftLeg ||
      !rightLeg ||
      !leftShin ||
      !rightShin
    )
      return;

    elapsedRef.current += delta;
    const destination = destinationRef.current;
    const distance = root.position.distanceTo(destination);
    const shouldWalk = !central && distance > 0.08 && !reducedMotion;
    walkingAmountRef.current = MathUtils.damp(
      walkingAmountRef.current,
      shouldWalk ? 1 : 0,
      8,
      delta,
    );

    if (!central) {
      if (reducedMotion) root.position.copy(destination);
      else if (shouldWalk) {
        const directionX = destination.x - root.position.x;
        const directionZ = destination.z - root.position.z;
        root.rotation.y = MathUtils.damp(
          root.rotation.y,
          Math.atan2(directionX, directionZ),
          10,
          delta,
        );
        root.position.x = MathUtils.damp(
          root.position.x,
          destination.x,
          3,
          delta,
        );
        root.position.z = MathUtils.damp(
          root.position.z,
          destination.z,
          3,
          delta,
        );
      } else {
        root.rotation.y = MathUtils.damp(
          root.rotation.y,
          Math.atan2(-root.position.x, -root.position.z),
          4,
          delta,
        );
      }
      if (!activeRef.current && distance < 0.12) root.visible = false;
    }

    const walk = Math.sin(elapsedRef.current * 8) * walkingAmountRef.current;
    const idle = reducedMotion ? 0 : Math.sin(elapsedRef.current * 1.6) * 0.018;
    const isClosed = central && pose === "closed";
    const isSitting = central && pose === "sitting";
    const shadowScaleX = central ? (isSitting ? 1.08 : 0.72) : 0.58;
    const shadowScaleY = central ? (isSitting ? 0.68 : 0.42) : 0.34;
    shadow.scale.x = MathUtils.damp(shadow.scale.x, shadowScaleX, 7, delta);
    shadow.scale.y = MathUtils.damp(shadow.scale.y, shadowScaleY, 7, delta);
    body.position.y = MathUtils.damp(
      body.position.y,
      isSitting ? 0.79 : isClosed ? 0.96 + idle : 1.05 + idle,
      7,
      delta,
    );
    body.position.z = MathUtils.damp(
      body.position.z,
      isSitting ? 0.34 : isClosed ? 0.16 : 0,
      7,
      delta,
    );
    upperBody.rotation.x = MathUtils.damp(
      upperBody.rotation.x,
      isSitting ? -0.38 : isClosed ? -0.2 : 0,
      7,
      delta,
    );
    head.rotation.x = MathUtils.damp(
      head.rotation.x,
      isSitting ? 0.5 : isClosed ? 0.28 : idle * 0.5,
      7,
      delta,
    );
    root.position.y = MathUtils.damp(
      root.position.y,
      shouldWalk ? Math.abs(walk) * 0.035 : 0,
      9,
      delta,
    );
    leftArm.rotation.x = MathUtils.damp(
      leftArm.rotation.x,
      isSitting ? -1.02 : isClosed ? -0.72 : walk * 0.62,
      8,
      delta,
    );
    rightArm.rotation.x = MathUtils.damp(
      rightArm.rotation.x,
      isSitting ? -1.02 : isClosed ? -0.72 : -walk * 0.62,
      8,
      delta,
    );
    leftArm.rotation.z = MathUtils.damp(
      leftArm.rotation.z,
      isClosed ? 0.58 : isSitting ? 0.25 : 0.08,
      8,
      delta,
    );
    rightArm.rotation.z = MathUtils.damp(
      rightArm.rotation.z,
      isClosed ? -0.58 : isSitting ? -0.25 : -0.08,
      8,
      delta,
    );
    leftForearm.rotation.x = MathUtils.damp(
      leftForearm.rotation.x,
      isClosed ? -1.18 : isSitting ? -0.82 : -0.12 - Math.abs(walk) * 0.18,
      8,
      delta,
    );
    rightForearm.rotation.x = MathUtils.damp(
      rightForearm.rotation.x,
      isClosed ? -1.18 : isSitting ? -0.82 : -0.12 - Math.abs(walk) * 0.18,
      8,
      delta,
    );
    leftForearm.rotation.z = MathUtils.damp(
      leftForearm.rotation.z,
      isClosed ? 0.72 : isSitting ? 0.52 : 0,
      8,
      delta,
    );
    rightForearm.rotation.z = MathUtils.damp(
      rightForearm.rotation.z,
      isClosed ? -0.72 : isSitting ? -0.52 : 0,
      8,
      delta,
    );
    leftLeg.rotation.x = MathUtils.damp(
      leftLeg.rotation.x,
      isSitting ? -1.52 : -walk * 0.72,
      8,
      delta,
    );
    rightLeg.rotation.x = MathUtils.damp(
      rightLeg.rotation.x,
      isSitting ? -1.52 : walk * 0.72,
      8,
      delta,
    );
    leftShin.rotation.x = MathUtils.damp(
      leftShin.rotation.x,
      isSitting ? 1.52 : Math.max(0, walk) * 0.42,
      8,
      delta,
    );
    rightShin.rotation.x = MathUtils.damp(
      rightShin.rotation.x,
      isSitting ? 1.52 : Math.max(0, -walk) * 0.42,
      8,
      delta,
    );
  });

  return (
    <group ref={rootRef} scale={central ? 1.08 : 0.88}>
      <mesh
        ref={shadowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.012, 0]}
        scale={[central ? 0.72 : 0.58, central ? 0.42 : 0.34, 1]}
      >
        <circleGeometry args={[0.72, 24]} />
        <meshBasicMaterial
          color="#334155"
          transparent
          opacity={central ? 0.1 : 0.055}
          depthWrite={false}
        />
      </mesh>
      <group ref={bodyRef} position={[0, 1.05, 0]}>
        <group ref={upperBodyRef}>
          <group ref={headRef} position={[0, 0.62, 0]}>
            <mesh>
              <sphereGeometry args={[0.24, 16, 12]} />
              <meshStandardMaterial color="#d8a78e" roughness={0.82} />
            </mesh>
            <mesh position={[0, 0.12, -0.015]} scale={[1.02, 0.56, 1.02]}>
              <sphereGeometry args={[0.245, 14, 10]} />
              <meshStandardMaterial color="#334155" roughness={0.9} />
            </mesh>
            <mesh position={[-0.078, 0.03, 0.222]}>
              <sphereGeometry args={[0.021, 8, 6]} />
              <meshStandardMaterial color="#1e293b" roughness={0.72} />
            </mesh>
            <mesh position={[0.078, 0.03, 0.222]}>
              <sphereGeometry args={[0.021, 8, 6]} />
              <meshStandardMaterial color="#1e293b" roughness={0.72} />
            </mesh>
            <mesh position={[0, -0.015, 0.236]} scale={[0.55, 0.75, 0.55]}>
              <sphereGeometry args={[0.035, 8, 6]} />
              <meshStandardMaterial color="#c98f78" roughness={0.84} />
            </mesh>
          </group>
          <mesh position={[0, 0.12, 0]} scale={[1, 1, 0.74]}>
            <capsuleGeometry args={[0.27, 0.48, 8, 14]} />
            <meshStandardMaterial color={color} roughness={0.76} />
          </mesh>
          <mesh position={[0, 0.39, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.11, 0.025, 6, 18, Math.PI]} />
            <meshStandardMaterial color="#eef2ff" roughness={0.78} />
          </mesh>
          <mesh position={[-0.055, 0.27, 0.205]}>
            <cylinderGeometry args={[0.008, 0.008, 0.22, 6]} />
            <meshStandardMaterial color="#e0e7ff" roughness={0.8} />
          </mesh>
          <mesh position={[0.055, 0.27, 0.205]}>
            <cylinderGeometry args={[0.008, 0.008, 0.22, 6]} />
            <meshStandardMaterial color="#e0e7ff" roughness={0.8} />
          </mesh>
          <group ref={leftArmRef} position={[-0.32, 0.31, 0]}>
            <mesh position={[0, -0.18, 0]}>
              <capsuleGeometry args={[0.075, 0.28, 6, 10]} />
              <meshStandardMaterial color={color} roughness={0.78} />
            </mesh>
            <group ref={leftForearmRef} position={[0, -0.38, 0]}>
              <mesh position={[0, -0.17, 0]}>
                <capsuleGeometry args={[0.065, 0.25, 6, 10]} />
                <meshStandardMaterial color={color} roughness={0.78} />
              </mesh>
              <mesh position={[0, -0.36, 0]}>
                <sphereGeometry args={[0.078, 10, 8]} />
                <meshStandardMaterial color="#d8a78e" roughness={0.82} />
              </mesh>
            </group>
          </group>
          <group ref={rightArmRef} position={[0.32, 0.31, 0]}>
            <mesh position={[0, -0.18, 0]}>
              <capsuleGeometry args={[0.075, 0.28, 6, 10]} />
              <meshStandardMaterial color={color} roughness={0.78} />
            </mesh>
            <group ref={rightForearmRef} position={[0, -0.38, 0]}>
              <mesh position={[0, -0.17, 0]}>
                <capsuleGeometry args={[0.065, 0.25, 6, 10]} />
                <meshStandardMaterial color={color} roughness={0.78} />
              </mesh>
              <mesh position={[0, -0.36, 0]}>
                <sphereGeometry args={[0.078, 10, 8]} />
                <meshStandardMaterial color="#d8a78e" roughness={0.82} />
              </mesh>
            </group>
          </group>
        </group>
        <group ref={leftLegRef} position={[-0.14, -0.34, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.105, 0.32, 6, 10]} />
            <meshStandardMaterial color="#64748b" roughness={0.86} />
          </mesh>
          <group ref={leftShinRef} position={[0, -0.43, 0]}>
            <mesh position={[0, -0.2, 0]}>
              <capsuleGeometry args={[0.09, 0.32, 6, 10]} />
              <meshStandardMaterial color="#64748b" roughness={0.86} />
            </mesh>
            <mesh position={[0, -0.44, 0.08]} scale={[1, 0.55, 1.65]}>
              <sphereGeometry args={[0.12, 10, 8]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
            </mesh>
          </group>
        </group>
        <group ref={rightLegRef} position={[0.14, -0.34, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.105, 0.32, 6, 10]} />
            <meshStandardMaterial color="#64748b" roughness={0.86} />
          </mesh>
          <group ref={rightShinRef} position={[0, -0.43, 0]}>
            <mesh position={[0, -0.2, 0]}>
              <capsuleGeometry args={[0.09, 0.32, 6, 10]} />
              <meshStandardMaterial color="#64748b" roughness={0.86} />
            </mesh>
            <mesh position={[0, -0.44, 0.08]} scale={[1, 0.55, 1.65]}>
              <sphereGeometry args={[0.12, 10, 8]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

function WellbeingLight({ value, color }: { value: number; color: string }) {
  const glowRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const glowColor = useMemo(() => new Color(color), [color]);
  useFrame(({ clock }) => {
    const glow = glowRef.current;
    const material = materialRef.current;
    if (!glow || !material) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.15) * 0.035;
    const size = (1.25 + value * 0.55) * pulse;
    glow.scale.set(size, size, 1);
    material.opacity = 0.1 + value * 0.12;
  });
  return (
    <>
      <pointLight
        color={glowColor}
        intensity={1.2 + value * 2}
        distance={5}
        position={[0, 1.2, 0.7]}
      />
      <mesh
        ref={glowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, 0]}
      >
        <circleGeometry args={[1.35, 64]} />
        <meshStandardMaterial
          ref={materialRef}
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={0.9}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function World({
  peopleCount,
  supportLevel,
  wellbeing,
  wellbeingColor,
  pose,
}: Scene3DProps) {
  const reducedMotion = useReducedMotion();
  const grouping = MathUtils.smoothstep(supportLevel, 0.1, 0.9);
  const positions = OPEN_POSITIONS.map((openPosition, index) => {
    const groupedPosition = GROUPED_POSITIONS[index];
    return openPosition.map((value, coordinate) =>
      MathUtils.lerp(value, groupedPosition[coordinate], grouping),
    ) as [number, number, number];
  });
  return (
    <>
      <ambientLight intensity={1.7} />
      <directionalLight intensity={2.2} position={[-4, 8, 5]} />
      <WellbeingLight value={wellbeing} color={wellbeingColor} />
      <NeutralPerson
        index={0}
        active
        central
        target={[0, 0, 0]}
        pose={pose}
        color="#6256d9"
        reducedMotion={reducedMotion}
      />
      {positions.map((position, index) => (
        <NeutralPerson
          key={index}
          index={index}
          active={index < peopleCount}
          target={position}
          color="#a7afbf"
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  );
}

export default function Scene3D(props: Scene3DProps) {
  return (
    <Canvas
      orthographic
      dpr={[1, 1.25]}
      camera={{ position: [0, 8.5, 10.5], zoom: 62, near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0.7, 0)}
    >
      <World {...props} />
    </Canvas>
  );
}
