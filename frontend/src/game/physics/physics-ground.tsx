import { RigidBody } from '@react-three/rapier';

export const Ground = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="saddlebrown" />
      </mesh>
    </RigidBody>
  );
};
