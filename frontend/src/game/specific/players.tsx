import { Player } from './player';

export const Players = () => {
  return (
    <>
      <Player id={1} position={[-2, 0.5, 0]} />
      <Player id={2} position={[2, 0.5, 0]} />
    </>
  );
};
