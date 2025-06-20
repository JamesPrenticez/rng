import { RigidBody } from '@react-three/rapier';

export const Table = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#8b6914" />
      </mesh>
    </RigidBody>
  );
};
