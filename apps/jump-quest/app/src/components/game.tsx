import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  GameEngine
} from "@jump-quest/entities"

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
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize game engine
  useEffect(() => {
    if (canvasRef.current && !gameEngineRef.current) {
      gameEngineRef.current = new GameEngine(canvasRef.current);
      
      // Auto-start the game
      gameEngineRef.current.startGame();
      setIsPlaying(true);
    }
  }, []);

  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameEngineRef.current) {
        gameEngineRef.current.handleKeyDown(e);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (gameEngineRef.current) {
        gameEngineRef.current.handleKeyUp(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const toggleGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.toggleGame();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <GameContainer>
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>React 2D Game Engine (OOP)</h1>
      
      <GameCanvas
        ref={canvasRef}
        width={1024}
        height={576}
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
        <p>The player loads from <code>./assets/sprites/player/player.png</code></p>
        <p>Weapon loads from <code>./assets/sprites/weapons/bow.png</code></p>
        <p>Green circle shows collision boundary, red blocks are collision objects.</p>
      </Instructions>
    </GameContainer>
  );
};