// components/AnswerOption.tsx
import React from 'react';
import { MatrixCell } from './MatrixCell';
import type { CellPattern } from '@/lib/iq-and-personality-tests/matrixiq/matrixiq-types';

interface AnswerOptionProps {
  pattern: CellPattern;
  index: number;
  isSelected: boolean;
  onDoubleClick: () => void;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  pattern,
  index,
  isSelected,
  onDoubleClick
}) => {
  const [isDoubleClicking, setIsDoubleClicking] = React.useState(false);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDoubleClicking(true);
    onDoubleClick();
    
    // Reset animation after delay
    setTimeout(() => setIsDoubleClicking(false), 300);
  };

  return (
    <button
      onDoubleClick={handleDoubleClick}
      className={`relative transition-all duration-200 rounded-lg overflow-visible p-1 ${
        isSelected 
          ? 'ring-4 ring-blue-500 scale-105 shadow-lg' 
          : 'hover:scale-[1.02] hover:ring-1 hover:ring-blue-100'
      } ${isDoubleClicking ? 'animate-pulse' : ''} active:scale-95`}
      title="Double-click to select and submit"
    >
      <MatrixCell pattern={pattern} highlight={isSelected} size={70} />
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center font-bold shadow-md">
        {index + 1}
      </div>
      {isSelected && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap shadow-sm">
          ✓ Selected
        </div>
      )}
    </button>
  );
};