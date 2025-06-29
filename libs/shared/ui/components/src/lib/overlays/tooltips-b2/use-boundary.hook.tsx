import { useCallback, useEffect, useRef } from 'react';

type Side = 'top' | 'bottom' | 'left' | 'right';

interface UseTooltipBoundaryProps {
  tooltip: any;
  boundaryRef: React.RefObject<HTMLElement>;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  padding?: number;
  estimatedWidth?: number;
  estimatedHeight?: number;
}

interface TooltipPosition {
  x: number;
  y: number;
  side: Side;
}

const SIDE_FALLBACKS: Record<Side, Side[]> = {
  top: ['top', 'bottom', 'right', 'left'],
  bottom: ['bottom', 'top', 'right', 'left'],
  left: ['left', 'right', 'top', 'bottom'],
  right: ['right', 'left', 'top', 'bottom']
};

const OFFSET = 8;

const calculatePositionForSide = (
  sourceX: number,
  sourceY: number,
  side: Side,
  tooltipWidth: number,
  tooltipHeight: number,
  elementRect?: DOMRect
): { x: number; y: number } => {
  if (elementRect) {
    const { left, top, right, bottom, width, height } = elementRect;
    switch (side) {
      case 'top':
        return { 
          x: left + width / 2 - tooltipWidth / 2, 
          y: top - tooltipHeight - OFFSET 
        };
      case 'bottom':
        return { 
          x: left + width / 2 - tooltipWidth / 2, 
          y: bottom + OFFSET 
        };
      case 'left':
        return { 
          x: left - tooltipWidth - OFFSET, 
          y: top + height / 2 - tooltipHeight / 2 
        };
      case 'right':
        return { 
          x: right + OFFSET, 
          y: top + height / 2 - tooltipHeight / 2 
        };
    }
  }

  // Mouse/point positioning
  switch (side) {
    case 'top':
      return { 
        x: sourceX - tooltipWidth / 2, 
        y: sourceY - tooltipHeight - OFFSET 
      };
    case 'bottom':
      return { 
        x: sourceX - tooltipWidth / 2, 
        y: sourceY + OFFSET 
      };
    case 'left':
      return { 
        x: sourceX - tooltipWidth - OFFSET, 
        y: sourceY - tooltipHeight / 2 
      };
    case 'right':
      return { 
        x: sourceX + OFFSET, 
        y: sourceY - tooltipHeight / 2 
      };
  }
};

const fitsInBoundary = (
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

const constrainToBoundary = (
  x: number,
  y: number,
  width: number,
  height: number,
  boundary: DOMRect,
  padding: number
): { x: number; y: number } => {
  return {
    x: Math.max(
      boundary.left + padding,
      Math.min(x, boundary.right - width - padding)
    ),
    y: Math.max(
      boundary.top + padding,
      Math.min(y, boundary.bottom - height - padding)
    )
  };
};

const findOptimalPosition = (
  sourceX: number,
  sourceY: number,
  preferredSide: Side,
  tooltipWidth: number,
  tooltipHeight: number,
  boundary: DOMRect,
  padding: number,
  isAbsolute: boolean,
  elementRect?: DOMRect
): TooltipPosition => {
  // Absolute positioning bypasses side calculation
  if (isAbsolute) {
    const constrained = constrainToBoundary(sourceX, sourceY, tooltipWidth, tooltipHeight, boundary, padding);
    return { ...constrained, side: preferredSide };
  }

  // Try each side in fallback order
  for (const side of SIDE_FALLBACKS[preferredSide]) {
    const position = calculatePositionForSide(sourceX, sourceY, side, tooltipWidth, tooltipHeight, elementRect);
    
    if (fitsInBoundary(position.x, position.y, tooltipWidth, tooltipHeight, boundary, padding)) {
      return { ...position, side };
    }
  }
  
  // No side fits perfectly - use preferred side with constraints
  const position = calculatePositionForSide(sourceX, sourceY, preferredSide, tooltipWidth, tooltipHeight, elementRect);
  const constrained = constrainToBoundary(position.x, position.y, tooltipWidth, tooltipHeight, boundary, padding);
  
  return { ...constrained, side: preferredSide };
};

export const useTooltipBoundary = ({
  tooltip,
  boundaryRef,
  mousePosition,
  padding = 8,
  estimatedWidth = 200,
  estimatedHeight = 56
}: UseTooltipBoundaryProps) => {
  const tooltipRef = useRef<HTMLElement>(null);
  const boundaryRectRef = useRef<DOMRect | null>(null);
  const currentSideRef = useRef<Side | null>(null);
  const currentPositionRef = useRef<{ x: number; y: number } | null>(null);

  // Update boundary rect (no re-renders)
  useEffect(() => {
    if (!boundaryRef.current) return;

    const updateBoundary = () => {
      boundaryRectRef.current = boundaryRef.current?.getBoundingClientRect() || null;
    };

    updateBoundary();
    
    const resizeObserver = new ResizeObserver(updateBoundary);
    resizeObserver.observe(boundaryRef.current);

    const handleResize = () => updateBoundary();
    const handleScroll = () => updateBoundary();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [boundaryRef]);

  // Position tooltip using actual dimensions
  const positionTooltip = useCallback(() => {
    if (!tooltipRef.current || !boundaryRectRef.current || !tooltip) return;

    const rect = tooltipRef.current.getBoundingClientRect();
    const { width: actualWidth, height: actualHeight } = rect;

    // Get source position based on tooltip type
    let sourceX: number, sourceY: number;
    
    switch (tooltip.type) {
      case 'mouse':
        sourceX = mousePosition.current.x;
        sourceY = mousePosition.current.y;
        break;
      case 'absolute':
      case 'element':
      default:
        sourceX = tooltip.position?.x ?? 0;
        sourceY = tooltip.position?.y ?? 0;
        break;
    }

    const preferredSide = tooltip.side ?? 'top';
    
    const optimalPosition = findOptimalPosition(
      sourceX,
      sourceY,
      preferredSide,
      actualWidth,
      actualHeight,
      boundaryRectRef.current,
      padding,
      tooltip.type === 'absolute',
      tooltip.elementRect
    );

    // Apply position and side to DOM (no re-render)
    const element = tooltipRef.current;
    element.style.left = `${optimalPosition.x}px`;
    element.style.top = `${optimalPosition.y}px`;
    
    // Update side class if changed
    if (currentSideRef.current !== optimalPosition.side) {
      if (currentSideRef.current) {
        element.classList.remove(`side-${currentSideRef.current}`);
      }
      element.classList.add(`side-${optimalPosition.side}`);
    }
    
    // Store the final position and side
    currentSideRef.current = optimalPosition.side;
    currentPositionRef.current = { x: optimalPosition.x, y: optimalPosition.y };
  }, [tooltip, padding, mousePosition]);

  // Calculate initial position for first render
  const getInitialPosition = useCallback((): TooltipPosition | null => {
    if (!tooltip || !boundaryRectRef.current) return null;
    
    const sourceX = tooltip.type === 'mouse' 
      ? mousePosition.current.x 
      : tooltip.position?.x ?? 0;
    const sourceY = tooltip.type === 'mouse' 
      ? mousePosition.current.y 
      : tooltip.position?.y ?? 0;

    const preferredSide = tooltip.side ?? 'top';
    
    const initialPos = findOptimalPosition(
      sourceX,
      sourceY,
      preferredSide,
      estimatedWidth,
      estimatedHeight,
      boundaryRectRef.current,
      padding,
      tooltip.type === 'absolute',
      tooltip.elementRect
    );

    // Set initial values
    currentSideRef.current = initialPos.side;
    currentPositionRef.current = { x: initialPos.x, y: initialPos.y };
    
    return initialPos;
  }, [tooltip, estimatedWidth, estimatedHeight, padding, mousePosition]);

  // Position tooltip after each render
  useEffect(() => {
    if (!tooltip) {
      currentSideRef.current = null;
      currentPositionRef.current = null;
      return;
    }

    // Use RAF to ensure DOM is updated
    const rafId = requestAnimationFrame(positionTooltip);
    return () => cancelAnimationFrame(rafId);
  }, [tooltip, positionTooltip]);

  // Get initial position (computed fresh each time, no memoization needed)
  const initialPosition = tooltip ? getInitialPosition() : null;

  return {
    tooltipRef,
    position: initialPosition,
    // Expose current position and side via methods (avoids re-renders)
    getCurrentSide: () => currentSideRef.current,
    getCurrentPosition: () => currentPositionRef.current ? {
      ...currentPositionRef.current,
      side: currentSideRef.current!
    } : null
  };
};