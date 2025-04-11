import styled from '@emotion/styled';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';

import { PlayerPayout } from '../player.models';
import { formatCurrency } from '../../utils/format-currency';

import { scrollUp } from '../scroll';
import { WinnersListBackground } from './winners-list-background';

const Container = styled.div<{
    width: number;
    height: number;
    margin: string;
}>`
    position: relative;
    display: flex;
    flex-direction: column;

    margin: ${({ margin }) => margin};

    width: ${({ width }) => `${width}rem`};
    height: ${({ height }) => `${height}rem`};

    overflow: hidden;

    &.hidden {
        display: none;
    }

    &.finished {
        opacity: 0;
        transition: opacity 250ms ease-in-out;
    }

    .inner-wrapper {
        height: auto;
        min-height: 100%;
        position: relative;
        overflow: hidden;
        position: relative;
        background: transparent;
        mask-image: linear-gradient(
            to top,
            rgba(0, 0, 0, 1) 70%,
            rgba(0, 0, 0, 0.2) 100%
        );
        mask-size: 100% 100%;
        mask-repeat: no-repeat;
    }

    .inner-container {
        width: 100%;
        height: auto;
        min-height: 100%;

        &.hidden {
            visibility: hidden;
        }
    }

    .scroll {
        animation: ${scrollUp} 10s linear 1 forwards;
    }

    .winner-title {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        box-sizing: border-box;

        color: var(--color-primary);
        font-family: 'Chakra Petch';
        font-size: 2.1rem;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        margin-right: 1rem;
    }

    .underline {
        width: 70%;
        height: 0.1rem;
        padding: 0.1rem 0rem;
        background: linear-gradient(
            90deg,
            var(--color-border-accent) 0%,
            rgba(100, 184, 255, 0) 100%
        );
    }

    .winning-names {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: start;

        width: 100%;
        height: 90%;
        margin-left: 2rem;

        box-sizing: border-box;
        margin-top: 1.1rem;

        color: var(--color-theme-black);

        font-family: 'Chakra Petch' sans-serif;
        font-size: 1.5rem;
        font-style: normal;
        font-weight: 600;
        line-height: normal;

        .winner {
            display: flex;
            flex-direction: row;

            justify-content: start;
            align-items: center;

            margin-bottom: 0.9rem;

            .name {
                color: var(--color-white-100);
                text-transform: uppercase;
            }

            .amount {
                color: var(--color-white-100);
                margin-right: 1rem;
            }
        }
    }
`;

export interface Payouts {
    name: string;
    totalPayout: number;
}

interface WinnersListProps {
    width: number;
    height: number;
    margin?: string;
    data?: Payouts[];
    setData: React.Dispatch<React.SetStateAction<PlayerPayout[]>>;
    currency: string;
}

export const WinnersList = ({
    width,
    height,
    margin = '0rem 0rem 2rem 4rem',
    data,
    currency,
    setData,
}: WinnersListProps) => {
    const outterContainerRef = useRef<HTMLDivElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [play, setPlay] = useState(false);
    const [initialLoad, setIntialLoad] = useState(true);

    const roundWinners = useMemo(() => data ?? [], [data]);

    // 1. Handles setting play to true when roundWinners change.
    useEffect(() => {
        if (roundWinners.length >= 1) {
            setPlay(true);
            setIntialLoad(false);
        }
    }, [roundWinners]);

    // Listens for the animationend event and stops the animation
    // useEffect(() => {
    //     const scrollEle = scrollRef.current;

    //     if (!scrollEle) return;

    //     const handleAnimationEnd = () => {
    //         setPlay(false);
    //     };

    //     scrollEle.addEventListener('animationend', handleAnimationEnd);

    //     return () => {
    //         scrollEle.removeEventListener('animationend', handleAnimationEnd);
    //     };
    // }, [roundWinners]);

    // Periodically checks if the last .winner reached the top and stops the animation.
    useEffect(() => {
        const scrollEle = scrollRef.current;

        if (!scrollEle) return;

        const checkLastItemPosition = () => {
            const lastItem = scrollEle.querySelector('.winner:last-child');
            const outterContainer = outterContainerRef.current;

            if (lastItem && outterContainer) {
                const lastItemRect = lastItem.getBoundingClientRect();
                const outterRect = outterContainer.getBoundingClientRect();

                if (lastItemRect.top <= outterRect.top) {
                    setPlay(false);
                    clearInterval(interval);
                    setData([]);
                }
            }
        };

        const interval = setInterval(checkLastItemPosition, 200);

        return () => clearInterval(interval);
    }, [roundWinners, setData]);

    return (
        <Container
            ref={outterContainerRef}
            className={clsx({
                hidden: initialLoad,
                finished: roundWinners.length === 0,
            })}
            width={width}
            height={height}
            margin={margin}
        >
            <WinnersListBackground
                padding="1rem"
                borderRadius="0.8rem"
                glowColor="primary"
                fade={play}
            >
                <div className="winner-title">
                    {`${roundWinners.length} Winner${
                        roundWinners.length > 1 ? 's' : ''
                    } `}
                </div>
                <div className="underline" />

                <div className="inner-wrapper">
                    <div
                        ref={scrollRef}
                        className={`
                      inner-container
                      ${play ? 'scroll' : 'hidden'}
                    `}
                    >
                        <div className="winning-names">
                            {roundWinners.map(
                                ({ totalPayout, name }, index) => {
                                    return (
                                        <div
                                            className="winner"
                                            key={index + '-' + name}
                                        >
                                            <span className="amount">{`${formatCurrency(
                                                totalPayout,
                                                currency
                                            )}`}</span>
                                            <span className="name">{name}</span>{' '}
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </div>
            </WinnersListBackground>
        </Container>
    );
};
