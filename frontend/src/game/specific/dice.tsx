import { useRef } from 'react';
import { Mesh } from 'three';

type DiceProps = {
  position: [number, number, number];
  color?: string;
};

export const Dice = ({ position, color = 'white' }: DiceProps) => {
  const ref = useRef<Mesh>(null);

  return (
    <mesh position={position} ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};