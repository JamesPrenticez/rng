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

    </group>
  );
};

