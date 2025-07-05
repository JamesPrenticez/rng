import { Html } from '@react-three/drei';

interface SeatProps {
  seatNum: number;
  position: [number, number, number];
}

export const Seat = ({ seatNum, position }: SeatProps) => {
  return (
    <group position={position}>
      <mesh receiveShadow>
        <cylinderGeometry args={[2, 2, 0.1, 64]} />
        <meshStandardMaterial color="lime" />
      </mesh>

      <Html
        center
        distanceFactor={10} // controls scale vs camera distance
        position={[0, 0.1, 0]} // put above seat
        occlude // hide behind gemoerty / camera
      >
        <div style={{ fontSize: '12px', color: 'black' }}>{seatNum}</div>
      </Html>
    </group>
  );
};
