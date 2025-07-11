import { OrbitUserData } from "@shared/models";
import { PlayerData } from "./player.type";
import { RoundEndEvent, RoundStartEvent } from "@shared/events";

export type RoundData = Partial<
    RoundStartEvent['payload'] & RoundEndEvent['payload']
>;

export interface GameState {
    user: OrbitUserData | null;
    userSeatIds: number[];
    dealer: PlayerData | null;
    // gameLeader: GameLeader | null;
    // additionalFundsRequired: AdditionalFundsRequiredData | null;
    kickedFromSeat: {
        isKicked: boolean;
        timeKicked: number;
    };
    isKickedFromGame: boolean;
    players: PlayerData[];
    // gameInfo: GameInfoData | null;
    roundInfo: RoundData | null;
    // finalisedBetTotal: number | null;
    // currentState: GameStateEvent['payload'];
    // currentAction: PlayerTurnData | null;
    // playerPreActions: RoundAction[];
    // insuranceInfo: InsuranceOfferData | null;
}