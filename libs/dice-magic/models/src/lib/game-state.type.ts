import { PlayerPayout, RoundEndEvent, RoundStartEvent } from "@shared/events";
import { OrbitPublicUserData } from "@shared/models";
import { PlayerData } from "./player.type";

export type RoundData = Partial<
    RoundStartEvent['payload'] & RoundEndEvent['payload']
>;

export interface GameState {
  user: OrbitPublicUserData | null;
  roundInfo: RoundData | null;
  players: PlayerData[];
  payouts: PlayerPayout[];
  endTime: number;
}