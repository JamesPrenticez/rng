// Updated TooltipRenderer component
import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';
import { TooltipData, useNotificationStore } from './notification-b2.store';
import { BaseTooltip } from './base-tooltip-b2';
import { useTooltipBoundary } from './use-boundary.hook';

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

export const TooltipRendererB2 = ({ boundaryRef }: TooltipRendererProps) => {
  const tooltip = useNotificationStore((s) => s.tooltip);
  const clearTooltip = useNotificationStore((s) => s.clearTooltip);
  const mousePosition = useRef({ x: 0, y: 0 });

  // Track mouse position
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
  }, []);

  // Use the boundary hook
  const { tooltipRef, position } = useTooltipBoundary({
    tooltip,
    boundaryRef,
    mousePosition,
    padding: 8,
    estimatedWidth: 160, // min-width: 10rem = 160px
    estimatedHeight: 45  // min-height: 2.8rem ≈ 44.8px
  });

  // Handle timeout
  useEffect(() => {
    if (!tooltip) return;
    const timer = setTimeout(clearTooltip, tooltip.duration);
    return () => clearTimeout(timer);
  }, [tooltip, clearTooltip]);

  console.log("re-renders");
  
  return (
    <Wrapper>
      {tooltip && position && (
        <BaseTooltip
          ref={tooltipRef}
          key={tooltip.message}
          id="tooltip"
          top={position.y}
          left={position.x}
          side={position.side}
          hasArrow={tooltip.hasArrow ?? false}
        >
          {tooltip.message} {position.side}
        </BaseTooltip>
      )}
    </Wrapper>
  );
};