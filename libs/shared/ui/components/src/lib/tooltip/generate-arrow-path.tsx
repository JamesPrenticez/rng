// This is function that generates the bell curve SVG
export const generateBellCurveSvg = (x1: number, x2: number, height: number, stroke='var(--color-primary)', fill='var(--color-light-black)') => {
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

  return {
    pathData,
    pathData1
  };
};

      // <svg 
      //   xmlns="http://www.w3.org/2000/svg"
      //   viewBox={`${x1} 0 ${width} ${height + 4}`}
      // >
      //   <g transform={`translate(0, ${2})`}>
      //     <path 
      //       d={pathData1}
      //       fill={fill} 
      //       stroke="none"
      //     />
      //     <path 
      //       d={pathData}
      //       fill={fill}
      //       stroke={stroke}
      //       vectorEffect="non-scaling-stroke"
      //       strokeWidth={1}
      //     />
      //   </g>
      // </svg>