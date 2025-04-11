import React, { createContext, useContext, useState, ReactNode } from 'react';

export enum GameStage {
  SELECTING_POSITION = 'SELECTING_POSITION',
  // We'll add more stages as we implement them
}

interface GameState {
  currentStage: GameStage;
  playerAngle: number; // Angle in radians
  isPositionLocked: boolean;
}

interface GameStateContextType {
  state: GameState;
  setPlayerAngle: (angle: number) => void;
  lockPosition: () => void;
  advanceStage: () => void;
}

const initialState: GameState = {
  currentStage: GameStage.SELECTING_POSITION,
  playerAngle: 0,
  isPositionLocked: false,
};

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(initialState);

  const setPlayerAngle = (angle: number) => {
    setState(prev => ({ ...prev, playerAngle: angle }));
  };

  const lockPosition = () => {
    setState(prev => ({ ...prev, isPositionLocked: true }));
  };

  const advanceStage = () => {
    setState(prev => {
      // We'll add more stages as we implement them
      return { ...prev, currentStage: GameStage.SELECTING_POSITION };
    });
  };

  return (
    <GameStateContext.Provider value={{ state, setPlayerAngle, lockPosition, advanceStage }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}; 