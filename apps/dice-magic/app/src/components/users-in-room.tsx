import { useGameContext } from '@dice-magic/contexts';
import styled from '@emotion/styled';
import { Button } from '@shared/components';
import { useBaseAppContext } from '@shared/contexts';
import { useUserStore } from '@shared/stores';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  padding: 1rem;

  color: var(--color-text);
  font-size: 2.4rem;
  display: flex;
  flex-direction: column;
`;

export const UsersInRoom = () => {
// TODO move to a zustand store
// TODO fix seated users...

  const { baseAppState } = useBaseAppContext();
  const { gameState, handlePlayerSit } = useGameContext(); 
  const user = useUserStore((s) => s.user);

  return (
    <Container>
      <p>Current User: {user?.username}</p>

      <p>Users: {baseAppState.users.length}</p>

      {gameState.players.length > 0 && (
        <>
          <p>Seat 1: {gameState.players[0]?.username ?? 'Empty'} <Button onClick={() => handlePlayerSit(0)}>Sit</Button></p>
          <p>Seat 2: {gameState.players[1]?.username ?? 'Empty'} <Button onClick={() => handlePlayerSit(1)}>Sit</Button></p>
          <p>Seat 3: {gameState.players[2]?.username ?? 'Empty'} <Button onClick={() => handlePlayerSit(2)}>Sit</Button></p>
          <p>Seat 4: {gameState.players[3]?.username ?? 'Empty'} <Button onClick={() => handlePlayerSit(3)}>Sit</Button></p>
        </>
      )}
    </Container>
  );
};
