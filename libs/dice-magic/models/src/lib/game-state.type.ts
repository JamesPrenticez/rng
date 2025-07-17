import { PlayerPayout, RoundEndEvent, RoundStartEvent } from "@shared/events";
import { OrbitUserData } from "@shared/models";

export type RoundData = Partial<
    RoundStartEvent['payload'] & RoundEndEvent['payload']
>;

export interface GameState {
  roundInfo: RoundData | null;
  players: OrbitUserData[];
  payouts: PlayerPayout[];
  endTime: number;
}