import { Canvas } from '@react-three/fiber';
import { GameLoop } from './loop';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export const GameCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 0, 40], fov: 50 }}>
      <ambientLight intensity={0.1} />
      <directionalLight
        castShadow
        position={[5, 10, 5]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <OrbitControls
        enableDamping
        mouseButtons={{
          MIDDLE: THREE.MOUSE.PAN,
          RIGHT: THREE.MOUSE.ROTATE,
        }}
      />
      <GameLoop />
    </Canvas>
  );
};
