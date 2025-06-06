import React, { forwardRef } from 'react';
import { Placement, ArrowOptions } from '@floating-ui/react';

interface CustomArrowProps {
  placement: Placement;
  middlewareData: {
    arrow?: {
      x?: number;
      y?: number;
    };
  };
}

export const CustomArrow = forwardRef<SVGSVGElement, CustomArrowProps>(
  ({ placement, middlewareData }, ref) => {
    // Helper function to get arrow rotation based on placement
    const getArrowRotation = (placement: Placement) => {
      if (placement.startsWith('top')) return 'rotate(180deg)'; // Arrow points down towards trigger
      if (placement.startsWith('bottom')) return 'rotate(0deg)'; // Arrow points up towards trigger
      if (placement.startsWith('left')) return 'rotate(90deg)'; // Arrow points right towards trigger
      if (placement.startsWith('right')) return 'rotate(-90deg)'; // Arrow points left towards trigger
      return 'rotate(180deg)';
    };

    // Helper function to get arrow position offset
    const getArrowOffset = (placement: Placement) => {
      if (placement.startsWith('top')) return { bottom: '-20px' };
      if (placement.startsWith('bottom')) return { top: '-20px' };
      if (placement.startsWith('left')) return { right: '-20px' };
      if (placement.startsWith('right')) return { left: '-20px' };
      return { bottom: '-4px' };
    };

    return (
      <svg
        ref={ref}
        style={{
          position: 'absolute',
          left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : '',
          top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : '',
          transform: getArrowRotation(placement),
          ...getArrowOffset(placement),
        }}
        width="20"
        height="10"
        viewBox="0 0 8 4"
      >
        <path
          d="M0 4L4 0L8 4"
          fill="var(--color-black-20)"
          stroke="white"
          strokeWidth="1"
        />
      </svg>
    );
  }
);

CustomArrow.displayName = 'CustomArrow';