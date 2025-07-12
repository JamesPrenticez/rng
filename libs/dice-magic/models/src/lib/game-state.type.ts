import { PlayerPayout, RoundEndEvent, RoundStartEvent } from "@shared/events";
import { User } from "@shared/models";
import { PlayerData } from "./player.type";

export type RoundData = Partial<
    RoundStartEvent['payload'] & RoundEndEvent['payload']
>;

export interface GameState {
  roundInfo: RoundData | null;
  users: User[];
  players: PlayerData[];
  payouts: PlayerPayout[];
  endTime: number;
}