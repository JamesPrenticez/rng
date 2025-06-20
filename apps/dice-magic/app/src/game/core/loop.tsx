// components/GameLoop.tsx
// import { useFrame } from '@react-three/fiber';
// import { useRef } from 'react';
// import { Group } from 'three';
import { Table } from '../physics/physics-ground';
import { PhysicsWorld } from '../physics/physics-world';
import { PhysicsDice } from '../physics/physics-dice';

export const GameLoop = () => {
  return (
    <PhysicsWorld>
        <Table />

        <PhysicsDice position={[-2, 5, 0]} color="red" />
        <PhysicsDice position={[2, 5, 0]} color="blue" />
    </PhysicsWorld>
  );
};


