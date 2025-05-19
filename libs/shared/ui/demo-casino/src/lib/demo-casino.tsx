import styled from '@emotion/styled';
import { useState } from 'react';
import clsx from 'clsx';
import { useAspectRatioHandler } from '@shared/layouts';

const HEADER_HEIGHT = 60;

const MIN = `
            min(calc(100vw - ${HEADER_HEIGHT * 2}px),
            calc(177vh - ${HEADER_HEIGHT * 4}px))`;

const Conatiner = styled.div`
  height: 100dvh;
  box-sizing: border-box;
  background-color: #09090a;
  overflow: hidden;
  border: lime 1px solid;

  iframe {
    box-sizing: border-box;
    margin: 40px;
    width: ${MIN};
    height: calc((1080 / 1920) * ${MIN});
  }

  &.mobile {
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
  background-color: red;
  border-bottom: 1px solid #242424;

  padding: 0px 40px;

  font-family: 'Chakra Petch';

  &.mobile {
    align-items: center;
    justify-content: center;
    padding: 0px 10px;
  }
  `;

interface DemoCasinoProps {
  app: "dice-magic" | null;
}

export const DemoCasino = ({app}: DemoCasinoProps ) => {
  const mobile = useAspectRatioHandler();
  const [gameUrl, setGameUrl] = useState("http://localhost:4200/");

  return (
    <Conatiner className={clsx({ mobile })}>
      <Header />
      {gameUrl && <iframe src={gameUrl} title="Game Studio" />}
    </Conatiner>
  );
};
