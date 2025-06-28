import styled from '@emotion/styled';
import { useEffect, useMemo, useRef, useState } from 'react';

import { TooltipData, useNotificationStore } from './notification-b4.store';
import { BaseTooltip } from './base-tooltip-b4';

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

export const TooltipRendererB4 = ({ boundaryRef }: TooltipRendererProps) => {
  const tooltip = useNotificationStore((s) => s.tooltip);
  const clearTooltip = useNotificationStore((s) => s.clearTooltip);
  const mousePosition = useRef({ x: 0, y: 0 });

  // Quietly track mouse position quietly (no forcing re-renders)
  useEffect(() => {
    let ticking = false;
    const listener = (event: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          mousePosition.current = { x: event.clientX, y: event.clientY };
          ticking = false;
        });
        ticking = true;
      }
    };
    
    document.addEventListener('mousemove', listener);
    return () => document.removeEventListener('mousemove', listener);
  }, []); // No dependency - always track mouse position

  // Derive the rendered tooltip directly
  const renderedTooltip = useMemo(() => {
    if (!tooltip) return null;
    
    const x = tooltip.type === 'mouse' 
      ? mousePosition.current.x 
      : tooltip.position?.x ?? 0;
    const y = tooltip.type === 'mouse' 
      ? mousePosition.current.y 
      : tooltip.position?.y ?? 0;
    
    return { tooltip, position: { x, y } };
  }, [tooltip]); // Only re-calculate when tooltip changes

  // Handle timeout
  useEffect(() => {
    if (!tooltip) return;
    const timer = setTimeout(clearTooltip, tooltip.duration);
    return () => clearTimeout(timer);
  }, [tooltip, clearTooltip]);

  console.log("re-renders");
  
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