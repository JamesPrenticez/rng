import { Canvas } from '@react-three/fiber';
import { GameLoop } from './loop';
import { OrbitControls } from '@react-three/drei';

export const GameCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
      <ambientLight intensity={0.1} />
      <directionalLight
        castShadow
        position={[5, 10, 5]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <OrbitControls enableDamping />
        <GameLoop />
    </Canvas>
  );
};
