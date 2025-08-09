
import MuteButton from '@/components/MuteButton';
import SudokuPuzzle from '@/components/number-puzzles/sudoku/SudokuPuzzle';

export default function SudokuPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed right-4 z-50 style={{ top: '6rem' }}">
        <MuteButton />
      </div>      
      <h1 className="text-3xl font-bold text-center mb-6">Sudoku</h1>
      <SudokuPuzzle />
    </div>
  );
}