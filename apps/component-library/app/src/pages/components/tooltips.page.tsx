import styled from '@emotion/styled';
import { TooltipRenderer, tooltips, generateBellCurveSvg } from '@shared/components';

const Test = styled.div`
display: flex;
align-items: center;
justify-content: center;
  position: relative;
  border-radius: 0.8rem;
  padding: 0.5rem;
  text-align: center;
  border: solid 0.1rem var(--color-primary);
  background-color: rgba(var(--color-black-100-opacity), 0.7);


`;

const MockArrowContainer = styled.div`
  position: relative;
  border-radius: 0.8rem;
  padding: 0.5rem;
  text-align: center;
  border: solid 0.1rem var(--color-primary);
  background-color: rgba(var(--color-black-100-opacity), 0.7);
`;
const DemoContainer = styled.div`
  padding: 32px;

  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 24px;
  }

  h2 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  h3 {
    font-weight: 600;
    color: #b45309;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
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
`;

export const TooltipsPage = () => {

  // const SVG = generateBellCurveSvg(15, 0, 8, "red", "white")
  const SVG = generateBellCurveSvg(0, 50, 21, "red", "white")

  return (
    <DemoContainer>
      <TooltipRenderer />

      <Button
        className="blue"
        onMouseEnter={(e) =>
          tooltips.withFloating(
            'This appears on top',
            e.currentTarget,
            'right',
            2000
          )
        }
      >
        Top Tooltip
      </Button>

      <Button
        className="blue"
        onMouseEnter={(e) =>
          tooltips.withFloating(
            'This appears on top',
            e.currentTarget,
            'top',
            2000
          )
        }
      >
        Top Tooltip
      </Button>

<Test>
      {SVG}
</Test>

    </DemoContainer>
  );
};

//     <MockArrowContainer>
//       Static Container for Arrow
//       <Arrow side="top" />
//       <Arrow side="bottom" />
//       <Arrow side="left" />
//       <Arrow side="right" />
//     </MockArrowContainer>
//   </ButtonGroup>
// </div>
