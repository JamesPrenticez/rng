// TooltipRenderer.tsx
import React, { useEffect, useRef } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  arrow,
  // FloatingArrow,
} from '@floating-ui/react';
import styled from '@emotion/styled';
import { useTooltipStore } from '../notification.store';
import { Tooltip } from './tooltip';
import { Arrow } from './arrow';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 100;
`;

export const TooltipRenderer = () => {
  const tooltip = useTooltipStore((s) => s.tooltip);
  const { message, side, reference } = tooltip || {};
  // const arrowRef = useRef<SVGSVGElement>(null);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, placement, context, middlewareData, strategy } = useFloating({
    placement: side,
    middleware: [offset(8), flip(), shift(), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (tooltip && reference) {
      refs.setReference(reference);
    }
  }, [tooltip, reference, refs]);

  return (
    <Wrapper>
      {tooltip && (
        <Tooltip
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
          }}
        >
          {message} ({placement})
          {/* <FloatingArrow
            ref={arrowRef}
            context={context}
            fill="var(--color-black-100)"
            stroke="var(--color-primary)"
            strokeWidth={1}
            path=""
            tipRadius={2}
            height={10}
          /> */}

          <Arrow
            ref={arrowRef}
            x={middlewareData.arrow?.x}
            y={middlewareData.arrow?.y}
            placement={placement}
            strategy={strategy}
          />
        </Tooltip>
      )}
    </Wrapper>
  );
};
