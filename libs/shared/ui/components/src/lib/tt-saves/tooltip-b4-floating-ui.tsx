import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import type { TooltipProps } from '../tooltip/tooltip';
import { useTooltipPosition } from '../tooltip/tooltip-position.hook';
import { Arrow } from '../tooltip/tooltip-arrow';
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
  max-width: 300px;
  word-wrap: break-word;
  white-space: normal;
`;

export const Tooltip = ({
  children,
  message,
  position = 'top',
  delay = 200,
  offset = 8,
  className = '', 
  container = document.body,
  disabled = false,
}: TooltipProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);

  const { tooltipPosition, actualPosition, calculatePosition } =
    useTooltipPosition({
      position,
      offset,
    });

  // Handle position calculation when tooltip becomes visible
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      calculatePosition(triggerRef.current, tooltipRef.current);

      const handleResize = () => {
        if (triggerRef.current && tooltipRef.current) {
          calculatePosition(triggerRef.current, tooltipRef.current);
        }
      };

      const handleScroll = () => {
        if (triggerRef.current && tooltipRef.current) {
          calculatePosition(triggerRef.current, tooltipRef.current);
        }
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isVisible, message, position, calculatePosition]);

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
      ref={tooltipRef}
      className={clsx(className, `theme-${savedTheme}`)}
      style={{
        top: tooltipPosition.top,
        left: tooltipPosition.left,
      }}
      role="tooltip"
      aria-hidden={!isVisible}
    >
      {message}
      <Arrow position={actualPosition} />
    </TooltipContainer>
  );

  return (
    <>
      <TriggerWrapper
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={isVisible ? 'tooltip' : undefined}
        tabIndex={0} // Otherwise your cant focus the inner content
      >
        {children}
      </TriggerWrapper>
      {createPortal(tooltipElement, container)}
    </>
  );
};
