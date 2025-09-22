import styled from '@emotion/styled';
import { GameCanvas } from '../game/core/canvas';
import { UsersInRoom } from '../components/users-in-room';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  font-size: 5rem;
  color: var(--color-primary);
  background-color: var(--color-background);
`;

export const DesktopAppLayout = () => {
  return (
    <Container>
      <UsersInRoom />
      <GameCanvas />
    </Container>
  );
};
