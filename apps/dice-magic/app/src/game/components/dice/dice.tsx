import { RigidBody, RigidBodyApi } from '@react-three/rapier';
import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
   useGLTF,
   useTexture
} from '@react-three/drei';

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
  scale = 33,
}: PhysicsDiceProps) => {
  const rigidBody = useRef<RigidBodyApi>(null);
  const { camera } = useThree();

  const { scene } = useGLTF('./dice-red/scene.gltf');
  // const texture = useTexture('./dice/textures/material_diffuse.png');

  // Clone the model so each dice is separate
  const diceModel = scene.clone();

  // Apply material to cloned model
  // diceModel.traverse((child) => {
  //   if (child instanceof THREE.Mesh) {
  //     child.material = new THREE.MeshStandardMaterial({
  //       // map: texture,
  //       // color
  //     });
  //     child.castShadow = true;
  //   }
  // });

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
      .multiplyScalar(33);
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
      {/* 3d Model */}
      <primitive object={diceModel} scale={scale} />

      {/* Invisible bigger mesh handels collisions - AKA hit box */}
      <mesh
        visible={false}
        onClick={throwDice}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
        }}
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </RigidBody>
  );
};

useGLTF.preload('./dice-red/scene.gltf');
// useTexture.preload('./dice/textures/material_diffuse.png');