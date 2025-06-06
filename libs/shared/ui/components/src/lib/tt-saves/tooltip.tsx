import React, { useState, useRef, useEffect, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { Arrow } from './tooltip-arrow';

const TriggerWrapper = styled.div`
  display: inline-block;
  width: fit-content;
  height: fit-content;
  border: red 1px solid;
`;

const TooltipContainer = styled.div`
  position: fixed;
  z-index: 9999;
  padding: 8px 12px;
  font-size: 14px;
  color: white;
  background-color: var(--color-primary);
  border-radius: 8px;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
`;

interface TooltipProps extends PropsWithChildren {
  message: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  offset?: number;
  className?: string;
  container?: HTMLElement;
}

export const Tooltip = ({ 
  children, 
  message, 
  position = 'top',
  delay = 200,
  offset = 8,
  className = '',
  container = document.body
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    let top, left, finalPosition = position;

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
      left = 8; // Small margin from edge
    } else if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 8;
    }

    // Vertical boundary checking with position flipping
    if (top < 0 && (position === 'top')) {
      // Flip to bottom
      top = triggerRect.bottom + offset;
      finalPosition = 'bottom';
    } else if (top + tooltipRect.height > viewportHeight && (position === 'bottom')) {
      // Flip to top
      top = triggerRect.top - tooltipRect.height - offset;
      finalPosition = 'top';
    } else if (top < 0) {
      top = 8;
    } else if (top + tooltipRect.height > viewportHeight) {
      top = viewportHeight - tooltipRect.height - 8;
    }

    // Horizontal boundary checking with position flipping
    if (left < 0 && (position === 'left')) {
      // Flip to right
      left = triggerRect.right + offset;
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      finalPosition = 'right';
    } else if (left + tooltipRect.width > viewportWidth && (position === 'right')) {
      // Flip to left
      left = triggerRect.left - tooltipRect.width - offset;
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      finalPosition = 'left';
    }

    setTooltipPosition({
      top: top + scrollY,
      left: left + scrollX
    });
    setActualPosition(finalPosition);
  };

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      
      const handleResize = () => calculatePosition();
      const handleScroll = () => calculatePosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isVisible, message, position]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const tooltipElement = isVisible && (
    <TooltipContainer
      ref={tooltipRef}
      className={className}
      style={{
        top: tooltipPosition.top,
        left: tooltipPosition.left,
      }}
    >
      {message}
      <Arrow position={actualPosition}/>
    </TooltipContainer>
  );

  return (
    <>
      <TriggerWrapper
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </TriggerWrapper>
      {createPortal(tooltipElement, container)}
    </>
  );
};