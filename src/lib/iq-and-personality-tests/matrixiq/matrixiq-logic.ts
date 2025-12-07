// matrixiq-fixed-logic.ts
import type {
  Difficulty,
  MatrixQuestion,
  PatternType,
  TestScore,
  UserAnswer,
  CellPattern,
  QuestionData
} from './matrixiq-types';

/* ---------- Pattern Generation with Clear Rules ---------- */
const SHAPES = ['circle', 'square', 'triangle', 'diamond', 'pentagon', 'hexagon'];
const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

/* ---------- Question Data Generator ---------- */
export const generateQuestionData = (
  difficulty: Difficulty, 
  patternType: PatternType, 
  seed?: string
): QuestionData => {
  // Create deterministic seed that includes difficulty
  const effectiveSeed = seed || `${difficulty}-${patternType}-${Date.now()}`;
  const rand = (index: number) => {
    let hash = 0;
    const str = effectiveSeed + index;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs((hash % 10000) / 10000);
  };

  const matrix: (CellPattern | null)[] = [];
  
  // Generate matrix based on pattern type AND difficulty
  switch (patternType) {
    case 'shape': {
      // Shape patterns vary by difficulty
      const shapeOrder = SHAPES.slice(0, 3 + difficulty);
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          let shapeIdx: number;
          
          // Different patterns for different difficulties
          switch (difficulty) {
            case 1:
              // Simple: same shape in each row
              shapeIdx = row % shapeOrder.length;
              break;
            case 2:
              // Simple: same shape in each column
              shapeIdx = col % shapeOrder.length;
              break;
            case 3:
              // Diagonal pattern
              shapeIdx = (row + col) % shapeOrder.length;
              break;
            case 4:
              // More complex: row + 2*col
              shapeIdx = (row + 2 * col) % shapeOrder.length;
              break;
            case 5:
              // Complex: row * col + row + col
              shapeIdx = (row * col + row + col) % shapeOrder.length;
              break;
            default:
              shapeIdx = (row + col) % shapeOrder.length;
          }
          
          matrix.push({
            shape: shapeOrder[shapeIdx],
            color: COLORS[0],
            rotation: 0,
            size: 20 + difficulty * 2,
            quantity: 1
          });
        }
      }
      break;
    }

    case 'color': {
      // Color patterns vary by difficulty
      const colorOrder = COLORS.slice(0, 3 + difficulty);
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          let colorIdx: number;
          
          switch (difficulty) {
            case 1:
              // Each row has same color
              colorIdx = row % colorOrder.length;
              break;
            case 2:
              // Each column has same color
              colorIdx = col % colorOrder.length;
              break;
            case 3:
              // Diagonal pattern
              colorIdx = (row + col) % colorOrder.length;
              break;
            case 4:
              // Row + 2*col pattern
              colorIdx = (row * 2 + col) % colorOrder.length;
              break;
            case 5:
              // Complex: alternating pattern
              colorIdx = ((row % 2 === 0 ? row : row * 2) + col) % colorOrder.length;
              break;
            default:
              colorIdx = row % colorOrder.length;
          }
          
          matrix.push({
            shape: 'circle',
            color: colorOrder[colorIdx],
            rotation: 0,
            size: 20 + difficulty,
            quantity: 1
          });
        }
      }
      break;
    }

    case 'rotation': {
      // Rotation patterns vary by difficulty
      const rotationSteps = [90, 45, 30, 22.5, 15]; // Different steps for each difficulty
      const step = rotationSteps[difficulty - 1];
      
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          let rotation: number;
          
          switch (difficulty) {
            case 1:
              // Simple: increase by step each cell
              rotation = ((row * 3 + col) * step) % 360;
              break;
            case 2:
              // Row-based pattern
              rotation = (row * step * 3 + col * step) % 360;
              break;
            case 3:
              // Diagonal pattern
              rotation = ((row + col) * step * 2) % 360;
              break;
            case 4:
              // Complex pattern
              rotation = ((row * 2 + col * 3) * step) % 360;
              break;
            case 5:
              // Most complex pattern
              rotation = ((row * row + col * col) * step) % 360;
              break;
            default:
              rotation = ((row * 3 + col) * step) % 360;
          }
          
          matrix.push({
            shape: 'triangle',
            color: COLORS[0],
            rotation,
            size: 20 + difficulty,
            quantity: 1
          });
        }
      }
      break;
    }

    case 'size': {
      // Size patterns vary by difficulty
      const baseSize = 15;
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          let size: number;
          
          switch (difficulty) {
            case 1:
              // Same size in each row
              size = baseSize + row * 5;
              break;
            case 2:
              // Same size in each column
              size = baseSize + col * 5;
              break;
            case 3:
              // Diagonal pattern
              size = baseSize + (row === col ? 10 : Math.abs(row - col) * 3);
              break;
            case 4:
              // Row + col pattern
              size = baseSize + (row + col) * 3;
              break;
            case 5:
              // Complex: row^2 + col pattern
              size = baseSize + (row * row + col) * 2;
              break;
            default:
              size = baseSize + row * 5;
          }
          
          matrix.push({
            shape: 'circle',
            color: COLORS[0],
            rotation: 0,
            size: Math.max(10, Math.min(40, size)), // Limit size range
            quantity: 1
          });
        }
      }
      break;
    }

    case 'quantity': {
      // Quantity patterns vary by difficulty
      const maxQuantity = Math.min(6, 2 + difficulty);
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          let quantity: number;
          
          switch (difficulty) {
            case 1:
              // Same in each row
              quantity = row + 1;
              break;
            case 2:
              // Same in each column
              quantity = col + 1;
              break;
            case 3:
              // Row + col + 1
              quantity = row + col + 1;
              break;
            case 4:
              // Row * 2 + col
              quantity = Math.min(maxQuantity, row * 2 + col + 1);
              break;
            case 5:
              // Complex: Fibonacci-like pattern
              quantity = Math.min(maxQuantity, (row * row + col + 1));
              break;
            default:
              quantity = row + col + 1;
          }
          
          matrix.push({
            shape: 'circle',
            color: COLORS[0],
            rotation: 0,
            size: 20,
            quantity: Math.max(1, Math.min(maxQuantity, quantity))
          });
        }
      }
      break;
    }

    case 'combined': {
      // Combined patterns get more complex with difficulty
      const shapePool = SHAPES.slice(0, 3 + difficulty);
      const colorPool = COLORS.slice(0, 3 + difficulty);
      
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          let shapeIdx: number;
          let colorIdx: number;
          let rotation: number;
          let size: number;
          let quantity: number;
          
          // More complex patterns for higher difficulties
          if (difficulty <= 2) {
            // Simple combined: shape by row, color by col
            shapeIdx = row % shapePool.length;
            colorIdx = col % colorPool.length;
            rotation = ((row + col) * 45) % 360;
            size = 20 + row * 3;
            quantity = 1 + col;
          } else if (difficulty <= 4) {
            // Medium complexity
            shapeIdx = (row + col) % shapePool.length;
            colorIdx = (row * 2 + col) % colorPool.length;
            rotation = ((row * 3 + col * 2) * 30) % 360;
            size = 20 + (row + col) * 2;
            quantity = 1 + Math.abs(row - col);
          } else {
            // High complexity
            shapeIdx = (row * row + col) % shapePool.length;
            colorIdx = (row + col * col) % colorPool.length;
            rotation = ((row * 4 + col * 3) * 22.5) % 360;
            size = 20 + (row * 2 + col) * 2;
            quantity = 1 + (row % 2) + (col % 2);
          }
          
          matrix.push({
            shape: shapePool[shapeIdx],
            color: colorPool[colorIdx],
            rotation,
            size: Math.max(15, Math.min(35, size)),
            quantity: Math.max(1, Math.min(6, quantity))
          });
        }
      }
      break;
    }
  }

  // The missing cell is position 8 (bottom-right)
  const correctAnswer = matrix[8] as CellPattern;
  matrix[8] = null; // Mark as missing

  // Generate 5 distinct incorrect answers
  const incorrectAnswers: CellPattern[] = [];
  const usedPatterns = new Set<string>();
  usedPatterns.add(JSON.stringify(correctAnswer));

  // Function to generate a wrong pattern that breaks the rule
  const generateWrongPattern = (correct: CellPattern, breakType: string): CellPattern => {
    const wrong = { ...correct };
    
    switch (patternType) {
      case 'shape':
        if (breakType === 'wrongShape') {
          const availableShapes = SHAPES.filter(s => s !== correct.shape);
          wrong.shape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
        }
        break;
        
      case 'color':
        if (breakType === 'wrongColor') {
          const availableColors = COLORS.filter(c => c !== correct.color);
          wrong.color = availableColors[Math.floor(Math.random() * availableColors.length)];
        }
        break;
        
      case 'rotation':
        wrong.rotation = (correct.rotation + (difficulty * 15)) % 360;
        break;
        
      case 'size':
        wrong.size = Math.max(10, correct.size + (Math.random() > 0.5 ? 8 : -5));
        break;
        
      case 'quantity':
        wrong.quantity = Math.max(1, correct.quantity + (Math.random() > 0.5 ? 1 : -1));
        break;
        
      case 'combined':
        // Break multiple rules for combined patterns
        if (Math.random() > 0.5) {
          const availableShapes = SHAPES.filter(s => s !== correct.shape);
          wrong.shape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
        }
        if (Math.random() > 0.5) {
          const availableColors = COLORS.filter(c => c !== correct.color);
          wrong.color = availableColors[Math.floor(Math.random() * availableColors.length)];
        }
        wrong.rotation = (correct.rotation + 45) % 360;
        break;
    }
    
    return wrong;
  };

  // Generate different types of wrong answers based on difficulty
  const wrongTypes = ['wrongShape', 'wrongColor', 'wrongRotation', 'wrongSize', 'wrongQuantity'];
  
  for (let i = 0; i < 5; i++) {
    let attempts = 0;
    while (attempts < 20) {
      const wrongType = wrongTypes[i % wrongTypes.length];
      const wrongPattern = generateWrongPattern(correctAnswer, wrongType);
      const patternString = JSON.stringify(wrongPattern);
      
      if (!usedPatterns.has(patternString)) {
        usedPatterns.add(patternString);
        incorrectAnswers.push(wrongPattern);
        break;
      }
      attempts++;
    }
    
    // Fallback if we can't generate unique pattern
    if (incorrectAnswers.length <= i) {
      const fallbackPattern: CellPattern = {
        shape: SHAPES[i % SHAPES.length],
        color: COLORS[(i + 1) % COLORS.length],
        rotation: i * 60,
        size: 20 + i * 2,
        quantity: 1 + (i % 3)
      };
      incorrectAnswers.push(fallbackPattern);
    }
  }

  // Combine correct and incorrect answers
  const allOptions = [correctAnswer, ...incorrectAnswers];
  
  // Shuffle options and remember correct index
  const correctIndex = Math.floor(Math.random() * allOptions.length);
  [allOptions[0], allOptions[correctIndex]] = [allOptions[correctIndex], allOptions[0]];

  return {
    matrix,
    correctAnswer,
    options: allOptions,
    correctIndex
  };
};

/* ---------- Updated Question Generator ---------- */
export const generateQuestions = (): MatrixQuestion[] => {
  const patternTypes: PatternType[] = ['shape', 'rotation', 'size', 'color', 'quantity', 'combined'];
  const questions: MatrixQuestion[] = [];
  let id = 1;
  
  // Generate 6 questions for each difficulty level (one of each pattern type)
  for (let d = 1; d <= 5; d++) {
    // Shuffle pattern types to vary order
    const shuffledPatterns = [...patternTypes].sort(() => Math.random() - 0.5);
    
    for (let p = 0; p < shuffledPatterns.length; p++) {
      questions.push({
        id: `m${id++}`,
        difficulty: d as Difficulty,
        patternType: shuffledPatterns[p],
        points: d * 2, // Higher difficulty = more points
        correctAnswer: 0 // Placeholder, will be set dynamically
      });
    }
  }
  
  return questions;
};

/* ---------- Question Manager (Handles State) ---------- */
export class QuestionManager {
  private questionData = new Map<string, QuestionData>();
  
  getQuestionData(questionId: string, difficulty: Difficulty, patternType: PatternType): QuestionData {
    const key = questionId;
    
    if (!this.questionData.has(key)) {
      // Generate new question data with questionId as seed for consistency
      const data = generateQuestionData(difficulty, patternType, questionId);
      this.questionData.set(key, data);
    }
    
    return this.questionData.get(key)!;
  }
  
  checkAnswer(questionId: string, selectedIndex: number): boolean {
    const data = this.questionData.get(questionId);
    if (!data) return false;
    
    return selectedIndex === data.correctIndex;
  }
  
  clear() {
    this.questionData.clear();
  }
}

/* ---------- Singleton Instance ---------- */
export const questionManager = new QuestionManager();

/* ---------- Scoring Functions (Updated) ---------- */
export const calculateScore = (answers: UserAnswer[], questions: MatrixQuestion[]): TestScore => {
  const correct = answers.filter(a => a.isCorrect).length;
  const raw = answers.reduce((s, a) => {
    const q = questions.find(q => q.id === a.questionId);
    return s + (a.isCorrect && q ? q.points : 0);
  }, 0);
  const max = questions.reduce((s, q) => s + q.points, 0);
  const percentile = Math.round((raw / max) * 100);
  const iq = percentileToIQ(percentile);
  const accuracy = Math.round((correct / questions.length) * 100);
  const avgTime = answers.reduce((s, a) => s + a.timeTaken, 0) / answers.length;
  return { rawScore: raw, maxScore: max, percentile, iqEstimate: iq, accuracyRate: accuracy, avgResponseTime: avgTime };
};

const percentileToIQ = (p: number): number => {
  if (p >= 99.9) return 145;
  if (p >= 99) return 135;
  if (p >= 95) return 125;
  if (p >= 90) return 120;
  if (p >= 75) return 110;
  if (p >= 50) return 100;
  if (p >= 25) return 90;
  if (p >= 10) return 80;
  if (p >= 5) return 75;
  return 70;
};

export const getIQCategory = (iq: number) => {
  if (iq >= 140) return { 
    label: 'Exceptionally Gifted', 
    color: 'text-purple-600',
    icon: '🧠'
  };
  if (iq >= 130) return { 
    label: 'Highly Gifted', 
    color: 'text-blue-600',
    icon: '🚀'
  };
  if (iq >= 120) return { 
    label: 'Superior', 
    color: 'text-green-600',
    icon: '⭐'
  };
  if (iq >= 110) return { 
    label: 'High Average', 
    color: 'text-teal-600',
    icon: '📈'
  };
  if (iq >= 90) return { 
    label: 'Average', 
    color: 'text-gray-600',
    icon: '🔄'
  };
  if (iq >= 80) return { 
    label: 'Low Average', 
    color: 'text-orange-600',
    icon: '📉'
  };
  return { 
    label: 'Below Average', 
    color: 'text-red-600',
    icon: '🆘'
  };
};