import styled from '@emotion/styled';
import {
  TooltipRendererB2,
  tooltipsb2,
  useTooltipStore,
} from '@shared/components';
import { useRef, useState } from 'react';

const Container = styled.div`
display: flex;
flex-direction: column;
gap: 1rem;
`;

const Boundry = styled.div`
  position: relative;
  overflow: hidden;
  border: 2px solid red;
  margin-top: 2rem;

  height: 100%;
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

const containerSizes = {
  small: { w: '200px', h: '250px' },
  medium: { w: '300px', h: '250px' },
  large: { w: '550px', h: '350px' },
};

type Side = keyof typeof testSide;

const testSide = {
  center: { align: 'center', justify: 'center' },
  top: { align: 'center', justify: 'flex-start' },
  bottom: { align: 'center', justify: 'flex-end' },
  left: { align: 'flex-start', justify: 'center' },
  right: { align: 'flex-end', justify: 'center' },
};

export const TooltipsB2Page = () => {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(containerSizes.small);
  const [method, setMethod] = useState<Method>(Method.ELEMENT);
  const [sideToTest, setSideToTest] = useState<Side>("center")

  let render = (() => {
    switch (method) {
      case Method.ELEMENT:
        return (
          <>
            <Button
              className="blue"
              onMouseEnter={(e) =>
                tooltipsb2.atElement(
                  'This appears on',
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
                tooltipsb2.atElement(
                  'This appears on',
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
                tooltipsb2.atElement(
                  'This appears on',
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
                tooltipsb2.atElement(
                  'This appears on',
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
      case Method.MOUSE:
        return (
          <Button
            className="green grow"
            onClick={(e) => tooltipsb2.atMouse('This appears at mouse')}
          >
            Top Tooltip
            <span>(click anywhere)</span>
            <span>(test the edges)</span>
          </Button>
        );
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
        {Object.values(Method).map((method) => (
          <Button
            key={method}
            className="yellow"
            onClick={() => {
              useTooltipStore.getState().clearTooltip();
              setMethod(method as Method);
            }}
          >
            {method}
          </Button>
        ))}
      </TopButtonRow>

      <TopButtonRow>
        {Object.entries(containerSizes).map(([key, size]) => (
          <Button
            key={key}
            className="yellow"
            onClick={() => setContainerSize(size)}
          >
            {key}
          </Button>
        ))}
      </TopButtonRow>

      <TopButtonRow>
        {Object.entries(testSide).map(([key, side]) => (
          <Button
            key={key}
            className="yellow"
            onClick={() => setSideToTest(key as Side)}
          >
            {key}
          </Button>
        ))}
      </TopButtonRow>

      <TooltipRendererB2 boundaryRef={boundaryRef} />

      <Boundry
        ref={boundaryRef}
        style={{
          alignItems: testSide[sideToTest].align,
          justifyContent: testSide[sideToTest].justify,
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
