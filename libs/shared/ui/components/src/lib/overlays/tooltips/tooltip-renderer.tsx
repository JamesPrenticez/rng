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

interface TooltipRendererProps {
  boundaryRef: React.RefObject<HTMLElement>;
}

export const TooltipRenderer = React.memo(({ boundaryRef }: TooltipRendererProps) => {
  const tooltip = useTooltipStore((s) => s.tooltip);
  // const { message, side, reference, withArrow } = tooltip || {};
  const arrowRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const tooltipData = useMemo(() => {
  if (!tooltip) return null;
  return {
    message: tooltip.message,
    side: tooltip.side,
    reference: tooltip.reference,
    withArrow: tooltip.withArrow,
    id: tooltip.id,
    duration: tooltip.duration
  };
}, [tooltip]);

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

  const { refs, floatingStyles, placement, middlewareData, strategy } = useFloating({
    placement: tooltipData?.side,
    middleware,
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (tooltipData && tooltipData.reference) {
      refs.setReference(tooltipData.reference);
    }
  }, [tooltipData, refs]);

    useEffect(() => {
    if (tooltipData) {
      setShouldRender(true);
      setVisible(true);

      // Schedule fade-out after tooltip duration
      timeoutRef.current = setTimeout(() => {
        setVisible(false); // triggers fade-out
        timeoutRef.current = setTimeout(() => {
          setShouldRender(false); // unmount after fade
        }, 200); // match CSS duration
      }, tooltipData.duration);
    }

    return () => {
      // Clear any timeouts if component updates
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [tooltipData]);

  if (!shouldRender || !tooltipData) return null;

  console.log("render")

  return (
    <Wrapper>
      {tooltipData && (
        <Tooltip
          key={tooltipData.id}
          ref={refs.setFloating}
          visible={visible}
          style={{
            ...floatingStyles,
          }}
        >
          {tooltipData.message} ({placement})

          {tooltipData.withArrow && 
            <Arrow
              ref={arrowRef}
              x={middlewareData.arrow?.x}
              y={middlewareData.arrow?.y}
              placement={placement}
              strategy={strategy}
            />
          }
        </Tooltip>
      )}
    </Wrapper>
  );
});