import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';

import { useNotificationStore } from '../notification.store';
import { BaseTooltip } from './base-tooltip';
import { ITooltip } from './tooltip.types';

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

  const tooltipRef = useRef<HTMLElement | null>(null);

  // We need to sync the position update and render so the side transform doesn't apply before the position updates
  const [renderedTooltip, setRenderedTooltip] = useState<{
    tooltip: ITooltip;
    position: { x: number | string; y: number | string };
  } | null>(null);

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

    setRenderedTooltip({
      tooltip,
      position: {x, y},
    });

    const timer = setTimeout(clearTooltip, tooltip.duration);
    return () => clearTimeout(timer);
  }, [tooltip]);

  // Get mouse position
  useEffect(() => {
      if(tooltip?.type !== "mouse") return;
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
          key={renderedTooltip.tooltip.message}
          id="tooltip"
          top={renderedTooltip.position.y}
          left={renderedTooltip.position.x}
          side={renderedTooltip.tooltip.side ?? 'top'}
          hasArrow={renderedTooltip.tooltip.hasArrow ?? false}
        >
          {renderedTooltip.tooltip.message}
        </BaseTooltip>
      )}
    </Wrapper>
  );
};
