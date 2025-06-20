import { RigidBody } from '@react-three/rapier';

type PhysicsDiceProps = {
  position: [number, number, number];
  color?: string;
};

export const PhysicsDice = ({ position, color = 'white' }: PhysicsDiceProps) => {
  return (
    <RigidBody
      colliders="cuboid"
      restitution={0.6}
      friction={0.5}
      position={position}
    >
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
};
