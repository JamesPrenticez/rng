import { Table } from '../components/table/table';
import { PhysicsWorld } from './physics';
import { Dice } from '../components/dice/dice';
import { CenterPoint } from '../components/table/center-point';
import * as THREE from 'three';
import { useDicePositions } from '../components/dice/use-dice-position';
import { usePositioningStore } from '@dice-magic/stores';
import { Seat } from '../components/table/seat';
import { useMemo } from 'react';

export const GameLoop = () => {
  const tableCenter = new THREE.Vector3(0, 0, 0);

  const { updatePosition, distances } = useDicePositions(tableCenter);
  const { seatPositions } = usePositioningStore();

  const diceRender = useMemo(() =>
    seatPositions.map((seatPos, i) => (
      <Dice
        key={i}
        position={[seatPos[0], 3, seatPos[2]]} // spawn above each seat
      />
    ))
  , [seatPositions]);

  
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

{diceRender}

    </PhysicsWorld>
  );
};
