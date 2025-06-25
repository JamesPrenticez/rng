import styled from '@emotion/styled';
import type React from 'react';

import type { TooltipSide } from './tooltip.types';

const OFFSET = 1;

const StyledArrow = styled.svg`
  position: absolute;

  &.side-top {
    top: calc(100% - 0.1rem);
    left: 50%;
    transform: translateX(-50%);
  }

  &.side-right {
    right: calc(100% - 0.1rem);
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
  }

  &.side-bottom {
    bottom: calc(100% - 0.1rem);
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
  }

  &.side-left {
    left: calc(100% - 0.1rem);
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
  }
`;

interface ArrowProps extends React.SVGAttributes<SVGElement> {
  side: TooltipSide;
}

export const Arrow = ({ side, ...rest }: ArrowProps) => {
  return (
    <StyledArrow
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="none"
      stroke-width="1"
      className={`side-${side}`}
      {...rest}
    >
      <path
        clip-path="url(#trim)"
        fill="none"
        stroke="var(--color-primary)"
        stroke-width="3"
        d="M0,0 H14 L8.75,7.5 Q7,10 5.25,7.5 Z"
      />
      <path 
        fill="var(--color-black-100)"
        d="M0,0 H14 L8.75,7.5 Q7,10 5.25,7.5 Z" 
      />
      <clipPath id="trim">
        <rect x="-1" y="1" width="16" height="14" />
      </clipPath>
    </StyledArrow>
  );
};
