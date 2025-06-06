import { useState, useCallback } from 'react';
import type { TooltipPosition } from './tooltip.d';

interface UseTooltipPositionProps {
  position: TooltipPosition;
  offset: number;
}

interface TooltipPositionResult {
  top: number;
  left: number;
}

export const useTooltipPosition = ({ position, offset }: UseTooltipPositionProps) => {
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPositionResult>({ top: 0, left: 0 });
  const [actualPosition, setActualPosition] = useState<TooltipPosition>(position);

  const calculatePosition = useCallback((
    triggerElement: HTMLElement,
    tooltipElement: HTMLElement
  ) => {
    const triggerRect = triggerElement.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();
    
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    let top: number, left: number, finalPosition: TooltipPosition = position;

    // Calculate initial position
    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - offset;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + offset;
        break;
      default:
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
    }

    // Edge detection and adjustment
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Check if tooltip goes outside viewport and adjust
    if (left < 0) {
      left = 8;
    } else if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 8;
    }

    // Vertical boundary checking with position flipping
    if (top < 0 && position === 'top') {
      top = triggerRect.bottom + offset;
      finalPosition = 'bottom';
    } else if (top + tooltipRect.height > viewportHeight && position === 'bottom') {
      top = triggerRect.top - tooltipRect.height - offset;
      finalPosition = 'top';
    } else if (top < 0) {
      top = 8;
    } else if (top + tooltipRect.height > viewportHeight) {
      top = viewportHeight - tooltipRect.height - 8;
    }

    // Horizontal boundary checking with position flipping
    if (left < 0 && position === 'left') {
      left = triggerRect.right + offset;
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      finalPosition = 'right';
    } else if (left + tooltipRect.width > viewportWidth && position === 'right') {
      left = triggerRect.left - tooltipRect.width - offset;
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      finalPosition = 'left';
    }

    const newPosition = {
      top: top + scrollY,
      left: left + scrollX
    };

    setTooltipPosition(newPosition);
    setActualPosition(finalPosition);

    return { position: newPosition, actualPosition: finalPosition };
  }, [position, offset]);

  return {
    tooltipPosition,
    actualPosition,
    calculatePosition
  };
};