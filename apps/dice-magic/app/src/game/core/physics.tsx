import { PropsWithChildren } from 'react';
import { Physics } from '@react-three/rapier';

export const PhysicsWorld = ({ children }: PropsWithChildren) => {
  return <Physics gravity={[0, -9.81, 0]}>{children}</Physics>;
};