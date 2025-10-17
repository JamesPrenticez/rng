import React, { useEffect, useRef } from 'react';
import { CoinFlipGame } from '@coin-flip/game';
import styled from '@emotion/styled';
import { Button, ButtonVariants } from '@shared/components';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  border: 2px solid #444;
  background: #222;
  image-rendering: crisp-edges;
  display: block; // Remove any default inline spacing
`;

const InterfaceOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;

  .button-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: auto;
    width: 100%;
    height: 20rem;
  }
`;

export const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<CoinFlipGame | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const container = containerRef.current!;

    // Get actual container dimensions
    const rect = container.getBoundingClientRect();
    const buttonHeight = 60; // Approximate button + gap height
    const availableHeight = rect.height - buttonHeight;

    const game = new CoinFlipGame(canvas, rect.width, availableHeight);
    game.start();
    gameRef.current = game;

    // Handle resize
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const availableHeight = rect.height - buttonHeight;
      game.canvas.resize(rect.width, availableHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      game.loop.stop();
    };
  }, []);

  const handleFlip = () => {
    gameRef.current?.flip();
  };

  return (
    <Container ref={containerRef}>
      <Canvas ref={canvasRef} />

      {/* TODO
      Extract gameRef into a store?
      then extract this in app layout?
      */}
      <InterfaceOverlay>
        <div className="button-container">
          <Button variant={ButtonVariants.FILLED} onClick={handleFlip}>
            Flip Coin
          </Button>
        </div>
      </InterfaceOverlay>
    </Container>
  );
};
