import { CylinderCollider, RigidBody } from '@react-three/rapier';

// Plinko example - https://react-three-rapier.pmnd.rs/

// Square Table 
// export const Table = () => {
//   return (
//     <RigidBody type="fixed" colliders="cuboid">
//       <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
//         <planeGeometry args={[20, 20]} />
//         <meshStandardMaterial color="#8b6914" />
//       </mesh>
//     </RigidBody>
//   );
// };

export const Table = () => {
  return (
    <RigidBody type="fixed">
      {/* Visual mesh */}
      <mesh receiveShadow position={[0, -0.1, 0]}>
        <cylinderGeometry args={[33, 33, 0.2, 64]} />
        <meshStandardMaterial color="#8b6914" />
      </mesh>

      {/* Physics collider */}
      <CylinderCollider args={[0.1, 33]} position={[0, -0.1, 0]} />
    </RigidBody>
  );
};
