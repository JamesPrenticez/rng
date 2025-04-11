import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';

import {
    fadeInAndExpandFullHeight,
    fadeOutContractFullHeight,
} from './animations';

// Used in Game Round Winners Component
// libs\shared\ui\components\src\lib\round-winners-desktop.tsx

const Container = styled.div<{ padding: string; borderRadius: string }>`
    width: 100%;
    height: 0rem;

    position: absolute;
    inset: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    pointer-events: none;

    color: var(--color-white-100);
    font-family: 'Chakra Petch', sans-serif;
    font-size: 3.2rem;
    font-weight: 600;

    transition-property: height, opacity;
    transition-duration: 2s;
    transition-timing-function: ease-in-out;

    z-index: 1;

    &.fadeInAndExpandFullHeight {
        animation: ${fadeInAndExpandFullHeight} 0.5s forwards;
    }

    &.fadeOutAndContractFullHeight {
        animation: ${fadeOutContractFullHeight} 0.5s forwards;
    }

    .blur {
        position: absolute;
        inset: 0;
        backdrop-filter: blur(2rem);
        -webkit-backdrop-filter: blur(2rem);
        background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.79) 11.53%,
            rgba(0, 0, 0, 0) 96.06%
        );
        z-index: -1;
        border-radius: ${({ borderRadius }) => borderRadius};
    }

    .circle-container {
        position: absolute;
        inset: 0;
        width: 100%;
        min-height: 100%;
        position: relative;
        overflow: hidden;
    }

    .circle-gradient {
        position: absolute;
        top: 0;
        left: 0;
        width: 32.4rem;
        height: 8.3rem;
        display: flex;

        background-color: var(--color-primary);
        border-radius: 50%;
        filter: blur(5rem);
        transform: translate(0rem, -4rem); // Position circle
    }

    .child-wrapper {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        z-index: 50;
        padding: ${({ padding }) => padding};
    }
`;

interface WinnersListBackgroundProps extends PropsWithChildren {
    padding?: string;
    borderRadius?: string;
    glowColor: 'primary';
    fade?: boolean;
    height?: string;
}

export const WinnersListBackground = ({
    padding,
    glowColor,
    borderRadius,
    fade = true,
    children,
}: WinnersListBackgroundProps) => {
    return (
        <Container
            className={`${
                fade
                    ? 'fadeInAndExpandFullHeight '
                    : 'fadeOutAndContractFullHeight '
            }`}
            padding={padding ?? ''}
            borderRadius={borderRadius ?? ''}
        >
            <div className="circle-container">
                <div className="circle-gradient"></div>
            </div>
            <div className="blur" />
            <div className="child-wrapper">{children}</div>
        </Container>
    );
};
