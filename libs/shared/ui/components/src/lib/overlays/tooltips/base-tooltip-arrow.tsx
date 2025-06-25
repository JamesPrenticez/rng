import styled from '@emotion/styled';
import type React from 'react';

import type { TooltipSide } from './tooltip.types';

const OFFSET = 18;

const StyledArrow = styled.svg`
  position: absolute;
  color: red;

  &.side-top {
    bottom: -${OFFSET}px;
    left: 50%;
    transform: translateX(-50%) rotate(90deg);
  }

  &.side-right {
    left: -${OFFSET}px;
    top: 50%;
    transform: translateY(-50%) rotate(180deg);
  }

  &.side-bottom {
    top: -${OFFSET}px;
    left: 50%;
    transform: translateX(-50%) rotate(-90deg);
  }

  &.side-left {
    right: -${OFFSET}px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

interface ArrowProps extends React.SVGAttributes<SVGElement> {
    side: TooltipSide;
}

export const Arrow = ({ side, ...rest }: ArrowProps) => {
    return (
        <StyledArrow
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className={`side-${side}`}
            {...rest}
        >
            <polygon points="6 3 20 12 6 21 6 3" />
        </StyledArrow>
    );
};
