import styled from '@emotion/styled';
import { TooltipRenderer, tooltips, Arrow } from '@shared/components';

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
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
  return (
    <DemoContainer>
      <TooltipRenderer />
      <h1>React Tooltip Demo</h1>
      <Grid>
        <div>
          <h2>Custom Tooltips</h2>

          <ButtonGroup>
            <Button
              className="blue"
              onMouseEnter={(e) =>
                tooltips.showRelativeToElement(
                  'This tooltip appears on the top',
                  e.currentTarget,
                  'top',
                  2000
                )
              }
            >
              Top Tooltip
            </Button>

            <Button
              className="purple"
              onMouseEnter={(e) =>
                tooltips.showRelativeToElement(
                  'This tooltip appears on the right',
                  e.currentTarget,
                  'right',
                  200000000
                )
              }
            >
              Right Tooltip
            </Button>

            <Button
              className="red"
              onMouseEnter={(e) =>
                tooltips.showRelativeToElement(
                  'This tooltip appears on the left',
                  e.currentTarget,
                  'left',
                  2000
                )
              }
            >
              Left Tooltip
            </Button>

            <Button
              className="green"
              onMouseEnter={(e) =>
                tooltips.showRelativeToElement(
                  'This tooltip appears on the bottom',
                  e.currentTarget,
                  'bottom',
                  2000
                )
              }
            >
              Bottom Tooltip
            </Button>

            <MockArrowContainer>
              Static Container for Arrow
              <Arrow side="top" />
              <Arrow side="bottom" />
              <Arrow side="left" />
              <Arrow side="right" />
            </MockArrowContainer>
          </ButtonGroup>
        </div>
      </Grid>
    </DemoContainer>
  );
};
