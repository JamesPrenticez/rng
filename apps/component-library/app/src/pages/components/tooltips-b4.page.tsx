import styled from '@emotion/styled';
import { TooltipRendererB4, tooltipsb4, useTooltipStore } from '@shared/components';
import { useRef, useState } from 'react';

const Container = styled.div``;

const Boundry = styled.div`
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

const TopButtonRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 8px 16px;
  color: white;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &.grow {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    span {
      font-size: 1rem;
      font-weight: 100;
      color: #333;
    }
  }

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

enum Method {
  ELEMENT = 'element',
  MOUSE = 'mouse',
  ABSOLUTE = 'absolute',
}

export const TooltipsB4Page = () => {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    w: '550px',
    h: '300px',
  });

  const [method, setMethod] = useState<Method>(Method.ELEMENT);

  let render = (() => {
    switch (method) {
      case Method.ELEMENT:
        return (
          <>
            <Button
              className="blue"
              onMouseEnter={(e) =>
                tooltipsb4.atElement(
                  'This appears on top',
                  e.currentTarget,
                  'top',
                  1000
                )
              }
            >
              Top Tooltip
            </Button>

            <Button
              className="green"
              onMouseEnter={(e) =>
                tooltipsb4.atElement(
                  'This appears on right',
                  e.currentTarget,
                  'right',
                  1000
                )
              }
            >
              Right Tooltip
            </Button>

            <Button
              className="purple"
              onMouseEnter={(e) =>
                tooltipsb4.atElement(
                  'This appears on left',
                  e.currentTarget,
                  'left',
                  1000
                )
              }
            >
              Left Tooltip
            </Button>

            <Button
              className="red"
              onMouseEnter={(e) =>
                tooltipsb4.atElement(
                  'This appears on bottom',
                  e.currentTarget,
                  'bottom',
                  1000
                )
              }
            >
              Bottom Tooltip
            </Button>
          </>
        );
      // case Method.MOUSE:
      //   return (
      //     <Button
      //       className="green grow"
      //       onClick={(e) =>
      //         tooltipsb4.atMouse(
      //           'This appears on top',
      //           'top',
      //         )
      //       }
      //     >
      //       Top Tooltip
      //       <span>(click anywhere)</span>
      //       <span>(test the edges)</span>
      //     </Button>
      //   );
      // case Method.ABSOLUTE:
      //   return (
      //     <Button
      //       className="purple grow"
      //       onClick={() =>
      //         tooltipsb4.atAbsolute(
      //           'This appears on top',
      //           x: 100,
      //           y: 100,
      //           'top',
      //           1500,
      //         )
      //       }
      //     >
      //       Absolute Tooltip
      //       <span>(click anywhere)</span>
      //       <span>(x: 100, y: 100)</span>
      //     </Button>
      //   );
      default:
        return null;
    }
  })();

  return (
    <Container>
      <TopButtonRow>
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

        {Object.values(Method).map((method) => (
          <Button
            key={method}
            className="yellow"
            onClick={() => {
              useTooltipStore.getState().clearTooltip();
              setMethod(method as Method)
            }
          }
          >
            {method}
          </Button>
        ))}
      </TopButtonRow>

      <TooltipRendererB4 boundaryRef={boundaryRef} />

      <Boundry
        ref={boundaryRef}
        style={{
          width: containerSize.w,
          height: containerSize.h,
        }}
      >
        {render}
      </Boundry>
    </Container>
  );
};

// const SVG = generateBellCurveSvg(0, 50, 21, "red", "white")
