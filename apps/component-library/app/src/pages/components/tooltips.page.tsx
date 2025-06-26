import styled from '@emotion/styled';
import { TooltipRenderer, tooltips } from '@shared/components';
import { useRef, useState } from 'react';

const Container = styled.div``;

const ClippingAncestor = styled.div`
  position: relative;
  overflow: hidden;
  border: 2px solid red;
  margin-top: 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 8px 16px;
  color: white;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &.blue {
    background-color: #3b82f6;
    &:hover {
      background-color: #2563eb;
    }
  }

  &.green {
    background-color: #10b981;
    &:hover {
      background-color: #059669;
    }
  }

  &.purple {
    background-color: #8b5cf6;
    &:hover {
      background-color: #7c3aed;
    }
  }

  &.red {
    background-color: #ef4444;
    &:hover {
      background-color: #dc2626;
    }
  }

  &.yellow {
    background-color: #ffcc66;
    color: #444;
    &:hover {
      background-color: #ffef99;
    }
  }
`;

export const TooltipsPage = () => {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    w: '200px',
    h: '250px',
  });

  return (
    <Container>
      <Button
        className="yellow"
        onClick={() =>
          setContainerSize((prev) =>
            prev.w === '200px'
              ? { w: '550px', h: '300px' }
              : { w: '200px', h: '250px' }
          )
        }
      >
        Toggle size
      </Button>
      <TooltipRenderer boundaryRef={boundaryRef} />

      <ClippingAncestor
        ref={boundaryRef}
        style={{
          width: containerSize.w,
          height: containerSize.h,
        }}
      >
        <Button
          className="blue"
          onMouseEnter={(e) =>
            tooltips.withFloating(
              'This appears on top',
              e.currentTarget,
              'top',
              9999999999
            )
          }
        >
          Top Tooltip
        </Button>

        <Button
          className="green"
          onMouseEnter={(e) =>
            tooltips.withFloating(
              'This appears on right',
              e.currentTarget,
              'right',
              9999999999
            )
          }
        >
          Right Tooltip
        </Button>

        <Button
          className="purple"
          onMouseEnter={(e) =>
            tooltips.withFloating(
              'This appears on left',
              e.currentTarget,
              'left',
              9999999999
            )
          }
        >
          Left Tooltip
        </Button>

        <Button
          className="red"
          onMouseEnter={(e) =>
            tooltips.withFloating(
              'This appears on bottom',
              e.currentTarget,
              'bottom',
              9999999999
            )
          }
        >
          Bottom Tooltip
        </Button>
      </ClippingAncestor>
    </Container>
  );
};

// const SVG = generateBellCurveSvg(0, 50, 21, "red", "white")
