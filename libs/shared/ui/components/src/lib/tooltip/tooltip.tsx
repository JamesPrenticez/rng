import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import type { TooltipProps } from './tooltip.d';
import { 
  useFloating, 
  autoUpdate, 
  offset, 
  flip, 
  shift, 
  arrow, 
  FloatingArrow,
  limitShift,
  size
} from '@floating-ui/react';
import { Themes } from '@shared/ui/theme'
import clsx from 'clsx';

export const TriggerWrapper = styled.div`
  display: inline-block;
  width: fit-content;
  height: fit-content;
  border: red 1px solid; // TODO remove after debugging
`;

export const TooltipContainer = styled.div`
  position: fixed;
  z-index: 9999;
  padding: 1rem 2rem;
  font-size: 1.8rem;
  color: var(--color-white-100);
  background-color: var(--color-black-20);

  border: 0.1rem solid var(--color-primary);
  border-radius: 0.8rem;

  pointer-events: none;
  transition: opacity 0.2s ease-in-out;

  white-space: nowrap;
  max-width: 300px;  // This is counter intuitive its more like a min-width before edge detection repositioning takes place
  word-wrap: break-word;
  white-space: normal;
`;

export const Tooltipx = ({
  children,
  message,
  position = 'top',
  offset: offsetValue = 8,
  className = '', 
  container = document.body,
  disabled = false,
}: TooltipProps) => {
  const arrowRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    open: isVisible,
    onOpenChange: setIsVisible,
    placement: position,
    middleware: [
      offset(offsetValue),
      flip({
        // Add more boundary detection
        boundary: 'clippingAncestors',
        // Fallback placements in preferred order
        fallbackPlacements: ['top', 'bottom', 'right', 'left'],
        // Allow flipping to opposite axis
        crossAxis: true,
        // Add padding from viewport edges
        padding: 8,
      }),
      shift({
        // Add boundary detection for shift
        boundary: 'clippingAncestors',
        // Add padding from edges
        padding: 8,
        // Use limitShift to prevent tooltip from going too far
        limiter: limitShift({
          // Offset from the edge when limiting
          offset: 8,
          // Allow some overflow before limiting
          mainAxis: true,
          crossAxis: true,
        }),
      }),
      // Add size middleware to handle overflow better
      size({
        apply({ availableWidth, availableHeight, elements }) {
          // Dynamically adjust max-width based on available space
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.min(300, availableWidth - 16)}px`,
            maxHeight: `${availableHeight - 16}px`,
          });
        },
        padding: 8,
      }),
      arrow({
        element: arrowRef,
        // Add padding to prevent arrow from touching edges
        // padding: 8,
      }),
    ],
    whileElementsMounted: autoUpdate,
    // Add strategy for better positioning
    strategy: 'fixed',
  });

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setIsVisible(false);
    }
  };

  const handleFocus = () => {
    if (!disabled) {
      setIsVisible(true);
    }
  };

  const handleBlur = () => {
    if (!disabled) {
      setIsVisible(false);
    }
  };

  // React Portal is outside main DOM tree, therefore we must add themes to it
  const savedTheme = localStorage.getItem('theme') as Themes | null;

  const tooltipElement = isVisible && !disabled && (
    <TooltipContainer
      ref={refs.setFloating}
      className={clsx(className, `theme-${savedTheme}`)}
      style={{...floatingStyles}}
      role="tooltip"
      aria-hidden={!isVisible}
    >
      {message}
      <FloatingArrow 
        ref={arrowRef} 
        context={context}
        fill="var(--color-black-20)"
        stroke="var(--color-primary)"
        strokeWidth={1}
        path=''
        tipRadius={2}
        height={10}
      />
    </TooltipContainer>
  );

  return (
    <>
      <TriggerWrapper
        ref={refs.setReference}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={isVisible ? 'tooltip' : undefined}
        tabIndex={0} // makes the element focusable for accessibility  
      >
        {children}
      </TriggerWrapper>
      {createPortal(tooltipElement, container)}
    </>
  );
};