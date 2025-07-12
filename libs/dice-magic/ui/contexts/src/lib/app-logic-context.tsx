import { PlayerAction, PlayerBet } from '@dice-maic/models';
import { createContext, ReactNode, useCallback } from 'react';
import { useGameContext } from './game-context';

interface LogicActionContextProps {
  handlePlayerAction: (
    seatId: number,
    action: PlayerAction,
    section?: PlayerBet
  ) => void;
  undoBet: () => void;
}

const LogicActionContext = createContext<LogicActionContextProps | undefined>(
  undefined
);

interface LogicProviderProps {
  children: ReactNode;
}

const LogicContextProvider = ({ children }: LogicProviderProps) => {
  const { 
    handlePlayerSit,
    seatIsFree,
  } = useGameContext();

  const handleSeatClick = useCallback(
    (seatId: number) => {
      if (seatIsFree(seatId)) {
        handlePlayerSit(seatId);
      }
    },
    [handlePlayerSit, seatIsFree]
  );
};
