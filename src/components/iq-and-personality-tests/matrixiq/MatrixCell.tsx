// components/MatrixCell.tsx
import React from 'react';
import type { CellPattern } from '@/lib/iq-and-personality-tests/matrixiq/matrixiq-types';

interface MatrixCellProps {
  pattern: CellPattern | null;
  isEmpty?: boolean;
  highlight?: boolean;
  size?: number;
}

export const MatrixCell: React.FC<MatrixCellProps> = ({
  pattern,
  isEmpty,
  highlight = false,
  size = 80
}) => {
  const ShapeRenderer: React.FC<CellPattern> = ({ shape, size: shapeSize, color, rotation, quantity = 1 }) => {
    const renderShape = (offsetX = 0, offsetY = 0) => {
      const center = 50; // SVG viewBox is 0-100, so center is at 50,50
      const transform = `rotate(${rotation} ${center + offsetX} ${center + offsetY})`;
      
      switch (shape) {
        case 'circle':
          return <circle cx={center + offsetX} cy={center + offsetY} r={shapeSize} fill={color} transform={transform} />;
        case 'square':
          return <rect 
            x={center - shapeSize + offsetX} 
            y={center - shapeSize + offsetY} 
            width={shapeSize * 2} 
            height={shapeSize * 2} 
            fill={color} 
            transform={transform} 
          />;
        case 'triangle': {
          const h = shapeSize * 1.732; // height of equilateral triangle
          return <polygon 
            points={`
              ${center + offsetX},${center - h / 2 + offsetY} 
              ${center - shapeSize + offsetX},${center + h / 2 + offsetY} 
              ${center + shapeSize + offsetX},${center + h / 2 + offsetY}
            `} 
            fill={color} 
            transform={transform} 
          />;
        }
        case 'diamond':
          return <polygon 
            points={`
              ${center + offsetX},${center - shapeSize + offsetY} 
              ${center + shapeSize + offsetX},${center + offsetY} 
              ${center + offsetX},${center + shapeSize + offsetY} 
              ${center - shapeSize + offsetX},${center + offsetY}
            `} 
            fill={color} 
            transform={transform} 
          />;
        case 'pentagon': {
          const points = Array.from({ length: 5 }, (_, i) => {
            const angle = (i * 72 - 90) * Math.PI / 180;
            return `${center + shapeSize * Math.cos(angle) + offsetX},${center + shapeSize * Math.sin(angle) + offsetY}`;
          }).join(' ');
          return <polygon points={points} fill={color} transform={transform} />;
        }
        case 'hexagon': {
          const points = Array.from({ length: 6 }, (_, i) => {
            const angle = (i * 60 - 90) * Math.PI / 180;
            return `${center + shapeSize * Math.cos(angle) + offsetX},${center + shapeSize * Math.sin(angle) + offsetY}`;
          }).join(' ');
          return <polygon points={points} fill={color} transform={transform} />;
        }
        default:
          return <circle cx={center + offsetX} cy={center + offsetY} r={shapeSize} fill={color} />;
      }
    };

    if (quantity === 1) return renderShape();

    // Positions for multiple shapes
    const positions: [number, number][] =
      quantity === 2 ? [[-15, 0], [15, 0]]
      : quantity === 3 ? [[-20, -10], [20, -10], [0, 15]]
      : quantity === 4 ? [[-15, -15], [15, -15], [-15, 15], [15, 15]]
      : quantity === 5 ? [[-20, -15], [20, -15], [-20, 15], [20, 15], [0, 0]]
      : [[-20, -15], [0, -15], [20, -15], [-20, 15], [0, 15], [20, 15]];

    return (
      <>
        {positions.slice(0, quantity).map((pos, i) => (
          <g key={i}>{renderShape(pos[0], pos[1])}</g>
        ))}
      </>
    );
  };

  if (isEmpty || pattern === null) {
    return (
      <div 
        className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-dashed border-gray-500 rounded-lg"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <span className="text-4xl text-gray-600 font-bold">?</span>
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center justify-center bg-white border-2 rounded-lg shadow-sm transition-all duration-200 ${
        highlight ? 'border-blue-500 border-4' : 'border-gray-300'
      }`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <ShapeRenderer {...pattern} />
      </svg>
    </div>
  );
};