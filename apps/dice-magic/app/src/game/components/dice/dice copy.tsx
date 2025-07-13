import { RigidBody, RigidBodyApi } from '@react-three/rapier';
import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, useTexture } from '@react-three/drei';

type PhysicsDiceProps = {
  position: [number, number, number];
  color?: string;
  onPositionChange?: (pos: THREE.Vector3) => void;
  scale?: number;
};

export const Dice = ({
  position,
  color = 'white',
  onPositionChange,
  scale = 0.01
}: PhysicsDiceProps) => {
  const rigidBody = useRef<RigidBodyApi>(null);
  const { camera } = useThree();

  const { scene } = useGLTF('./dice/d20.gltf');
  const texture = useTexture('./dice/textures/material_diffuse.png');

  // Clone the model so each dice is separate
  const diceModel = scene.clone();

  // Apply material to cloned model
  diceModel.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshStandardMaterial({
        map: texture,
        color
      });
      child.castShadow = true;
    }
  });

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
      colliders="trimesh"
      restitution={0.6}
      friction={0.5}
      position={position}
    >
      <group
        onClick={throwDice}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <primitive object={diceModel} scale={[scale, scale, scale]} />
        {/* Invisible bigger mesh if needed */}
        <mesh visible={false}>
          <icosahedronGeometry args={[0.5]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </RigidBody>
  );
};

useGLTF.preload('./dice/d20.gltf');
useTexture.preload('./dice/textures/material_diffuse.png');
