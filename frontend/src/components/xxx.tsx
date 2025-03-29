import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { useState, useRef } from "react";
import { Euler } from "three";
import Metal from "../assets/metal.png"

const DiceMesh = () => {
  const texture = useTexture(Metal);

  return (
    <mesh>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export const Dice = () => {
  const [rollResult, setRollResult] = useState<number | null>(null);
  const diceRef = useRef<any>(null);

  const rollDice = () => {
    const randomRotation = new Euler(
      Math.random() * Math.PI * 4,
      Math.random() * Math.PI * 4,
      Math.random() * Math.PI * 4
    );

    setRollResult(Math.floor(Math.random() * 20) + 1);

    if (diceRef.current) {
      diceRef.current.setNextKinematicRotation(randomRotation);
    }
  };

  return (
    <div>
      hi
      <button onClick={rollDice} style={{ position: "absolute", zIndex: 10 }}>
        Roll Dice
      </button>
      {rollResult && (
        <div style={{ position: "absolute", top: "10px", zIndex: 10 }}>
          🎲 You rolled a {rollResult}!
        </div>
      )}
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Physics>
          <RigidBody ref={diceRef} type="kinematicPosition">
            <DiceMesh />
          </RigidBody>
        </Physics>
        <OrbitControls />
      </Canvas>
    </div>
  );
};
