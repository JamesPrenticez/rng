export enum PlayerBet {
  BASE = 'base',
  BEHIND = 'behind',
  PERFECT_PAIRS = 'perfect_pairs',
  TWENTY_ONE = 'twenty_one',
  INSURANCE = 'insurance',
}

export type IPlayerWins = {
  [key in Exclude<PlayerBet, PlayerBet.BEHIND>]: number;
};

export type IPlayerBets = {
  [key in Exclude<PlayerBet, PlayerBet.BEHIND>]: number;
};

export interface PlayerPayout {
  player_id: string;
  seat: number;
  hand: number;
  type: PlayerBet;
  bet: number;
  payout: number;
  multiplier: number;
}