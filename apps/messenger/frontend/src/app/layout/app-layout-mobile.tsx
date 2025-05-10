import { Outlet } from 'react-router-dom';
import { BottomNav } from '../components/bottom-nav/bottom-nav';
import { TopNav } from '../components/top-nav/top-nav';
import styled from '@emotion/styled';

const Container = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: var(--color-background);
  }
`;

export const AppLayoutMobile = () => {
  return (
    <Container>
      <TopNav />
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </Container>
  );
};
