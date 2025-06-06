import styled from '@emotion/styled';
import { Button as ButtonComponent, Tooltip } from '@shared/components';
import { Tooltip as ReactTooltip } from 'react-tooltip';

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

  &.orange {
    background-color: #f97316;
    &:hover {
      background-color: #ea580c;
    }
  }

  &.indigo {
    background-color: #6366f1;
    &:hover {
      background-color: #4f46e5;
    }
  }

  &.gray {
    background-color: #1f2937;
    &:hover {
      background-color: #374151;
    }
  }
`;

const InfoBox = styled.div`
  margin-top: 32px;
  padding: 16px;
  background-color: #fefce8;
  border: 1px solid #fde047;
  border-radius: 4px;

  ul {
    margin-top: 8px;
    font-size: 14px;
    color: #a16207;

    li {
      margin-bottom: 4px;
    }
  }
`;

const CustomExample = styled.div`
  margin-top: 32px;

  .example-box {
    background-color: #f3f4f6;
    padding: 16px;
    border-radius: 4px;
  }
`;

const EdgeCaseContainer = styled.div`
  border: lime 1px solid;
`;

export const TooltipPage = () => {
  return (
    <DemoContainer>
      <h1>React Tooltip Demo</h1>
      <Grid>
        <div>
          <h2>Floating UI</h2>

          <ButtonGroup>
            <Tooltip message="This tooltip appears on top" position="top">
              <Button className="blue">Top Tooltip</Button>
            </Tooltip>

            <Tooltip
              message="This tooltip appears on the right"
              position="right"
            >
              <Button className="green">Right Tooltip</Button>
            </Tooltip>

            <Tooltip
              message="This tooltip appears on the bottom"
              position="bottom"
            >
              <Button className="purple">Bottom Tooltip</Button>
            </Tooltip>

            <Tooltip message="This tooltip appears on the left" position="left">
              <Button className="red">Left Tooltip</Button>
            </Tooltip>
          </ButtonGroup>

          {/* ================== REACT ================= */}
            <h2>React ToolTip</h2>
          <ButtonGroup>
            <ReactTooltip
              anchorSelect="#top"
              content="This tooltip appears on top"
              place="top"
              border="1px solid var(--color-primary)" 
            />
            <Button id="top" className="blue">
              Top Tooltip
            </Button>

            <ReactTooltip
              anchorSelect="#right"
              content="This tooltip appears on the right"
              place="right"
            />
            <Button id="right" className="green">Right Tooltip</Button>

            <ReactTooltip
              anchorSelect="#bottom"
              content="This tooltip appears on the bottom"
              place="bottom"
            />
            <Button id="bottom" className="purple">REACT Bottom Tooltip</Button>

            <ReactTooltip
              anchorSelect="#left"
              content="This tooltip appears on the left"
              place="left"
            />
            <Button id="left"className="red">Left Tooltip</Button>
          </ButtonGroup>
        </div>

        {/* <EdgeCaseContainer>
          <h2>Edge Cases</h2>

          <div>
            <p
              style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '8px',
              }}
            >
              Try hovering near the edges of the viewport:
            </p>

            <ButtonGroup >
              <Tooltip
                message="This tooltip will adjust its position to stay visible when near edges"
                position="top"
              >
                <Button className="orange">Edge Detection Test</Button>
              </Tooltip>

              <Tooltip
                message="Long tooltip message that demonstrates how the component handles longer text content and wrapping"
                position="bottom"
              >
                <Button className="indigo">Long Message</Button>
              </Tooltip>
            </ButtonGroup>
          </div>
        </EdgeCaseContainer> */}
      </Grid>

      {/* <CustomExample>
        <h2>Custom Usage Example</h2>
        <div className="example-box">
          <Tooltip message="this is a tooltip" position="right">
            <Button className="gray" onClick={() => alert('clicked!')}>
              You can click me!
            </Button>
          </Tooltip>
        </div>
      </CustomExample>

      <InfoBox>
        <h3>Features:</h3>
        <ul>
          <li>• Portal rendering (doesn't affect layout)</li>
          <li>• Edge detection and position adjustment</li>
          <li>• Automatic position flipping when near boundaries</li>
          <li>• Keyboard accessibility (focus/blur)</li>
          <li>• Customizable delay, offset, and styling</li>
          <li>• Responsive to viewport changes</li>
        </ul>
      </InfoBox> */}
    </DemoContainer>
  );
};
