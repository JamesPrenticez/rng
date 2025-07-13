import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useReducer,
  ReactNode,
} from 'react';
import { useSocket } from '@shared/contexts';

import { User } from '@shared/models';

import { DiceMagicEvents, GameState } from '@dice-maic/models';
import {
  IBaseEvent,
  BaseEvents,
  RoundStartEvent,
  RoundEndEvent,
  UsersUpdateEvent,
} from '@shared/events';
import { useUserStore } from '@shared/stores';

interface GameContextProps {
  gameState: GameState;
}

interface GameProviderProps {
  children: ReactNode;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

const initialState: GameState = {
  roundInfo: null,
  players: [],
  payouts: [],
  endTime: 0,
};

type GameReducer = (
  state: GameState,
  event: IBaseEvent<DiceMagicEvents | BaseEvents | unknown>[1]
) => GameState;

const gameReducer: GameReducer = (state, event): GameState => {
  switch (event.event) {
    case BaseEvents.UsersUpdate: {
      const eventData = event as UsersUpdateEvent;
      return {
        ...state,
        players: eventData.payload,
      };
    }
    case BaseEvents.RoundStart: {
      const eventData = event as RoundStartEvent;
      return {
        ...initialState,
        roundInfo: eventData.payload,
        payouts: [],
        endTime: Date.now() + (eventData.payload?.remainingBetDuration || 0),
        // resultHistory: [...state.resultHistory],
      };
    }
    case BaseEvents.RoundEnd: {
      const eventData = event as RoundEndEvent;
      return {
        ...state,
        roundInfo: eventData.payload,
        // resultHistory: [...state.resultHistory],
      };
    }

    // case Events.ResultHistory: {
    //     const eventData = event as ResultedHistoryEvent;
    //     return {
    //         ...state,
    //         resultHistory: eventData.payload.resultedNumbers,
    //     };
    // }

    default:
      return state;
  }
};

export const GameProvider = ({ children }: GameProviderProps) => {
  const socket = useSocket();

  const currentUser = useUserStore((s) => s.user);
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

useEffect(() => {
  if (!currentUser) return;

  socket.emit(BaseEvents.UserJoin, currentUser);

  const handleUsersUpdate = (event: UsersUpdateEvent) => {
    dispatch(event);
  };

  socket.on(BaseEvents.UsersUpdate, handleUsersUpdate);

  return () => {
    socket.off(BaseEvents.UsersUpdate, handleUsersUpdate);
  };
}, [currentUser, socket]);

  const value = useMemo(
    () => ({
      gameState,
    }),
    [gameState]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = (): GameContextProps => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a gameProvider');
  }
  return context;
};
