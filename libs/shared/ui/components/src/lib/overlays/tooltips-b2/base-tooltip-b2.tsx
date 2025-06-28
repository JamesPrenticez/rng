// Updated BaseTooltip (remove CSS transforms)
import styled from '@emotion/styled';
import { forwardRef } from 'react';
import { Arrow } from './arrow';
import { TooltipSide } from './notification-b2.store';

const Wrapper = styled.div`
    position: fixed;
    z-index: 1000;
    /* Remove all the transform CSS - positioning handled by hook */
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
    font-family: 'Aronui';
    font-size: calc(max(1.1rem, 10px));
    font-weight: 400;
    text-align: center;
    box-sizing: border-box;
    /* Remove transform: translate(-50%, -50%) */
`;

export interface BaseTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string;
    top: string | number;
    left: string | number;
    side: TooltipSide;
    hasArrow?: boolean;
}

export const BaseTooltip = forwardRef<HTMLDivElement, BaseTooltipProps>(
  ({ top, left, side, hasArrow, children, style }, ref) => {
    return (
        <Wrapper
            ref={ref}
            className={`side-${side}`}
            style={{
                top,
                left,
                ...style
            }}
        >
            <Container>
                {children}
                {hasArrow && <Arrow side={side} />}
            </Container>
        </Wrapper>
    );
  }
);

BaseTooltip.displayName = 'BaseTooltip';