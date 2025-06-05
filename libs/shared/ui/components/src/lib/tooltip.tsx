import { PropsWithChildren, useState } from "react";
import styled from "@emotion/styled";
import clsx from "clsx";

const Container = styled.div`
  display: inline-block;
  position: relative;
  cursor: pointer;

  .wrapper {
    position: absolute;
    top: 100%;
    left: 50%;
    
    .tooltip {
      position: relative;

      font-family: "Charka Petch", sans-serif;
      color: var(--color-white-100);
      font-size: 1.8rem;
      white-space: nowrap;

      background: var(--color-light-black);
      padding: 1rem 2rem;
      border-radius: 0.8rem;
      border: 1px solid var(--color-primary);

      .arrow {
        position: absolute;
        inset:  -1.8rem 0 0 0;
        width: 100%;
        

        svg {
          fill: var(--color-light-black); 
          stroke: var(--color-primary);

          position: absolute;
          left: 50%;
          transform: translateX(-50%); 
          width: 2.8rem;
          stroke-width: 0.5px;
          z-index: 9999;
        }
      }
    }
    
    visibility: hidden;
    transform: translate(-50%, 2rem);

    opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;

    z-index: 50;

    &.visible {
      opacity: 1;
      visibility: visible;
    }
  }
`;

interface TooltipProps extends PropsWithChildren {
  message: string;
  overRide?: boolean;
}

export const Tooltip = ({ children, message, overRide }: TooltipProps) => {
  const [visible, setVisible] = useState(true);
  const triangle = generateBellCurveSvg(10, 21, 5);

  return (
    <Container
      onMouseEnter={() => !overRide && setVisible(true)}
      onMouseLeave={() => !overRide && setVisible(false)}
    >
      <div className={clsx("wrapper", {visible: visible})}>
        <div className="tooltip">

          <div className="arrow">
            {triangle}
          </div>

          {message}
        </div>
        
      </div>
      {children}
    </Container>
  );
};

// This is function that generates the bell curve SVG
const generateBellCurveSvg = (x1: number, x2: number, height: number, stroke='var(--color-primary)', fill='var(--color-light-black)') => {
  const width = x2 - x1;
  const quart = width / 4;

  const pathData = `M${x1} ${height} C ${x1 + quart} ${height}, ${x1 + quart} 0, ${x1 + quart * 2} 0, ${x1 + quart * 3} 0, ${x1 + quart * 3} ${height}, ${x2} ${height}`;
  const pathData1 = `
    M${x1} ${height} 
    C ${x1 + quart} ${height}, 
      ${x1 + quart} 0, 
      ${x1 + quart * 2} 0, 
      ${x1 + quart * 3} 0, 
      ${x1 + quart * 3} ${height}, 
      ${x2} ${height} 
    L${x2} ${height + 1} 
    L${x1} ${height + 1} 
    Z
  `;

  return (
      <svg 
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`${x1} 0 ${width} ${height + 4}`}
      >
        <g transform={`translate(0, ${2})`}>
          <path 
            d={pathData1}
            fill={fill} 
            stroke="none"
          />
          <path 
            d={pathData}
            fill={fill}
            stroke={stroke}
            vectorEffect="non-scaling-stroke"
            strokeWidth={1}
          />
        </g>
      </svg>
  );
};

