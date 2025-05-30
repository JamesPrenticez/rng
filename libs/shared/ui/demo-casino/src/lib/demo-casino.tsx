import styled from '@emotion/styled';
import { useState } from 'react';
import clsx from 'clsx';
import { useAspectRatio } from '@shared/layouts';

const HEADER_HEIGHT = 60;

const MIN = `
            min(calc(100vw - ${HEADER_HEIGHT * 2}px),
            calc(177vh - ${HEADER_HEIGHT * 4}px))`;

const Container = styled.div`
  box-sizing: border-box;

  background-color: #09090a;
  border: lime 1px solid;
  height: 100dvh;

  overflow: hidden;

  iframe {
    box-sizing: border-box;
    margin: 40px;
    width: ${MIN};
    height: calc((1080 / 1920) * ${MIN});
  }

  &.moible {
    iframe {
      margin: 0px;
      box-sizing: border-box;
      width: 100dvw;
      height: 100dvh;
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100vw;
  height: ${HEADER_HEIGHT}px;

  font-size: 4rem;
  font-family: 'Aronui';
  color: var(--color-primary);
  background-color: var(--color-black-20);
  border-bottom: silver 1px solid;

  padding: 0rem 1rem;

  &.mobile {
    align-items: center;
    justify-content: center;
    padding: 0px 10px;
  }
`;

interface DemoCasinoProps {
  app: 'dice-magic' | null;
}

export const DemoCasino = ({ app }: DemoCasinoProps) => {
  const mobile = useAspectRatio();
  const [gameUrl, setGameUrl] = useState('http://localhost:4202/'); // TODO update for different apps

  return (
    <Container className={clsx({ mobile })}>
      <Header>Demo Casino</Header>
      {gameUrl && <iframe src={gameUrl} title="Game Studio" />}
    </Container>
  );
};
