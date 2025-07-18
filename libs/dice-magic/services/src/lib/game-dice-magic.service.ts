import {
  DiceMagicEvents,
  DiceMagicState,
  DiceMagicStates,
  IDiceMagicPlayers,
  IGameContext,
  IDiceMagicPlayer,
  createPlayersEvent,
  PlayerData,
  Events,
  PlayerSitEvent,
  PlayerLeaveSeatEvent,
  IDiceMagicSettings,
} from '@dice-magic/models';
import { GameStatus } from '@shared/models';
import { StateMachine } from '@shared/state-machine';
import { PlayerLeaveSeatHandler, PlayerSitHandler, RoundEndState } from '@dice-magic/handlers';
import {
  createResponseEvent,
  IBaseEvent,
  ResponseMessage,
} from '@shared/events';
import { IUserServer, OrbitGameUser } from '@shared/websocket';

const defaultState: DiceMagicState = {
  roundId: '',
  cards: [],
  players: [],
  dealer: null,
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
  [RoundEndState],
  DiceMagicStates.WaitingForPlayers
);

const Players = (): IDiceMagicPlayers => {
  const map = new Map<number, IDiceMagicPlayer>();
  return {
    add(seat: number, data: IDiceMagicPlayer) {
      map.set(seat, data);
    },
    get(seat: number) {
      return map.get(seat) || null;
    },
    delete(seat: number) {
      map.delete(seat);
    },
    toArray() {
      return Array.from(map.values());
    },
    cloneArray() {
      return Array.from(map.values()).map((p) => p.clone());
    },
    forEach: (callbackFn) => map.forEach(callbackFn),
  };
};

export const DiceMagicGame = (
  userServer: IUserServer,
  settings: IDiceMagicSettings
) => {
  
  const context: IGameContext = {
    players: Players(),
    stateMachine, // Not being used yet
    userServer,
    intervalTimer: null,
    settings
  };

  // const listener = stateMachine.onStateChange(StateChangeHandler(context));

  // Broadcast to all Players
  const broadcastPlayers = () => {
    const data = context.players.toArray().map((p) => p.toData());

    const dealer = true; //context.stateMachine.getData().dealer;

    if (dealer) {
      userServer.broadcast(
        createPlayersEvent(
          data,
          {} as PlayerData, //dealer.toData(),
          '' //context.leaderRank[0] || ''
        ),
        [DiceMagicEvents.Players]
      );
    }
  };

  // Any event that happens runs through this Handler
  // Which broadcasts it to all players
  const Handler = <T extends IBaseEvent<DiceMagicEvents>[1]>(
    cb: (
      user: OrbitGameUser,
      event: T,
      context: IGameContext
    ) => ResponseMessage | Promise<ResponseMessage>
  ) => {
    return async (user: OrbitGameUser, event: T) => {
      const res = await cb(user, event, context);

      if (res.status !== 200) {
        console.log(event.event, res);
      }
      user.socket.emit(...createResponseEvent(event.message_id, res));

      broadcastPlayers();
    };
  };

  // NOTE: Emitter is two way
  // emitter.on = recieve
  // emitter.emit = send 
  userServer.emitter.on(
    Events.PlayerSit,
    Handler<PlayerSitEvent>(PlayerSitHandler)
  );

  userServer.emitter.on(
    Events.PlayerLeaveSeat,
    Handler<PlayerLeaveSeatEvent>(PlayerLeaveSeatHandler)
  );

  return;
};
