import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { useFloating, offset, flip, shift, limitShift, arrow, size, autoUpdate } from '@floating-ui/react';

import { useNotificationStore } from '../notification.store';
import { BaseTooltip } from './base-tooltip';
import { ITooltip, TooltipSide } from './tooltip.types';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
  z-index: 100;
`;

export const TooltipRenderer = () => {
  const tooltip = useNotificationStore((s) => s.tooltip);
  const clearTooltip = useNotificationStore((s) => s.clearTooltip);
  const mousePosition = useRef({ x: 0, y: 0 });
  const referenceRef = useRef<HTMLElement | null>(null);
  const arrowRef = useRef(null);

  // We need to sync the position update and render so the side transform doesn't apply before the position updates
  const [renderedTooltip, setRenderedTooltip] = useState<{
    tooltip: ITooltip;
    position: { x: number | string; y: number | string };
  } | null>(null);

  const {
    x,
    y,
    refs,
    placement,
    floatingStyles,
  } = useFloating({
    placement: renderedTooltip?.tooltip.side ?? 'top',
    middleware: [
      offset(8),
      flip({
        boundary: 'clippingAncestors',
        fallbackPlacements: ['top', 'bottom', 'right', 'left'],
        crossAxis: true,
        padding: 0,
      }),
      shift({
        boundary: 'clippingAncestors',
        padding: 0,
        limiter: limitShift({
          offset: 0,
          mainAxis: true,
          crossAxis: true,
        }),
      }),
      size({
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.min(300, availableWidth)}px`,
            maxHeight: `${availableHeight - 16}px`,
          });
        },
        padding: 0,
      }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
    strategy: 'absolute',
  });

  // Update tooltip position
  useEffect(() => {
    if (!tooltip) {
      setRenderedTooltip(null);
      return;
    }

    const x =
      tooltip.type === 'mouse'
        ? mousePosition.current.x
        : tooltip.position?.x ?? 0;

    const y =
      tooltip.type === 'mouse'
        ? mousePosition.current.y
        : tooltip.position?.y ?? 0;

    referenceRef.current = {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        top: Number(y),
        left: Number(x),
        bottom: Number(y),
        right: Number(x),
        x: Number(x),
        y: Number(y),
        toJSON: () => null,
      }),
    } as HTMLElement;

    refs.setReference(referenceRef.current);

    setRenderedTooltip({
      tooltip,
      position: { x, y },
    });

    const timer = setTimeout(clearTooltip, tooltip.duration);
    return () => clearTimeout(timer);
  }, [tooltip]);

  // Get mouse position
  useEffect(() => {
    if (tooltip?.type !== 'mouse') return;
    let ticking = false;
    const listener = (event: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          mousePosition.current = { x: event.x, y: event.y };
          ticking = false;
        });
        ticking = true;
      }
    };
    document.addEventListener('mousemove', listener);
    return () => document.removeEventListener('mousemove', listener);
  }, []);

  return (
    <Wrapper>
      {renderedTooltip && (
        <BaseTooltip
          ref={refs.setFloating}
          key={renderedTooltip.tooltip.message}
          id="tooltip"
          top={y ?? 0}
          left={x ?? 0}
          side={placement.split('-')[0] as TooltipSide}
          hasArrow={renderedTooltip.tooltip.hasArrow ?? false}
          style={floatingStyles}
        >
          {renderedTooltip.tooltip.message}
        </BaseTooltip>
      )}
    </Wrapper>
  );
};