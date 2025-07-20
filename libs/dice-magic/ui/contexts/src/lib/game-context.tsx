import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
  useCallback,
} from 'react';
import { useWebsocketContext } from '@shared/contexts';

import { createPlayerSitEvent, DiceMagicEvents, GameState } from '@dice-magic/models';
import {
  IBaseEvent,
  BaseEvents,
  RoundStartEvent,
  RoundEndEvent,
  UsersUpdateEvent,
  ResponseEvent,
} from '@shared/events';
import { useUserStore } from '@shared/stores';

interface GameContextProps {
  gameState: GameState;
  handlePlayerSit: (seatId: number) => void;
}

interface GameProviderProps {
  children: ReactNode;
}

const responseHandler = (response: ResponseEvent) => {
    if (response.payload.status > 400) {
      // This handles "seat taken"
      console.log(response.payload.message)
      // toast(response.payload.message);
    }
};

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


    default:
      return state;
  }
};

export const GameProvider = ({ children }: GameProviderProps) => {
  const socket = useWebsocketContext();

  const currentUser = useUserStore((s) => s.user);
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const handlePlayerSit = useCallback(
    (seatId: number) => {
      const event = createPlayerSitEvent(seatId);

      console.log(event)

      socket.emitWithResponse(event).then(responseHandler);
    },
    [socket]
  );

  useEffect(() => {
    if (!currentUser) return;
    // User joined game
    // TODO add this to valid event
    // socket.emit(BaseEvents.UserJoin, currentUser);

    // User took a seat
    // socket.on(BaseEvents.UserSit, handlePlayerSit);

    return () => {
      // socket.off(BaseEvents.UserSit, handlePlayerSit);
    };
  }, [currentUser, socket]);

  const value = useMemo(
    () => ({
      gameState,
      handlePlayerSit
    }),
    [
      gameState,
      handlePlayerSit
    ]
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
