// components/Player.tsx
import { useState } from 'react';
import { Dice } from './dice';
import { Html } from '@react-three/drei';

type PlayerProps = {
  id: number;
  position: [number, number, number];
};

export const Player = ({ id, position }: PlayerProps) => {
  const [roll, setRoll] = useState<number>(1);

  const handleRoll = () => {
    setRoll(Math.floor(Math.random() * 6) + 1);
  };

  return (
    <>
      <Dice position={[...position]} color={id === 1 ? 'red' : 'blue'} />
      <Html position={[...position]}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <p>Player {id}</p>
          <p>Roll: {roll}</p>
          <button onClick={handleRoll}>Roll</button>
        </div>
      </Html>
    </>
  );
};
