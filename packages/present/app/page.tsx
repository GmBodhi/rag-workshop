"use client";
import { Billboard, OrbitControls, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <>
      <div className="w-full h-screen">
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />

          <Billboard>
            <mesh>
              <meshBasicMaterial attach="material" color="white" />
              <planeGeometry attach="geometry" args={[8, 6]} />
            </mesh>
            <Text color="black" position={[0, 1, 0]}>
              asd
            </Text>
          </Billboard>
          <OrbitControls />
        </Canvas>
      </div>
    </>
  );
}
