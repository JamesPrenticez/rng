import styled from '@emotion/styled';
import { Game } from '../components/game';

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
      <Game />
    </Container>
  );
};
