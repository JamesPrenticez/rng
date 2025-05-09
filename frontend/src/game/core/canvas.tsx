// components/GameCanvas.tsx
import { Canvas } from '@react-three/fiber';
import { GameLoop } from './loop';

export const GameCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
      <ambientLight intensity={0.5}/>
      <directionalLight
    castShadow
    position={[5, 10, 5]}
    shadow-mapSize-width={1024}
    shadow-mapSize-height={1024}
  />

      <GameLoop />
    </Canvas>
  );
};
