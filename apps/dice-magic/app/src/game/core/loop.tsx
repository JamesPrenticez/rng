// components/GameLoop.tsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group } from 'three';
import { Ground } from '../physics/physics-ground';
import { PhysicsWorld } from '../physics/physics-world';
import { PhysicsDice } from '../physics/physics-dice';

// Specific

export const GameLoop = () => {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    // Your game loop logic here
    // Example: slowly rotate the table
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <PhysicsWorld>
      <group ref={groupRef}>
        <Ground />
        <PhysicsDice position={[-2, 5, 0]} color="red" />
        <PhysicsDice position={[2, 5, 0]} color="blue" />
      </group>
    </PhysicsWorld>
  );
};

