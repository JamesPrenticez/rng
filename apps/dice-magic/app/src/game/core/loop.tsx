import { Table } from '../components/table/table';
import { PhysicsWorld } from './physics';
import { Dice } from '../components/dice/dice';
import { CenterPoint } from '../components/table/center-point';
import * as THREE from 'three';
import { useDicePositions } from '../components/dice/use-dice-position';
import { usePositioningStore } from '@dice-magic/stores';
import { Seat } from '../components/table/seat';

export const GameLoop = () => {
  const tableCenter = new THREE.Vector3(0, 0, 0);

  const { updatePosition, distances } = useDicePositions(tableCenter);
  const { seatPositions } = usePositioningStore();
  

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
