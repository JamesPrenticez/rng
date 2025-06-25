import styled from '@emotion/styled';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

import { Arrow } from './base-tooltip-arrow';
import type { TooltipSide } from './tooltip.types';

const Wrapper = styled.div`
    position: fixed;
    z-index: 1000;

    &.side-top {
      transform: translateY(-50%);
    }

    &.side-bottom {
      transform: translateY(50%);
    }

    &.side-left {
        transform: translateX(-50%);
    }

    &.side-right {
        transform: translateX(50%);
    }
`;

const Container = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    width: auto;
    min-height: 2.8rem;
    min-width: 10rem;

    padding: 0.4rem 1rem;

    background-color: rgba(var(--color-black-100-opacity), 0.7);
    backdrop-filter: blur(7.5px);

    border-radius: 0.6rem;
    border: 0.1rem solid var(--color-primary);

    color: var(--color-white-100);
    font-family: 'Chakra Petch';
    font-size: calc(max(1.1rem, 10px));
    font-weight: 600;
    text-align: center;

    box-sizing: border-box;
    transform: translate(-50%, -50%);
`;

export interface BaseTooltipProps extends PropsWithChildren {
    id: string;
    top: string | number; // position.y
    left: string | number; // postion.x
    side: TooltipSide;
    hasArrow?: boolean;
}

export const BaseTooltip = ({
    top,
    left,
    side,
    hasArrow,
    children,
}: BaseTooltipProps) => {
    return (
        <Wrapper
            className={`side-${side}`}
            style={{
                top,
                left,
            }}
        >
            <Container>
                {children}

                {/* {hasArrow && <Arrow side={side} />} */}
            </Container>
        </Wrapper>
    );
};
