import React, { useEffect, useRef } from 'react';
import { CoinFlipGame } from '@coin-flip/game';
import styled from '@emotion/styled';
import { Button, ButtonVariants } from '@shared/components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Canvas = styled.canvas`
  border: 2px solid #444;
  background: #222;
image-rendering: crisp-edges;
`;


export const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<CoinFlipGame | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const game = new CoinFlipGame(canvas);
    game.start();
    gameRef.current = game;

    // Cleanup when unmounting
    return () => {
      game.loop.stop();
    };
  }, []);

  const handleFlip = () => {
    gameRef.current?.flip();
  };

  return (
    <Container>
      <Canvas
        ref={canvasRef}
        width={400}
        height={400}
      />
      <Button
        variant={ButtonVariants.FILLED}
        onClick={handleFlip}
      >
        Flip Coin
      </Button>
    </Container>
  );
};
