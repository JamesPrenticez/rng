import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  arrow,
  limitShift,
} from '@floating-ui/react';
import styled from '@emotion/styled';
import { useTooltipStore } from './notification.store';
import { Tooltip } from './tooltip';
import { Arrow } from './arrow';
import { useMousePosition } from './use-mouse-position.hook';
import { useTooltipVisibility } from './use-tooltip-visability.hook';
import { createVirtualReference } from './create-virtual-reference.util';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 100;
`;

interface TooltipRendererProps {
  boundaryRef: React.RefObject<HTMLElement>;
}

export const TooltipRenderer = React.memo(
  ({ boundaryRef }: TooltipRendererProps) => {
    const tooltip = useTooltipStore((s) => s.tooltip);
    const arrowRef = useRef(null);
    const mousePosition = useMousePosition();

    const tooltipData = useMemo(() => {
      if (!tooltip) return null;
      return tooltip;
    }, [tooltip]);

    const { shouldRender, visible } = useTooltipVisibility(tooltipData);

    const reference = useMemo(() => {
      if (!tooltipData) return null;
      
      if (tooltipData.type === 'mouse') {
        return createVirtualReference(
          mousePosition.current.x,
          mousePosition.current.y
        );
      }
      
      // For non-mouse tooltips, return the reference regardless of mouse position
      return tooltipData.reference;
    }, [tooltipData, tooltipData?.type === 'mouse' ? mousePosition : null]);

    const middleware = useMemo(() => {
      const boundaryEl = boundaryRef.current;
      return [
        offset(8),
        flip({
          boundary: boundaryEl ? [boundaryEl] : [],
          fallbackPlacements: ['top', 'bottom', 'right', 'left'],
        }),
        shift({ boundary: boundaryEl ? [boundaryEl] : [] }),
        arrow({ element: arrowRef }),
      ];
    }, [boundaryRef.current]);

    const { refs, floatingStyles, placement, middlewareData, strategy } =
      useFloating({
        placement: tooltipData?.side,
        middleware,
        whileElementsMounted: autoUpdate,
      });

    useEffect(() => {
      if (reference) {
        refs.setReference(reference);
      }
    }, [reference, refs]);

    if (!shouldRender || !tooltipData) return null;

    return (
      <Wrapper>
        {tooltipData && (
          <Tooltip
            ref={refs.setFloating}
            visible={visible}
            style={{
              ...floatingStyles,
            }}
          >
            {tooltipData.message} ({placement})
            {tooltipData.withArrow && (
              <Arrow
                ref={arrowRef}
                x={middlewareData.arrow?.x}
                y={middlewareData.arrow?.y}
                placement={placement}
                strategy={strategy}
              />
            )}
          </Tooltip>
        )}
      </Wrapper>
    );
  }
);

{
  /* <FloatingArrow
  ref={arrowRef}
  context={context}
  fill="var(--color-black-100)"
  stroke="var(--color-primary)"
  strokeWidth={1}
  path=""
  tipRadius={2}
  height={10}
/> */
}
