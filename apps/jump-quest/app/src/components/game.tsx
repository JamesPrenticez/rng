import { useEffect, useRef } from "react";
import { useGameStore } from "@jump-quest/stores"
import { useGameEngine } from "@jump-quest/hooks"
import styled from "@emotion/styled";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #1a1a1a;
  min-height: 100vh;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const GameCanvas = styled.canvas`
  border: 2px solid #444;
  background: #222;
  image-rendering: pixelated;
`;

const Controls = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ $isActive?: boolean }>`
  background: ${props => props.$isActive ? '#4CAF50' : '#666'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.$isActive ? '#45a049' : '#777'};
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Instructions = styled.div`
  margin-top: 20px;
  color: #ccc;
  text-align: center;
  max-width: 600px;
  
  h3 {
    color: #fff;
    margin-bottom: 10px;
  }
  
  p {
    margin: 5px 0;
    line-height: 1.5;
  }
`;

// Main Game Component
export const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying, toggleGame, initializeGame, setKeyState, canvasSize } = useGameStore();

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Use game engine
  useGameEngine(canvasRef);

  // Key event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeyState(e.code, true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeyState(e.code, false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setKeyState]);

  return (
    <GameContainer>
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>React 2D Game Engine</h1>
      
      <GameCanvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
      />
      
      <Controls>
        <Button $isActive={isPlaying} onClick={toggleGame}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </Controls>
      
      <Instructions>
        <h3>Controls</h3>
        <p><strong>WASD</strong> - Move (W to jump)</p>
        <p><strong>A/D</strong> - Left/Right movement</p>
        <p>The player (white circle) can jump, walk, and run with physics-based movement.</p>
        <p>Red blocks are collision objects that the player can stand on and collide with.</p>
      </Instructions>
    </GameContainer>
  );
};