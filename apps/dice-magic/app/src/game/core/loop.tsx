import { Table } from '../components/table/table';
import { PhysicsWorld } from './physics';
import { Dice } from '../components/dice/dice';
import { CenterPoint } from '../components/table/center-point';
import * as THREE from 'three';
import { useDicePositions } from '../components/dice/use-dice-position';

export const GameLoop = () => {
  const tableCenter = new THREE.Vector3(0, 0, 0);
  const { updatePosition, distances } = useDicePositions(tableCenter);

  // console.log('Distances:', distances);

  return (
    <PhysicsWorld>
      <Table />
      <CenterPoint />

      <Dice position={[-2, 5, 0]} color="red" onPositionChange={(pos) => updatePosition('red', pos)} />
      <Dice position={[2, 5, 0]} color="blue" onPositionChange={(pos) => updatePosition('blue', pos)} />
    </PhysicsWorld>
  );
};


