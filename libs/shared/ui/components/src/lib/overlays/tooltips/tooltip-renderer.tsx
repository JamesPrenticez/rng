import { useEffect, useMemo, useRef } from 'react';
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

export const TooltipRenderer = ({ boundaryRef }: TooltipRendererProps ) => {
  const tooltip = useTooltipStore((s) => s.tooltip);
  const { message, side, reference, withArrow } = tooltip || {};
  const arrowRef = useRef(null);

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
    placement: side,
    middleware,
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
          key={tooltip.id}
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
          }}
        >
          {message} ({placement})

          {withArrow && 
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
};