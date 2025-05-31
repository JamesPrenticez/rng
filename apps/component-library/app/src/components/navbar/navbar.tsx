import styled from '@emotion/styled';
import LogoSVG from '../../assets/logo.svg?react';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0rem 2rem;
  gap: 1rem;
  height: 6rem;
  background-color: var(--color-black-80);

  .logo {
    svg {
      width: 4rem;
      height: 4rem;
    }
  }

  .title {
    font-family: 'Orbitron', monospace;
    color: var(--color-white-80);
    font-size: 2.8rem;
    letter-spacing: 0.2rem;
  }
`;

export const Navbar = () => {
  return (
    <Container>
      <div className="logo">
        <LogoSVG />
      </div>

      <div className="title">Orbit — Component Library</div>
    </Container>
  );
};
