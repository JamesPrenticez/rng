import styled from '@emotion/styled';
import type { TooltipPosition } from './tooltip.d';

const StyledArrow = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  
  &.arrow-top {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #1a1a1a;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
  
  &.arrow-bottom {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #1a1a1a;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
  
  &.arrow-left {
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 8px solid #1a1a1a;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
  
  &.arrow-right {
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid #1a1a1a;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
`;

interface ArrowProps {
  position: TooltipPosition;
}

export const Arrow = ({ position }: ArrowProps) => {
  return <StyledArrow className={`arrow-${position}`} />
}
