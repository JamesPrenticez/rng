import { PlayerPayout, RoundEndEvent, RoundStartEvent } from "@shared/events";
import { User } from "@shared/models";

export type RoundData = Partial<
    RoundStartEvent['payload'] & RoundEndEvent['payload']
>;

export interface GameState {
  roundInfo: RoundData | null;
  players: User[];
  payouts: PlayerPayout[];
  endTime: number;
}