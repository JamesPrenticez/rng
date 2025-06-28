import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Side = 'top' | 'bottom' | 'left' | 'right';

interface UseTooltipBoundaryProps {
  tooltip: any;
  boundaryRef: React.RefObject<any>;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  padding?: number;
  estimatedWidth?: number;
  estimatedHeight?: number;
}

const getSideFallbackOrder = (preferredSide: Side): Side[] => {
  const fallbackOrders: Record<Side, Side[]> = {
    top: ['top', 'bottom', 'right', 'left'],
    bottom: ['bottom', 'top', 'right', 'left'],
    left: ['left', 'right', 'top', 'bottom'],
    right: ['right', 'left', 'top', 'bottom']
  };
  return fallbackOrders[preferredSide];
};

const calculateTooltipPosition = (
  rawX: number,
  rawY: number,
  side: Side,
  tooltipWidth: number,
  tooltipHeight: number,
  offset: 8,
  elementRect?: DOMRect
): { x: number; y: number } => {
  // If we have elementRect, we're positioning relative to an element
  if (elementRect) {
    switch (side) {
      case 'top':
        return { 
          x: elementRect.left + elementRect.width / 2 - tooltipWidth / 2, 
          y: elementRect.top - tooltipHeight - offset 
        };
      case 'bottom':
        return { 
          x: elementRect.left + elementRect.width / 2 - tooltipWidth / 2, 
          y: elementRect.bottom + offset 
        };
      case 'left':
        return { 
          x: elementRect.left - tooltipWidth - offset, 
          y: elementRect.top + elementRect.height / 2 - tooltipHeight / 2 
        };
      case 'right':
        return { 
          x: elementRect.right + offset, 
          y: elementRect.top + elementRect.height / 2 - tooltipHeight / 2 
        };
      default:
        return { x: rawX, y: rawY };
    }
  }

  // Original positioning logic for mouse/point positioning
  switch (side) {
    case 'top':
      return { 
        x: rawX - tooltipWidth / 2, 
        y: rawY - tooltipHeight - offset 
      };
    case 'bottom':
      return { 
        x: rawX - tooltipWidth / 2, 
        y: rawY + offset 
      };
    case 'left':
      return { 
        x: rawX - tooltipWidth - offset, 
        y: rawY - tooltipHeight / 2 
      };
    case 'right':
      return { 
        x: rawX + offset, 
        y: rawY - tooltipHeight / 2 
      };
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

const findBestSide = (
  sourceX: number,
  sourceY: number,
  preferredSide: Side,
  tooltipWidth: number,
  tooltipHeight: number,
  boundary: DOMRect,
  padding: number,
  offset: 8,
  isAbsolute: boolean,
  elementRect?: DOMRect
): { side: Side; position: { x: number; y: number } } => {
  // If it's absolute positioning, treat the source as the final position
  if (isAbsolute) {
    return { 
      side: preferredSide, 
      position: { x: sourceX, y: sourceY } 
    };
  }

  const fallbackOrder = getSideFallbackOrder(preferredSide);
  
  for (const side of fallbackOrder) {
    const position = calculateTooltipPosition(sourceX, sourceY, side, tooltipWidth, tooltipHeight, offset, elementRect);
    
    if (checkFitsInBoundary(position.x, position.y, tooltipWidth, tooltipHeight, boundary, padding)) {
      return { side, position };
    }
  }
  
  // If no side fits perfectly, return the preferred side with constrained position
  const position = calculateTooltipPosition(sourceX, sourceY, preferredSide, tooltipWidth, tooltipHeight, offset, elementRect);
  
  return { side: preferredSide, position };
};

export const useTooltipBoundary = ({
  tooltip,
  boundaryRef,
  mousePosition,
  padding = 8,
  estimatedWidth = 200,
  estimatedHeight = 56
}: UseTooltipBoundaryProps) => {
  const tooltipRef = useRef<any>(null);
  const boundaryRectRef = useRef<DOMRect | null>(null);
  
  // Track the actual side after adjustment
  const [actualSide, setActualSide] = useState<Side | null>(null);

  // Track boundary changes (no re-renders)
  useEffect(() => {
    if (!boundaryRef.current) return;

    const updateBoundary = () => {
      boundaryRectRef.current = boundaryRef.current?.getBoundingClientRect() || null;
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

  // Adjust position after render using actual dimensions
  const adjustPosition = useCallback(() => {
    if (!tooltipRef.current || !boundaryRectRef.current || !tooltip) return;

    const rect = tooltipRef.current.getBoundingClientRect();
    const actualWidth = rect.width;
    const actualHeight = rect.height;

    // Get the source position
    let sourceX, sourceY;
    
    if (tooltip.type === 'mouse') {
      sourceX = mousePosition.current.x;
      sourceY = mousePosition.current.y;
    } else if (tooltip.type === 'absolute') {
      sourceX = tooltip.position?.x ?? 0;
      sourceY = tooltip.position?.y ?? 0;
    } else if (tooltip.type === 'element') {
      sourceX = tooltip.position?.x ?? 0;
      sourceY = tooltip.position?.y ?? 0;
    } else {
      sourceX = tooltip.position?.x ?? 0;
      sourceY = tooltip.position?.y ?? 0;
    }

    const preferredSide = tooltip.side ?? 'top';
    
    const { side: bestSide, position: bestPosition } = findBestSide(
      sourceX,
      sourceY,
      preferredSide,
      actualWidth,
      actualHeight,
      boundaryRectRef.current,
      padding,
      8,
      tooltip.type === 'absolute',
      tooltip.elementRect
    );

    // Final constraint to boundary (in case no side fit perfectly)
    const constrainedX = Math.max(
      boundaryRectRef.current.left + padding,
      Math.min(bestPosition.x, boundaryRectRef.current.right - actualWidth - padding)
    );
    
    const constrainedY = Math.max(
      boundaryRectRef.current.top + padding,
      Math.min(bestPosition.y, boundaryRectRef.current.bottom - actualHeight - padding)
    );

    // Update position directly in DOM (no re-render)
    tooltipRef.current.style.left = `${constrainedX}px`;
    tooltipRef.current.style.top = `${constrainedY}px`;
    
    // Update side if it changed
    if (bestSide !== preferredSide) {
      tooltipRef.current.className = tooltipRef.current.className.replace(/side-\w+/, `side-${bestSide}`);
    }
    
    // Update the actual side state so consumers get the correct value
    setActualSide(bestSide);
  }, [tooltip, padding, mousePosition]);

  // Calculate initial position using estimated dimensions
  const initialPosition = useMemo(() => {
    if (!tooltip || !boundaryRectRef.current) {
      setActualSide(null);
      return null;
    }
    
    const sourceX = tooltip.type === 'mouse' 
      ? mousePosition.current.x 
      : tooltip.position?.x ?? 0;
    const sourceY = tooltip.type === 'mouse' 
      ? mousePosition.current.y 
      : tooltip.position?.y ?? 0;

    const preferredSide = tooltip.side ?? 'top';
    
    const { side: bestSide, position: bestPosition } = findBestSide(
      sourceX,
      sourceY,
      preferredSide,
      estimatedWidth,
      estimatedHeight,
      boundaryRectRef.current,
      padding,
      8,
      tooltip.type === 'absolute',
      tooltip.elementRect
    );

    // Constrain to boundary
    const constrainedX = Math.max(
      boundaryRectRef.current.left + padding,
      Math.min(bestPosition.x, boundaryRectRef.current.right - estimatedWidth - padding)
    );
    
    const constrainedY = Math.max(
      boundaryRectRef.current.top + padding,
      Math.min(bestPosition.y, boundaryRectRef.current.bottom - estimatedHeight - padding)
    );

    // Set initial side
    setActualSide(bestSide);

    return {
      x: constrainedX,
      y: constrainedY,
      side: bestSide
    };
  }, [tooltip, estimatedWidth, estimatedHeight, padding, mousePosition]);

  // Schedule adjustment after render
  useEffect(() => {
    if (tooltip && tooltipRef.current && initialPosition) {
      const rafId = requestAnimationFrame(adjustPosition);
      return () => cancelAnimationFrame(rafId);
    }
  }, [tooltip, initialPosition, adjustPosition]);

  return {
    tooltipRef,
    position: initialPosition ? {
      ...initialPosition,
      side: actualSide ?? initialPosition.side // Use actualSide if available, fallback to initial
    } : null
  };
};