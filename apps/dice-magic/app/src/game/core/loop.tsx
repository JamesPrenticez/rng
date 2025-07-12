import { Table } from '../components/table/table';
import { PhysicsWorld } from './physics';
import { Dice } from '../components/dice/dice';
import { CenterPoint } from '../components/table/center-point';
import * as THREE from 'three';
import { useDicePositions } from '../components/dice/use-dice-position';
import { useGameContext } from '@dice-maigic/contexts';
import { Seat } from '../components/table';
import { usePositioningStore } from '@dice-magic/stores';
import { useEffect } from 'react';

export const GameLoop = () => {
  const tableCenter = new THREE.Vector3(0, 0, 0);

  const { updatePosition, distances } = useDicePositions(tableCenter);
  const { seatPositions, generatePositions } = usePositioningStore();
  
  // console.log('Distances:', distances);

  // Some sort of gameConfig
  const numOfSeats = 4;
  // const {
  //   gameState: { seats },
  // } = useGameContext();

  useEffect(() => {
    generatePositions(numOfSeats);
  }, [numOfSeats, generatePositions]);

  return (
    <PhysicsWorld>
      <Table />
      <CenterPoint />

      {seatPositions.map((pos, i) => (
        <Seat 
          key={i}
          seatNum={i}
          position={pos}
        />
      ))}

      <Dice
        position={[-2, 5, 0]}
        color="red"
        onPositionChange={(pos) => updatePosition('red', pos)}
      />

      <Dice
        position={[2, 5, 0]}
        color="blue"
        onPositionChange={(pos) => updatePosition('blue', pos)}
      />
    </PhysicsWorld>
  );
};
