import { PropsWithChildren } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends PropsWithChildren {
  message: string;
  position?: TooltipPosition;
  delay?: number;
  offset?: number;
  className?: string;
  container?: HTMLElement;
  disabled?: boolean;
}

export interface TooltipPositionResult {
  top: number;
  left: number;
}