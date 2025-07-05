import React, { forwardRef } from 'react';
import { type Placement, type Strategy } from '@floating-ui/react';
import styled from '@emotion/styled';


const Container = styled.div`
  svg {
    height: auto;
    width: 2rem;
    /* border: red solid 1px; */
  }
`

interface ArrowProps {
  x?: number;
  y?: number;
  placement: Placement;
  strategy?: Strategy;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export const Arrow = forwardRef<HTMLDivElement, ArrowProps>(
  (
    {
      x,
      y,
      placement,
      strategy = 'absolute',
      width = 50,
      height = 22.5,
      style = {},
    },
    ref
  ) => {
    const basePlacement = placement.split('-')[0];

    // Choose side for positioning and rotation
    const staticSide = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    }[basePlacement] as keyof React.CSSProperties;

    // Offset transform: shift 50% along opposite axis + rotate
    const transform = {
      top: 'translateX(0%) translateY(calc(100% - 1px)) rotate(180deg)',
      bottom: 'translateX(0%) translateY(calc(-100% + 1px)) rotate(0deg)',
      left: 'translateY(0%) translateX(calc(100% - 7px)) rotate(90deg)',
      right: 'translateY(0%) translateX(calc(-100% + 7px)) rotate(-90deg)',
    }[basePlacement];

    return (
      <Container
        ref={ref}
        style={{
          position: strategy,
          left: x != null ? `${x}px` : '',
          top: y != null ? `${y}px` : '',
          [staticSide]: '-1px',
          transform,
          pointerEvents: 'none',
          ...style,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 50 22.5" width={width} height={height}>
          <path
            d="
              M0 21 
              C 12.5 21, 
                12.5 0, 
                25 0, 
                37.5 0, 
                37.5 21, 
                50 21 
              L50 22 
              L0 22 
              Z
            "
            fill="var(--color-black-100)"
            stroke="none"
          />
          <path
            d="M0 21 C 12.5 21, 12.5 0, 25 0, 37.5 0, 37.5 21, 50 21"
            fill="var(--color-black-100)"
            stroke="var(--color-primary)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </Container>
    );
  }
);

Arrow.displayName = 'Arrow';
