import styled from '@emotion/styled';
import { useAuth } from '../auth/use-auth';
import { useMemo, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Avatar } from './avatar';

const Container = styled.nav`
  padding-left: 0rem;
  padding-right: 1rem;
  height: 5rem;
  display: flex;
  align-items: center;
  font-family: 'Quicksand', sans-serif;
  font-size: 2.5rem;
  color: var(--color-text);
  background-color: var(--color-primary);

  .logo {
    font-size: 2rem;
    margin-left: 3rem;
    display: flex;
    background-color: var(--color-secondary);
    border-radius: 2rem;
    padding: 0.5rem;
  }
`;

export const TopNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <Container>
      <div className="logo">🔨</div>

      <Avatar
        isRightMenuOpen={isMenuOpen}
        toggleRightMenuOpen={setIsMenuOpen}
      />

      <div className="content"></div>
    </Container>
  );
};
