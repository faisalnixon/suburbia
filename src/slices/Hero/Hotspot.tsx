// tsrfc
import * as THREE from "three";
import { Billboard } from "@react-three/drei";
import React, { useRef } from "react";

interface HotspotProps {
  position: [number, number, number];
  isVisible: boolean;
  color?: string;
}
export function Hotspot({ isVisible, position, color }: HotspotProps) {
  const hotsportRef = useRef<THREE.Mesh>(null);

  return (
    <Billboard position={position} follow={true}>
      <mesh ref={hotsportRef} visible={isVisible}>
        <circleGeometry args={[0.02, 32]} />
        <meshStandardMaterial color={color} transparent opacity={1} />
      </mesh>

      <mesh
        visible={isVisible}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <circleGeometry args={[0.03, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Billboard>
  );
}
