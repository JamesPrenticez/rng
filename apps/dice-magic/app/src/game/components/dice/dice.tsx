import { RigidBody, RigidBodyApi } from '@react-three/rapier';
import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type PhysicsDiceProps = {
  position: [number, number, number];
  color?: string;
  onPositionChange?: (pos: THREE.Vector3) => void;
};

export const Dice = ({ position, color = 'white', onPositionChange }: PhysicsDiceProps) => {
  const rigidBody = useRef<RigidBodyApi>(null);
  const { camera } = useThree();

  // Report dice position every frame
  useFrame(() => {
    if (rigidBody.current && onPositionChange) {
      const pos = rigidBody.current.translation();
      onPositionChange(new THREE.Vector3(pos.x, pos.y, pos.z));
    }
  });

  const throwDice = () => {
    if (!rigidBody.current) return;

    const impulseDir = new THREE.Vector3()
      .subVectors(rigidBody.current.translation(), camera.position)
      .normalize()
      .multiplyScalar(10);

    rigidBody.current.applyImpulse(impulseDir, true);
  };

  return (
    <RigidBody
      ref={rigidBody}
      colliders="cuboid"
      restitution={0.6}
      friction={0.5}
      position={position}
    >
      <mesh castShadow onClick={throwDice}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
};