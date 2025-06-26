// // This is function that generates the bell curve SVG
// export const generateBellCurveSvg = (x1: number, x2: number, height: number, stroke='var(--color-primary)', fill='var(--color-light-black)') => {
//   const width = x2 - x1;
//   const quart = width / 4;

//   const pathData = `M${x1} ${height} C ${x1 + quart} ${height}, ${x1 + quart} 0, ${x1 + quart * 2} 0, ${x1 + quart * 3} 0, ${x1 + quart * 3} ${height}, ${x2} ${height}`;
//   const pathData1 = `
//     M${x1} ${height} 
//     C ${x1 + quart} ${height}, 
//       ${x1 + quart} 0, 
//       ${x1 + quart * 2} 0, 
//       ${x1 + quart * 3} 0, 
//       ${x1 + quart * 3} ${height}, 
//       ${x2} ${height} 
//     L${x2} ${height + 1} 
//     L${x1} ${height + 1} 
//     Z
//   `;

//   return {
//     pathData,
//     pathData1
//   };
// };

export const generateBellCurveSvg = (
  x1: number,
  x2: number,
  height: number,
  stroke = 'red',
  fill = 'white'
) => {
  const [start, end] = x1 < x2 ? [x1, x2] : [x2, x1];
  const width = end - start;
  const quart = width / 4;
  const strokeWidth = 2;
  const padding = strokeWidth;

  const minX = start - padding;
  const minY = -padding;
  const viewWidth = width + padding * 2;
  const viewHeight = height + padding * 2;

  const pathData = `M${start} ${height} C ${start + quart} ${height}, ${start + quart} 0, ${start + quart * 2} 0, ${start + quart * 3} 0, ${start + quart * 3} ${height}, ${end} ${height}`;
  const pathData1 = `
    M${start} ${height} 
    C ${start + quart} ${height}, 
      ${start + quart} 0, 
      ${start + quart * 2} 0, 
      ${start + quart * 3} 0, 
      ${start + quart * 3} ${height}, 
      ${end} ${height} 
    L${end} ${height + 1} 
    L${start} ${height + 1} 
    Z
  `;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${minX + 2} ${minY + 1.5} ${viewWidth - 4} ${viewHeight - 2.5}`}
            style={{
        border: "lime 1px solid"
      }}
    >
      <path d={pathData1} fill={fill} />
      <path
        d={pathData}
        fill={fill}
        stroke={stroke}
        vectorEffect="non-scaling-stroke"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};


