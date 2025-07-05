// Updated TooltipRenderer component with fixed implementations
import styled from '@emotion/styled';
import React, { useEffect, useMemo, useRef } from 'react';
import { Tooltip } from './base-tooltip-b2';

import { Arrow } from './arrow';
import { useTooltipStore } from './notification.store';
import { useMousePosition } from './use-mouse-position.hook';
import { useTooltipVisibility } from './use-tooltip-visability.hook';
import { createVirtualReference } from './create-virtual-reference.util';
import { arrow, autoUpdate, flip, offset, shift, useFloating } from './hook';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
  z-index: 100;
`;

interface TooltipRendererProps {
  boundaryRef: React.RefObject<HTMLElement>;
}

export const TooltipRendererB2 = React.memo(
  ({ boundaryRef }: TooltipRendererProps) => {
    const tooltip = useTooltipStore((s) => s.tooltip);
    const arrowRef = useRef<HTMLElement>(null);
    const mousePosition = useMousePosition();

    const tooltipData = useMemo(() => {
      if (!tooltip) return null;
      return tooltip;
    }, [tooltip]);

    const { shouldRender, visible } = useTooltipVisibility(tooltipData);

    // Create reference element based on tooltip type
    const reference = useMemo(() => {
      if (!tooltipData) return null;
      
      if (tooltipData.type === 'mouse') {
        // For mouse tooltips, create a new virtual reference each time
        return createVirtualReference(
          mousePosition.current.x,
          mousePosition.current.y
        );
      }
      
      // For element tooltips, return the existing reference
      return tooltipData.reference;
    }, [tooltipData, tooltipData?.type === 'mouse' ? mousePosition.current : null]);

    // Memoize middleware configuration
    const middleware = useMemo(() => {
      const boundaryEl = boundaryRef.current;
      
      return [
        offset(8),
        flip({
          boundary: boundaryEl ? [boundaryEl] : undefined,
          fallbackPlacements: ['top', 'bottom', 'right', 'left'],
          padding: 8,
        }),
        shift({ 
          boundary: boundaryEl ? [boundaryEl] : undefined,
          padding: 8,
        }),
        arrow({ 
          element: arrowRef,
          padding: 8,
        }),
      ];
    }, [boundaryRef.current]);

    // Use the corrected useFloating hook
    const { refs, floatingStyles, placement, middlewareData } = useFloating({
      placement: tooltipData?.side || 'top',
      middleware,
      whileElementsMounted: autoUpdate,
    });

    // Update reference when it changes
    useEffect(() => {
      if (reference) {
        refs.setReference(reference);
      }
    }, [reference, refs]);

    if (!shouldRender || !tooltipData) return null;

    return (
      <Wrapper>
        <Tooltip
          ref={refs.setFloating}
          visible={visible}
          style={floatingStyles}
        >
          {tooltipData.message} ({placement})
          {tooltipData.withArrow && (
            <Arrow
              ref={arrowRef}
              x={middlewareData.arrow?.x}
              y={middlewareData.arrow?.y}
              placement={placement}
              strategy="absolute"
            />
          )}
        </Tooltip>
      </Wrapper>
    );
  }
);

TooltipRendererB2.displayName = 'TooltipRendererB2';