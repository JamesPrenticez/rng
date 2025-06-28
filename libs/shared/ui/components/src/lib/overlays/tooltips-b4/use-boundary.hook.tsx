// useTooltipBoundary.ts
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

type Side = 'top' | 'bottom' | 'left' | 'right';

interface TooltipPosition {
  x: number;
  y: number;
  side: Side;
}

interface UseTooltipBoundaryProps {
  tooltip: any; // Your tooltip data type
  boundaryRef: React.RefObject<HTMLElement>;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  tooltipOffset?: number; // Distance from cursor/element
  padding?: number; // Padding from boundary edges
}

const getOpposite = (side: Side): Side => {
  const opposites: Record<Side, Side> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left'
  };
  return opposites[side];
};

const calculateTooltipPosition = (
  rawX: number,
  rawY: number,
  side: Side,
  tooltipWidth: number,
  tooltipHeight: number,
  offset: number
): { x: number; y: number } => {
  switch (side) {
    case 'top':
      return { x: rawX - tooltipWidth / 2, y: rawY - tooltipHeight - offset };
    case 'bottom':
      return { x: rawX - tooltipWidth / 2, y: rawY + offset };
    case 'left':
      return { x: rawX - tooltipWidth - offset, y: rawY - tooltipHeight / 2 };
    case 'right':
      return { x: rawX + offset, y: rawY - tooltipHeight / 2 };
    default:
      return { x: rawX, y: rawY };
  }
};

const checkFitsInBoundary = (
  x: number,
  y: number,
  width: number,
  height: number,
  boundary: DOMRect,
  padding: number
): boolean => {
  return (
    x >= boundary.left + padding &&
    y >= boundary.top + padding &&
    x + width <= boundary.right - padding &&
    y + height <= boundary.bottom - padding
  );
};

export const useTooltipBoundary = ({
  tooltip,
  boundaryRef,
  mousePosition,
  tooltipOffset = 10,
  padding = 8
}: UseTooltipBoundaryProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [boundaryRect, setBoundaryRect] = useState<DOMRect | null>(null);
  const [tooltipDimensions, setTooltipDimensions] = useState<{ width: number; height: number } | null>(null);
  const [finalPosition, setFinalPosition] = useState<TooltipPosition | null>(null);

  // Track boundary changes
  useEffect(() => {
    if (!boundaryRef.current) return;

    const updateBoundary = () => {
      setBoundaryRect(boundaryRef.current?.getBoundingClientRect() || null);
    };

    updateBoundary();

    const resizeObserver = new ResizeObserver(updateBoundary);
    resizeObserver.observe(boundaryRef.current);

    window.addEventListener('resize', updateBoundary);
    window.addEventListener('scroll', updateBoundary, true);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateBoundary);
      window.removeEventListener('scroll', updateBoundary, true);
    };
  }, [boundaryRef]);

  // Measure actual tooltip dimensions after render
  useLayoutEffect(() => {
    if (!tooltipRef.current || !tooltip) {
      setTooltipDimensions(null);
      return;
    }

    const rect = tooltipRef.current.getBoundingClientRect();
    setTooltipDimensions({ width: rect.width, height: rect.height });
  }, [tooltip?.message, tooltip?.side]); // Re-measure when content or side changes

  // Calculate optimal position with side switching
  useLayoutEffect(() => {
    if (!tooltip || !boundaryRect || !tooltipDimensions) {
      setFinalPosition(null);
      return;
    }

    const rawX = tooltip.type === 'mouse' 
      ? mousePosition.current.x 
      : tooltip.position?.x ?? 0;
    const rawY = tooltip.type === 'mouse' 
      ? mousePosition.current.y 
      : tooltip.position?.y ?? 0;

    const preferredSide = tooltip.side ?? 'top';
    const { width, height } = tooltipDimensions;

    // Try preferred side first
    let currentSide = preferredSide;
    let position = calculateTooltipPosition(rawX, rawY, currentSide, width, height, tooltipOffset);

    // If it doesn't fit, try the opposite side
    if (!checkFitsInBoundary(position.x, position.y, width, height, boundaryRect, padding)) {
      const oppositeSide = getOpposite(currentSide);
      const oppositePosition = calculateTooltipPosition(rawX, rawY, oppositeSide, width, height, tooltipOffset);
      
      // Use opposite side if it fits better
      if (checkFitsInBoundary(oppositePosition.x, oppositePosition.y, width, height, boundaryRect, padding)) {
        currentSide = oppositeSide;
        position = oppositePosition;
      }
    }

    // Final constraint to boundary (as fallback)
    const constrainedX = Math.max(
      boundaryRect.left + padding,
      Math.min(position.x, boundaryRect.right - width - padding)
    );
    
    const constrainedY = Math.max(
      boundaryRect.top + padding,
      Math.min(position.y, boundaryRect.bottom - height - padding)
    );

    setFinalPosition({
      x: constrainedX,
      y: constrainedY,
      side: currentSide
    });
  }, [tooltip, boundaryRect, tooltipDimensions, tooltipOffset, padding]);

  return {
    tooltipRef,
    position: finalPosition,
    isReady: !!finalPosition && !!tooltipDimensions
  };
};
