import { useGameContext } from '@dice-magic/contexts';
import { PlayerData } from '@dice-magic/models';
import styled from '@emotion/styled';
import { Button, ButtonVariants } from '@shared/components';
import { useBaseAppContext } from '@shared/contexts';
import { useUserStore } from '@shared/stores';
import { useMemo } from 'react';
import { UserRoundPlus, UserRoundMinus, UserLock } from 'lucide-react';
import clsx from 'clsx';

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  padding: 1rem;

  color: var(--color-text);
  font-family: 'Quicksand';
  font-size: 2.4rem;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  width: 35rem;
  z-index: 9999;

  .user-title {
    text-align: center;
    color: var(--color-accent);
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const SeatContainer = styled.div`
  display: flex;

  p {
    color: var(--color-grey-40);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .plus {
    color: rgba(var(--color-rag-green-opacity), 0.8);
  }

  .minus {
    color: rgba(var(--color-rag-red-opacity), 0.8);
  }

  .lock {
    color: rgba(var(--color-rag-amber-opacity), 0.8);
    cursor: default;
  }
`;

const SeatButton = styled(Button)`
  && {
    margin-left: auto;

    svg {
      width: 2.8rem;
    }
  }
`;

export const UsersInRoom = () => {
  const { baseAppState } = useBaseAppContext();
  const { gameState, gameInfo, handlePlayerSit, handlePlayerLeaveSeat } =
    useGameContext();
  const user = useUserStore((s) => s.user);
  const totalSeats = gameInfo.settings.tableSeatLimit;

  const handleSitOrLeave = (seat: number, isPlayer: boolean) => {
    return !isPlayer ? handlePlayerSit(seat) : handlePlayerLeaveSeat(seat);
  };

  const seatToPlayer = useMemo(() => {
    const map = new Map<number, PlayerData>();
    for (const player of gameState.players) {
      map.set(player.seat, player);
    }
    return map;
  }, [gameState.players]);

  return (
    <Container>
      <p className="user-title">{user?.username}</p>

      {Array.from({ length: totalSeats }).map((_, seat) => {
        const player = seatToPlayer.get(seat);
        const isCurrentPlayer = player?.name === user?.username;

        return (
          <SeatContainer key={seat} className={clsx()}>
            <p>
              {seat + 1}: {player?.name ?? 'Empty'}
            </p>
            {!player || isCurrentPlayer ? (
              <SeatButton
                variant={ButtonVariants.SKELETON}
                onClick={() => handleSitOrLeave(seat, !!player)}
              >
                {isCurrentPlayer ? (
                  <UserRoundMinus className="minus" />
                ) : (
                  <UserRoundPlus className="plus" />
                )}
              </SeatButton>
            ) : (
              <SeatButton variant={ButtonVariants.SKELETON}>
                <UserLock className="lock" />
              </SeatButton>
            )}
          </SeatContainer>
        );
      })}
    </Container>
  );
};
