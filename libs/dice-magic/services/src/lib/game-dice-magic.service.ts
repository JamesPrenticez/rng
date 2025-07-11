import type { IUserServer, OrbitGameUser } from '@shared/websocket';
import { Events, type PlayerSitEvent, type IGameContext, IDiceMagicPlayer, DiceMagicPlayer, DiceMagicStates, IDiceMagicPlayers, createPlayersEvent } from '@dice-magic/models';

import { BaseEvents, createEvent, createResponseEvent, createUsersUpdateEvent, type ResponseMessage } from '@shared/events';
import { PlayerSitHandler } from '@dice-magic/handlers';
import { DiceMagicState } from '@dice-magic/models';
import { GameStatus } from '@shared/game/game-state-logger';
import { StateMachine } from '@shared/state-machine';

const defaultState: DiceMagicState = {
    roundId: '',
    players: [],
    dealer: DiceMagicPlayer('', '', -1),
    timer: null,
    roundStart: null,
    totalUsers: 0,
    totalPlayers: 0,
    totalBet: 0,
    totalWon: 0,
    status: GameStatus.Online,
    startTime: null,
    endTime: null,
};

const stateMachine = StateMachine<DiceMagicState, DiceMagicStates>(
    defaultState,
    [ 
      // TODO add interupts here
    ],
    DiceMagicStates.WaitingForPlayers
);

interface DiceMagicSettings {
  name: string;
  tableSeatLimit: number;
}

const Players = (): IDiceMagicPlayers => {
  const map = new Map<number, IDiceMagicPlayer>(); 

  return {
    add(seat: number, data: IDiceMagicPlayer) { map.set(seat, data); },
    get(seat: number) { return map.get(seat) || null; },
    delete(seat: number) { map.delete(seat); },
    toArray() { return Array.from(map.values()); },
    cloneArray() {
        return Array.from(map.values()).map((p) => p.clone());
    },
    forEach: (callbackFn) => map.forEach(callbackFn),
  };
};

export const DiceMagicGame = (
  userServer: IUserServer,
  settings: DiceMagicSettings
) => {

  const context: IGameContext = {
    players: Players(),
    stateMachine,
    settings,
  };

  const broadcastPlayers = () => {
    const playersData = context.players.toArray();
    userServer.broadcast(createPlayersEvent(playersData), playersData);
  };

  const Handler = <T>(cb: (user: OrbitGameUser, event: T, context: IGameContext) => ResponseMessage | Promise<ResponseMessage>) => {
    return async (user: OrbitGameUser, event: T) => {
      const res = await cb(user, event, context);
      if (res.status !== 200) {
        console.log(event, res);
      }
      user.socket.emit(...createResponseEvent(event.message_id, res));
      broadcastPlayers();
    };
  };

  userServer.emitter.on(
    Events.PlayerSit,
    Handler<PlayerSitEvent>(PlayerSitHandler)
  );

  return {
    cleanup: () => {
      // stop intervals, listeners if you add them later
    },
  };
};
