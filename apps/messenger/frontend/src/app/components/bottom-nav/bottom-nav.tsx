import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { navListFlattened } from '../../constants/bottom-nav-constants';
import { Home } from 'lucide-react';
import { Button, ButtonVariants } from '@shared/ui/components/buttons';

const Container = styled.nav`
  display: flex;
  justify-content: space-between;
  background-color: var(--color-background);

  height: 5rem;

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    &.active {
      background-color: var(--color-secondary);

      svg {
        color: var(--color-white-100);
      }
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 5rem;
    }
  }
`;
export const BottomNav = () => {
  return (
    <Container>
      <NavLink to={'/messenger'} className="button">
        <Button variant={ButtonVariants.BOTTOM_NAV}>
          <Home />
        </Button>
      </NavLink>

      {navListFlattened.map((item) => (
        <NavLink
          key={item.key}
          to={item.key}
          className={({ isActive }) => `button ${isActive ? 'active' : ''}`}
        >
          <Button variant={ButtonVariants.BOTTOM_NAV}>{item.icon}</Button>
        </NavLink>
      ))}
    </Container>
  );
};
