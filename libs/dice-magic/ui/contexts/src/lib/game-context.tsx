import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { useWebsocketContext } from '@shared/contexts';

import {
  createPlayerLeaveSeatEvent,
  createPlayerSitEvent,
  DiceMagicEvents,
  Events,
  GameInfo,
  GameState,
  PlayersEvent,
} from '@dice-magic/models';
import {
  IBaseEvent,
  BaseEvents,
  ResponseEvent,
} from '@shared/events';
import { toast } from "react-hot-toast"

interface GameContextProps {
  gameState: GameState;
  gameInfo: GameInfo;
  handlePlayerSit: (seatId: number) => void;
  handlePlayerLeaveSeat: (seatId: number) => void;
}

interface GameProviderProps {
  children: ReactNode;
}

const responseHandler = (response: ResponseEvent) => {
  if (response.payload.status > 400) {
    // This handles "seat taken"
    toast.error(response.payload.message);
  }
};

const GameContext = createContext<GameContextProps | undefined>(undefined);

const initialGameState: GameState = {
  user: null,
  roundInfo: null,
  players: [],
  payouts: [],
  endTime: 0,
};

const initialGameInfo: GameInfo = {
  settings: {
    name: " Dice Magic",
    tableSeatLimit: 4
  }
}

type GameReducer = (
  state: GameState,
  event: IBaseEvent<DiceMagicEvents | BaseEvents | unknown>[1]
) => GameState;

const gameReducer: GameReducer = (state, event): GameState => {
  switch (event.event) {
    case Events.Players: {
      const eventData = event as PlayersEvent;
      // const currentPlayerSeats = eventData.payload.players.reduce(
      //   (acc: number[], player) => {
      //     if (player.user_id === state?.user?.id) {
      //       acc.push(player.seat);
      //     }
      //     return acc;
      //   },
      //   []
      // );

      return {
        ...state,
        players: eventData.payload.players,
        // userSeatIds: currentPlayerSeats,
        // dealer: eventData.payload.dealer,
        // gameLeader: {
        //   ...state.gameLeader,
        //   gameLeaderId: eventData.payload.gameLeader,
        //   isGameLeader: eventData.payload.gameLeader === state.user?.id,
        // },
      };
    }

    default:
      return state;
  }
};

export const GameProvider = ({ children }: GameProviderProps) => {
  const socket = useWebsocketContext();
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [gameInfo, setGameInfo] = useState(initialGameInfo)

  const handlePlayerSit = useCallback(
    (seatId: number) => {
      const event = createPlayerSitEvent(seatId);
      socket.emitWithResponse(event).then(responseHandler);
    },
    [socket]
  );

  const handlePlayerLeaveSeat = useCallback(
    (seatId: number) => {
        const event = createPlayerLeaveSeatEvent(seatId);
        socket.emitWithResponse(event).then((res) => console.log(res));
    },
    [socket]
  );

  useEffect(() => {
    // Effectivly the Responce of Player Sit Handler
    socket.on(DiceMagicEvents.Players, (playerEvent) => {
        console.log(DiceMagicEvents.Players, playerEvent.payload);
        dispatch(playerEvent);
    });

    socket.onAny((event, ...args) => {
      console.log("Received event:", event, args);
    });

    return () => {
      socket.off(DiceMagicEvents.Players);   
    };
  }, [socket]);

  const value = useMemo(
    () => ({
      gameState,
      gameInfo,
      handlePlayerSit,
      handlePlayerLeaveSeat
    }),
    [gameState, handlePlayerSit]
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
