// import { type ICard, PlayerAction, PlayerState } from '@shared/models';

// import {
//     type BlackJackPlayerState,
//     type IBlackJackPlayer,
//     type IBlackJackPlayerState,
//     type IPlayerCard,
//     PerfectPairs,
//     PlayerBet,
//     type PlayerData,
//     TwentyOnePlus,
// } from './types';
// import { calculateScore } from './utils';
import { IDiceMagicPlayer, IDiceMagicPlayerState, PlayerData } from './lib/player.type';

export const DiceMagicPlayer = (
    id: string,
    name: string,
    seat: number,
    data: Partial<IDiceMagicPlayerState> = {}
): IDiceMagicPlayer => {
    let state: IDiceMagicPlayerState = {
        cards: [],
    //     firstCards: [],
    //     handActions: [[], []],
    //     bets: {
    //         base: 0,
    //         perfect_pairs: 0,
    //         twenty_one: 0,
    //         insurance: 0,
    //     },
    //     winAmounts: {
    //         base: 0,
    //         perfect_pairs: 0,
    //         twenty_one: 0,
    //         insurance: 0,
    //     },
    //     sideBets: {
    //         perfectPairs: PerfectPairs.None,
    //         twentyOne: TwentyOnePlus.None,
    //     },
    //     winStreak: 0,
    //     behindBets: [],
    //     isDisconnected: false,
    //     state: [PlayerState.IDLE, PlayerState.IDLE],
    //     lockedIn: false,
    //     lastActionTimes: [null, null],
    //     hasInsurance: false,
    //     ...data,
    };

    const cards = () => state.cards;
    // const actions = () => state.handActions[0];

    // const addCard = (card: IPlayerCard) => {
    //     state.cards.push(card);

    //     if (state.cards.length < 3) {
    //         state.firstCards.push(card);
    //     }
    // };

    // const addCards = (cards: IPlayerCard[]) => {
    //     if (cards.length === 2 && state.cards.length === 0) {
    //         state.firstCards.push(...cards);
    //     }

    //     state.cards.push(...cards);
    // };
    // const cardsForHand = (hand: number) => {
    //     return state.cards.filter((c) => hand === c.hand);
    // };

    // const canSplit = () => {
    //     if (state.cards.length < 2) return false;

    //     if (
    //         Math.min(10, state.cards[0].value) !==
    //         Math.min(10, state.cards[1].value)
    //     )
    //         return false;

    //     return true;
    // };

    // const addAction = (action: PlayerAction) => {
    //     // Check if player can split
    //     if (action === PlayerAction.SPLIT) {
    //         if (!canSplit()) return;
    //     }

    //     state.lastActionTimes[getCurrentHand()] = Date.now();
    //     state.handActions[getCurrentHand()].push(action);
    // };

    // const addBetBehind = (amount: number, user_id: string) => {
    //     //  NOTE: check if a behind bet has already been placed by this user
    //     const existing = state.behindBets.find((b) => b.user_id === user_id);

    //     if (existing) {
    //         if (amount === 0) {
    //             state.behindBets = state.behindBets.filter(
    //                 (b) => b.user_id !== user_id
    //             );
    //         } else {
    //             existing.amount = amount;
    //         }
    //     } else {
    //         if (amount > 0) state.behindBets.push({ user_id, amount });
    //     }
    // };

    // const addBet = (amount: number, type: PlayerBet, user_id?: string) => {
    //     switch (type) {
    //         case PlayerBet.BEHIND:
    //             addBetBehind(amount, user_id || '');
    //             break;
    //         default:
    //             state.bets[type] = amount;
    //             break;
    //     }
    // };

    // const clearCards = () => {
    //     state.cards = [];
    // };

    // const clearState = () => {
    //     state.handActions = [[], []];
    //     state.cards = [];
    //     state.winAmounts = {
    //         base: 0,
    //         perfect_pairs: 0,
    //         twenty_one: 0,
    //         insurance: 0,
    //     };

    //     state.bets = {
    //         base: 0,
    //         perfect_pairs: 0,
    //         twenty_one: 0,
    //         insurance: 0,
    //     };

    //     state.behindBets = [];
    //     state.firstCards = [];

    //     state.state = [PlayerState.IDLE, PlayerState.IDLE];
    //     state.lockedIn = false;
    // };

    const clone = () => {
        return DiceMagicPlayer(
            id,
            name,
            seat,
            JSON.parse(JSON.stringify(state))
        );
    };

    // const isFinished = () => {
    //     const actions = state.handActions[0];
    //     // After a double you only get 1 card

    //     if (actions[actions.length - 1] === PlayerAction.DOUBLE) {
    //         if (state.cards.length === 3) return true;
    //     }

    //     // After a split of ACES you only get 1 card per hand
    //     if (actions.includes(PlayerAction.SPLIT)) {
    //         if (state.firstCards[0].value === 1) {
    //             if (state.cards.length === 4) return true;
    //         }

    //         if (
    //             state.handActions[0].includes(PlayerAction.STAND) &&
    //             state.handActions[1].includes(PlayerAction.STAND)
    //         )
    //             return true;
    //     } else if (actions[actions.length - 1] === PlayerAction.STAND) {
    //         return true;
    //     }

    //     const scores = [calculateScore(cardsForHand(0), hasSplit())];

    //     if (actions.includes(PlayerAction.SPLIT)) {
    //         const hand1Stand = state.handActions[0].includes(
    //             PlayerAction.STAND
    //         );
    //         const hand2Stand = state.handActions[1].includes(
    //             PlayerAction.STAND
    //         );

    //         if (hand2Stand) return true;

    //         const score = calculateScore(cardsForHand(1), hasSplit());

    //         if (!hand1Stand && !hand2Stand) {
    //             scores.push(score);
    //         } else if (!hand2Stand) {
    //             scores[0] = score;
    //         }
    //     }

    //     if (scores.every((s) => s.min >= 21 || s.max >= 21 || s.blackjack)) {
    //         return true;
    //     }

    //     return false;
    // };

    // const isPlaying = () => {
    //     if (state.bets.base > 0) return true;
    //     return false;
    // };

    // const hasDoubled = () => {
    //     return state.handActions[0].includes(PlayerAction.DOUBLE);
    // };

    // const hasSplit = () => {
    //     return state.handActions[0].includes(PlayerAction.SPLIT);
    // };

    // const hasInsurance = () => {
    //     return (
    //         state.handActions[0].includes(PlayerAction.INSURANCE) &&
    //         state.hasInsurance
    //     );
    // };

    // const getCurrentHand = () => {
    //     if (hasSplit()) {
    //         if (state.handActions[0].includes(PlayerAction.STAND)) {
    //             return 1;
    //         }

    //         const score = calculateScore(cardsForHand(0));

    //         if (score.min >= 21 || score.blackjack) {
    //             return 1;
    //         }
    //     }
    //     return 0;
    // };

    // const incrementWinStreak = () => (state.winStreak += 1);
    // const clearWinStreak = () => (state.winStreak = 0);

    // // Output to clone into a new object
    // const getData = (): BlackJackPlayerState => {
    //     return {
    //         id,
    //         name,
    //         seat,
    //         cards: [...state.cards],
    //         firstCards: [...state.firstCards],
    //         handActions: [[...state.handActions[0]], [...state.handActions[1]]],
    //         behindBets: [...state.behindBets],
    //         bets: { ...state.bets },
    //         winAmounts: { ...state.winAmounts },
    //         sideBets: { ...state.sideBets },
    //         isDisconnected: state.isDisconnected,
    //         winStreak: state.winStreak,
    //         state: state.state,
    //         lockedIn: state.lockedIn,
    //         lastActionTimes: [...state.lastActionTimes],
    //         hasInsurance: state.hasInsurance,
    //     };
    // };

    // const actionsForHand = (hand: number) => {
    //     return state.handActions[hand];
    // };

    // const lastActionForHand = (hand: number) => {
    //     const hActions = actionsForHand(hand);
    //     return hActions.length > 0 ? hActions[hActions.length - 1] : null;
    // };

    // const setData = (data: Partial<IBlackJackPlayerState>) => {
    //     state = { ...state, ...data };
    // };

    // const getBets = () => {
    //     let base = state.bets.base;

    //     if (hasDoubled() || hasSplit()) {
    //         base *= 2;
    //     }

    //     return {
    //         ...state.bets,
    //         base,
    //     };
    // };

    // const getChips = () => {
    //     const baseAmount = state.bets.base;

    //     const chips = {
    //         insurance: hasInsurance() ? baseAmount / 2 : 0,
    //         double: hasDoubled() ? baseAmount * 2 : 0,
    //         split: hasSplit() ? baseAmount * 2 : 0,
    //     };

    //     return chips;
    // };

    // // Output for sending via json etc
    const toData = (): PlayerData => {
        // const scores = [calculateScore(cardsForHand(0), hasSplit())];
        //const cards = [] //[cardsForHand(0)];

        // if (hasSplit()) {
        //     scores.push(calculateScore(cardsForHand(1), hasSplit()));
        //     cards.push(cardsForHand(1));
        // }

         return {
            user_id: id,
            name: name,
            seat,
            // bets: getBets(),
            // betBehinds: state.behindBets,
            // winAmounts: state.winAmounts,
            // winStreak: state.winStreak,
            // chips: getChips(),
            // scores,
            // cards,
            // lastAction: lastActionForHand(0),
            // lastActions: [lastActionForHand(0), lastActionForHand(1)],
            // lastActionTime: state.lastActionTimes[0],
            // lastActionTimes: [
            //     state.lastActionTimes[0],
            //     state.lastActionTimes[1],
            // ],
            // isFinished: isFinished(),
            // isPlaying: isPlaying(),
            // state: state.state[0],
            // states: state.state,
        };
    };

    // const getPlayerActions = (dealerCard: ICard): PlayerAction[] => {
    //     const playerActions = [PlayerAction.HIT, PlayerAction.STAND];
    //     // First turn
    //     if (state.cards.length === 2) {
    //         playerActions.push(PlayerAction.DOUBLE);

    //         // Dealer has an ACE
    //         if (dealerCard.value === 1) {
    //             // TODO: Check if they have enough credits
    //             // This may have to be for all seats?
    //             playerActions.push(PlayerAction.INSURANCE);
    //         }

    //         // Split
    //         if (canSplit()) {
    //             return [...playerActions, PlayerAction.SPLIT];
    //         }
    //     }

    //     return [...playerActions];
    // };

    // const setDisconnected = (isDisconnected: boolean) => {
    //     setData({ isDisconnected });
    // };

    // const updatePlayerState = (newState: PlayerState, hand = 0) => {
    //     state.state[hand] = newState;
    // };

    // const setHasInsurance = (hasInsurance: boolean) => {
    //     state.hasInsurance = hasInsurance;
    //     addAction(PlayerAction.INSURANCE);
    // };

    return {
        id,
        name,
        seat,
        cards,
        // actions,
        // actionsForHand,

        // isPlaying,
        // isFinished,
        // hasInsurance,
        // canSplit,
        // hasSplit,
        // hasDoubled,

        // score: (hand = 0) => calculateScore(cardsForHand(hand), hasSplit()),
        // isLockedIn: () => state.lockedIn,
        // lockIn: () => (state.lockedIn = true),

        // addCard,
        // addCards,
        // addAction,
        // addBet,

        // clearCards,
        // clearState,

        // cardsForHand,
        // getCurrentHand,

        // getPlayerActions,

        clone,
        // getData,
        // setData,
        // setDisconnected,

        // setHasInsurance,

        toData,

        // updatePlayerState,

        // incrementWinStreak,
        // clearWinStreak,
    };
};
