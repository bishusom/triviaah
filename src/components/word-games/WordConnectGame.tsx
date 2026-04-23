'use client';

import confetti from 'canvas-confetti';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSound } from '@/context/SoundContext';
import {
  canUseLetters,
  loadDictionaryCandidates,
  normalizeWord,
  validateAnagramWord,
} from '@/lib/word-games/anagram-dictionary';

type WordConnectRound = {
  title: string;
  hint: string;
  seedWord: string;
  extraLetters: string[];
  goalCount: number;
  levelNumber: number;
  starterRevealedCount: number;
};

type SoundType = 'select' | 'found' | 'win' | 'error';

type CrosswordCell = {
  word: string;
  direction: 'across' | 'down';
  row: number;
  col: number;
};

type PuzzleSolutionCheck = {
  valid: boolean;
  missingWords: string[];
  conflicts: Array<{ row: number; col: number; existing: string; incoming: string }>;
  placements: Array<{
    word: string;
    direction: 'across' | 'down';
    row: number;
    col: number;
    length: number;
  }>;
};

const ROUND_POOLS: Record<number, Omit<WordConnectRound, 'levelNumber'>[]> = {
  1: [
    { title: 'Stone Spark', hint: 'A clean starter with plenty of common short words.', seedWord: 'stone', extraLetters: ['a', 'r'], goalCount: 4, starterRevealedCount: 1 },
    { title: 'Orbit Bloom', hint: 'A simple orbit of letters with a softer theme.', seedWord: 'orbit', extraLetters: ['a', 'e'], goalCount: 4, starterRevealedCount: 1 },
    { title: 'Flame Loop', hint: 'Warm-up letters with a slightly brighter feel.', seedWord: 'flame', extraLetters: ['r', 't'], goalCount: 4, starterRevealedCount: 1 },
  ],
  2: [
    { title: 'Garden Grid', hint: 'Nature letters with a few more branching words.', seedWord: 'garden', extraLetters: ['s', 't'], goalCount: 5, starterRevealedCount: 1 },
    { title: 'Planet Shift', hint: 'Astral letters with a larger word surface.', seedWord: 'planet', extraLetters: ['r', 's'], goalCount: 5, starterRevealedCount: 1 },
    { title: 'Silver Thread', hint: 'A smoother mid-tier puzzle with broader vocabulary.', seedWord: 'silver', extraLetters: ['a', 'n'], goalCount: 5, starterRevealedCount: 1 },
  ],
  3: [
    { title: 'Castle Chain', hint: 'A tougher set with longer linked words.', seedWord: 'castle', extraLetters: ['r', 'n'], goalCount: 6, starterRevealedCount: 1 },
    { title: 'Stream Web', hint: 'Flowing letters with stronger cross-links.', seedWord: 'stream', extraLetters: ['l', 'n'], goalCount: 6, starterRevealedCount: 1 },
    { title: 'Bridge Knot', hint: 'A tighter grid with more intersections.', seedWord: 'bridge', extraLetters: ['a', 's'], goalCount: 6, starterRevealedCount: 1 },
  ],
  4: [
    { title: 'Rocket Ring', hint: 'Fast-paced letters and denser overlaps.', seedWord: 'rocket', extraLetters: ['a', 's'], goalCount: 6, starterRevealedCount: 1 },
    { title: 'Mystic Pulse', hint: 'A late-game mix with less obvious word paths.', seedWord: 'mystic', extraLetters: ['a', 'r'], goalCount: 6, starterRevealedCount: 1 },
    { title: 'Harbor Circuit', hint: 'A finale round with more complex branching.', seedWord: 'harbor', extraLetters: ['t', 'e'], goalCount: 6, starterRevealedCount: 1 },
  ],
};

const LEVEL_COUNT = Object.keys(ROUND_POOLS).length;

function shuffle<T>(values: T[]) {
  const next = [...values];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function createLetterBank(round: WordConnectRound) {
  return shuffle([...round.seedWord, ...round.extraLetters].map((l) => l.toLowerCase()));
}

function chooseTargetWords(candidateWords: string[], round: WordConnectRound) {
  const seedWord = normalizeWord(round.seedWord);
  const unique = Array.from(new Set(candidateWords.map((w) => normalizeWord(w))))
    .filter((w) => w.length >= 3)
    .sort((a, b) => b.length - a.length || a.localeCompare(b));

  const targets: string[] = [];
  if (unique.includes(seedWord)) targets.push(seedWord);
  for (const word of unique) {
    if (targets.length >= round.goalCount) break;
    if (!targets.includes(word)) targets.push(word);
  }
  const selected = shuffle(targets.slice(0, round.goalCount));
  if (!selected.includes(seedWord) && unique.includes(seedWord)) {
    selected[selected.length - 1] = seedWord;
  }
  return shuffle(selected);
}

function hasCollision(layout: CrosswordCell[], newCell: CrosswordCell): boolean {
  for (const cell of layout) {
    const existingPositions = new Map<string, string>();
    for (let i = 0; i < cell.word.length; i++) {
      const r = cell.direction === 'down' ? cell.row + i : cell.row;
      const c = cell.direction === 'across' ? cell.col + i : cell.col;
      existingPositions.set(`${r},${c}`, cell.word[i]);
    }
    for (let i = 0; i < newCell.word.length; i++) {
      const r = newCell.direction === 'down' ? newCell.row + i : newCell.row;
      const c = newCell.direction === 'across' ? newCell.col + i : newCell.col;
      const key = `${r},${c}`;
      if (existingPositions.has(key) && existingPositions.get(key) !== newCell.word[i]) return true;
    }
  }
  return false;
}

function buildCrosswordLayout(words: string[]): CrosswordCell[] {
  if (!words.length) return [];
  const sorted = [...words].sort((a, b) => b.length - a.length);
  const layout: CrosswordCell[] = [];

  layout.push({ word: sorted[0], direction: 'across', row: 4, col: 0 });

  for (let wi = 1; wi < sorted.length; wi++) {
    const word = sorted[wi];
    let placed = false;

    for (const placed_cell of layout) {
      for (let ci = 0; ci < word.length && !placed; ci++) {
        for (let pci = 0; pci < placed_cell.word.length && !placed; pci++) {
          if (placed_cell.word[pci] === word[ci]) {
            if (placed_cell.direction === 'across') {
              const newCell: CrosswordCell = {
                word, direction: 'down',
                row: placed_cell.row - ci,
                col: placed_cell.col + pci,
              };
              if (!hasCollision(layout, newCell)) { layout.push(newCell); placed = true; }
            } else {
              const newCell: CrosswordCell = {
                word, direction: 'across',
                row: placed_cell.row + pci,
                col: placed_cell.col - ci,
              };
              if (!hasCollision(layout, newCell)) { layout.push(newCell); placed = true; }
            }
          }
        }
      }
    }

    if (!placed) {
      const maxRow = Math.max(...layout.map((c) =>
        c.direction === 'down' ? c.row + c.word.length - 1 : c.row
      ));
      layout.push({ word, direction: 'across', row: maxRow + 2, col: 0 });
    }
  }

  return layout;
}

function getLetterMap(layout: CrosswordCell[], foundWords: string[]) {
  const map = new Map<string, { letter: string; revealed: boolean }>();
  for (const cell of layout) {
    const found = foundWords.includes(cell.word);
    for (let i = 0; i < cell.word.length; i++) {
      const r = cell.direction === 'down' ? cell.row + i : cell.row;
      const c = cell.direction === 'across' ? cell.col + i : cell.col;
      const key = `${r},${c}`;
      const existing = map.get(key);
      map.set(key, { letter: cell.word[i].toUpperCase(), revealed: found || (existing?.revealed ?? false) });
    }
  }
  return map;
}

function getGridBounds(layout: CrosswordCell[]) {
  let minRow = Infinity, maxRow = -Infinity, minCol = Infinity, maxCol = -Infinity;
  for (const cell of layout) {
    const endRow = cell.direction === 'down' ? cell.row + cell.word.length - 1 : cell.row;
    const endCol = cell.direction === 'across' ? cell.col + cell.word.length - 1 : cell.col;
    minRow = Math.min(minRow, cell.row);
    maxRow = Math.max(maxRow, endRow);
    minCol = Math.min(minCol, cell.col);
    maxCol = Math.max(maxCol, endCol);
  }
  return { minRow, maxRow, minCol, maxCol };
}

function getCirclePos(index: number, total: number, radiusPct = 36) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    left: `${50 + Math.cos(angle) * radiusPct}%`,
    top: `${50 + Math.sin(angle) * radiusPct}%`,
    transform: 'translate(-50%, -50%)',
  } as const;
}

function getWheelPoint(index: number, total: number, size = 232, radiusPct = 36) {
  const pos = getCirclePos(index, total, radiusPct);
  return {
    x: (parseFloat(pos.left) / 100) * size,
    y: (parseFloat(pos.top) / 100) * size,
  };
}

function getPuzzleSolutionCheck(layout: CrosswordCell[], targetWords: string[]): PuzzleSolutionCheck {
  const placements = layout.map((cell) => ({
    word: cell.word,
    direction: cell.direction,
    row: cell.row,
    col: cell.col,
    length: cell.word.length,
  }));
  const missingWords = targetWords
    .map((word) => normalizeWord(word))
    .filter((word) => !layout.some((cell) => normalizeWord(cell.word) === word));
  const conflicts: PuzzleSolutionCheck['conflicts'] = [];
  const occupied = new Map<string, string>();

  for (const cell of layout) {
    for (let i = 0; i < cell.word.length; i++) {
      const row = cell.direction === 'down' ? cell.row + i : cell.row;
      const col = cell.direction === 'across' ? cell.col + i : cell.col;
      const key = `${row},${col}`;
      const incoming = cell.word[i].toUpperCase();
      const existing = occupied.get(key);
      if (existing && existing !== incoming) {
        conflicts.push({ row, col, existing, incoming });
      } else {
        occupied.set(key, incoming);
      }
    }
  }

  return {
    valid: conflicts.length === 0 && missingWords.length === 0,
    missingWords,
    conflicts,
    placements,
  };
}

export default function WordConnectGame() {
  const { isMuted } = useSound();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [round, setRound] = useState<WordConnectRound>(() => {
    const initialPool = ROUND_POOLS[1];
    const initialRound = initialPool[Math.floor(Math.random() * initialPool.length)];
    return { ...initialRound, levelNumber: 1 };
  });
  const [letterBank, setLetterBank] = useState<string[]>([]);
  const [candidateWords, setCandidateWords] = useState<string[]>([]);
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [foundTargetWords, setFoundTargetWords] = useState<string[]>([]);
  const [bonusWords, setBonusWords] = useState<string[]>([]);
  const [hintCount, setHintCount] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState(0);
  const [flashMessage, setFlashMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [roundSolved, setRoundSolved] = useState(false);
  const [layout, setLayout] = useState<CrosswordCell[]>([]);
  const roundResetTimer = useRef<NodeJS.Timeout | null>(null);
  const loadTokenRef = useRef(0);
  const lastRoundKeyRef = useRef<string | null>(null);

  const clearRoundTimer = useCallback(() => {
    if (roundResetTimer.current) { clearTimeout(roundResetTimer.current); roundResetTimer.current = null; }
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;
    const sounds: Record<SoundType, string> = {
      select: '/sounds/click.mp3', found: '/sounds/correct.mp3',
      error: '/sounds/incorrect.mp3', win: '/sounds/win.mp3',
    };
    new Audio(sounds[type]).play().catch(() => undefined);
  }, [isMuted]);

  const pickRoundForLevel = useCallback((level: number) => {
    const pool = ROUND_POOLS[level] ?? ROUND_POOLS[1];
    if (!pool.length) {
      return {
        title: `Level ${level}`,
        hint: 'Fallback puzzle',
        seedWord: 'stone',
        extraLetters: ['a', 'r'],
        goalCount: 4,
        levelNumber: level,
        starterRevealedCount: 1,
      };
    }

    const previousKey = lastRoundKeyRef.current;
    const candidates = pool.filter((item) => `${level}:${item.title}:${item.seedWord}` !== previousKey);
    const next = (candidates.length ? candidates : pool)[Math.floor(Math.random() * (candidates.length ? candidates.length : pool.length))];
    const selected = { ...next, levelNumber: level };
    lastRoundKeyRef.current = `${level}:${selected.title}:${selected.seedWord}`;
    return selected;
  }, []);

  const showFlash = useCallback((msg: string) => {
    setFlashMessage(msg);
    setTimeout(() => setFlashMessage(''), 1600);
  }, []);

  const loadRound = useCallback(async (level = currentLevel) => {
    const token = ++loadTokenRef.current;
    setLoading(true); clearRoundTimer();
    setCurrentWord(''); setSelectedIndices([]); setFoundTargetWords([]);
    setBonusWords([]); setHintCount(0); setCandidateWords([]); setTargetWords([]);
    setLayout([]); setRoundSolved(false);

    const nextRound = pickRoundForLevel(level);
    setRound(nextRound);

    const bank = createLetterBank(nextRound);
    const candidates = await loadDictionaryCandidates(bank.join(''), 3);
    if (loadTokenRef.current !== token) return;

    const goals = chooseTargetWords(candidates, nextRound);
    const finalGoals = goals.length ? goals : [normalizeWord(nextRound.seedWord)];
    const starterCount = Math.min(nextRound.starterRevealedCount, Math.max(finalGoals.length - 1, 0));
    const starterWords = finalGoals.slice(0, starterCount);
    setLetterBank(bank);
    setCandidateWords(candidates);
    setTargetWords(finalGoals);
    setFoundTargetWords(starterWords);
    const nextLayout = buildCrosswordLayout(finalGoals);
    setLayout(nextLayout);
    const solutionCheck = getPuzzleSolutionCheck(nextLayout, finalGoals);
    console.groupCollapsed(`[WordConnect] Puzzle solution: ${nextRound.title} (Level ${nextRound.levelNumber})`);
    console.log('Letter bank:', bank.join('').toUpperCase());
    console.log('Target words:', finalGoals);
    console.log('Starter words:', starterWords);
    console.log('Valid puzzle:', solutionCheck.valid);
    console.table(solutionCheck.placements);
    if (solutionCheck.missingWords.length) {
      console.warn('Missing words:', solutionCheck.missingWords);
    }
    if (solutionCheck.conflicts.length) {
      console.warn('Crossword conflicts:', solutionCheck.conflicts);
    }
    console.groupEnd();
    setLoading(false);
  }, [clearRoundTimer, currentLevel, pickRoundForLevel]);

  useEffect(() => {
    void loadRound(currentLevel);
    return () => { clearRoundTimer(); loadTokenRef.current += 1; };
  }, [clearRoundTimer, currentLevel, loadRound]);

  const advanceRound = useCallback(() => {
    clearRoundTimer();
    setCurrentLevel((level) => (level % LEVEL_COUNT) + 1);
  }, [clearRoundTimer]);

  const handleRoundSolved = useCallback(() => {
    if (roundSolved) return;
    setRoundSolved(true);
    showFlash('Level Complete! 🎉');
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    playSound('win');
    roundResetTimer.current = setTimeout(advanceRound, 2200);
  }, [advanceRound, playSound, roundSolved, showFlash]);

  const clearWord = useCallback(() => {
    setCurrentWord(''); setSelectedIndices([]);
    playSound('select');
  }, [playSound]);

  const addLetterAtIndex = useCallback((index: number) => {
    if (loading || roundSolved || selectedIndices.includes(index)) return;
    setSelectedIndices((prev) => [...prev, index]);
    setCurrentWord((prev) => prev + letterBank[index]);
    playSound('select');
  }, [letterBank, loading, playSound, roundSolved, selectedIndices]);

  const shuffleLetters = useCallback(() => {
    if (loading || roundSolved) return;
    setLetterBank((prev) => shuffle(prev));
    clearWord();
  }, [clearWord, loading, roundSolved]);

  const revealHint = useCallback(() => {
    if (loading || roundSolved) return;
    const next = targetWords.find((w) => !foundTargetWords.includes(w));
    if (!next) { showFlash('All words found!'); return; }
    setHintCount((count) => count + 1);
    showFlash(`Hint: starts with "${next[0].toUpperCase()}"`);
    playSound('select');
  }, [foundTargetWords, loading, playSound, roundSolved, showFlash, targetWords]);

  const submitWord = useCallback(async () => {
    const normalized = normalizeWord(currentWord);
    if (!normalized || normalized.length < 3) {
      showFlash('Need at least 3 letters!'); playSound('error'); clearWord(); return;
    }
    if (!canUseLetters(normalized, letterBank.join(''))) {
      showFlash('Invalid letters!'); playSound('error'); clearWord(); return;
    }
    if (foundTargetWords.includes(normalized) || bonusWords.includes(normalized)) {
      showFlash('Already found!'); playSound('error'); clearWord(); return;
    }
    if (!candidateWords.includes(normalized)) {
      const validation = await validateAnagramWord(normalized, letterBank.join(''));
      if (!validation.valid) {
        showFlash('Not a valid word!'); playSound('error'); clearWord(); return;
      }
      setCandidateWords((prev) => [...prev, normalized]);
    }

    const isTarget = targetWords.includes(normalized);
    const points = normalized.length * 4 + (isTarget ? 15 : 5);
    setScore((s) => s + points);
    clearWord();
    playSound('found');
    showFlash(isTarget ? `${normalized.toUpperCase()}! +${points} 🪙` : `Bonus: ${normalized.toUpperCase()} +${points}`);

    if (isTarget) {
      setFoundTargetWords((prev) => {
        const next = prev.includes(normalized) ? prev : [...prev, normalized];
        if (next.length === targetWords.length) handleRoundSolved();
        return next;
      });
    } else {
      setBonusWords((prev) => [normalized, ...prev]);
    }
  }, [bonusWords, candidateWords, clearWord, currentWord, foundTargetWords, handleRoundSolved, letterBank, playSound, showFlash, targetWords]);

  // Grid
  const CELL = 38;
  const GAP = 3;
  const letterMap = getLetterMap(layout, foundTargetWords);
  const bounds = layout.length ? getGridBounds(layout) : { minRow: 0, maxRow: 0, minCol: 0, maxCol: 0 };
  const gridRows = bounds.maxRow - bounds.minRow + 1;
  const gridCols = bounds.maxCol - bounds.minCol + 1;
  const wheelPoints = selectedIndices.map((index) => getWheelPoint(index, letterBank.length));
  const wheelPath = wheelPoints.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <div style={{
      background: 'linear-gradient(160deg, #08111f 0%, #0c1726 44%, #050816 100%)',
      minHeight: '100dvh',
      fontFamily: "'Nunito', sans-serif",
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      maxWidth: 360, margin: '0 auto',
      userSelect: 'none', WebkitUserSelect: 'none',
      position: 'relative', overflow: 'hidden',
      paddingBottom: 6,
    }}>
      {/* Stars bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 70% 20%, rgba(180,120,255,0.08) 0%, transparent 60%)',
      }} />

      {/* Flash message */}
      {flashMessage && (
        <div style={{
          position: 'fixed', top: 56, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg,#06b6d4,#2563eb)',
          color: 'white', padding: '8px 22px', borderRadius: 22,
          fontWeight: 900, fontSize: 14, zIndex: 200,
          boxShadow: '0 8px 24px rgba(6,182,212,0.28)',
          animation: 'fadeSlide 0.25s ease',
          whiteSpace: 'nowrap',
        }}>
          {flashMessage}
        </div>
      )}

      {/* Header */}
      <div style={{
        width: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '10px 12px 6px', gap: 8,
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['↻', '→'] as const).map((icon, i) => (
            <button key={i} onClick={i === 0 ? () => void loadRound(currentLevel) : advanceRound}
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'rgba(15,23,42,0.9)',
                border: '1px solid rgba(34,211,238,0.22)',
                color: '#7dd3fc', cursor: 'pointer', fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
              }}>{icon}</button>
          ))}
        </div>

        <span style={{ color: 'white', fontWeight: 900, fontSize: 15, letterSpacing: 1 }}>
          LEVEL {round.levelNumber}
        </span>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(8,145,178,0.14)',
          border: '1px solid rgba(34,211,238,0.28)',
          borderRadius: 20, padding: '5px 10px 5px 7px',
        }}>
          <span style={{ fontSize: 16 }}>🪙</span>
          <span style={{ color: '#67e8f9', fontWeight: 900, fontSize: 13 }}>
            {score.toLocaleString()}
          </span>
          <span style={{
            background: 'linear-gradient(135deg,#06b6d4,#2563eb)', color: 'white', fontWeight: 900,
            fontSize: 11, borderRadius: 10, padding: '1px 5px', marginLeft: 2,
          }}>+</span>
        </div>
      </div>

      {/* Hint coins row */}
      <div style={{
        display: 'flex', gap: 6, padding: '0 12px 4px', alignSelf: 'flex-start',
      }}>
        {[0, 1].map((i) => (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg,#06b6d4,#2563eb)',
            border: '1px solid rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, boxShadow: '0 4px 12px rgba(6,182,212,0.22)',
          }}>🪙</div>
        ))}
      </div>

      {/* Crossword Grid */}
      <div style={{
        width: '100%', display: 'flex', justifyContent: 'center',
        padding: '0 12px 4px', minHeight: 140,
      }}>
        {loading ? (
          <div style={{
            color: 'rgba(255,255,255,0.45)', fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
            Loading puzzle...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateRows: `repeat(${gridRows}, ${CELL}px)`,
            gridTemplateColumns: `repeat(${gridCols}, ${CELL}px)`,
            gap: `${GAP}px`,
            transform: 'scale(0.94)',
            transformOrigin: 'top center',
          }}>
            {Array.from({ length: gridRows }, (_, ri) =>
              Array.from({ length: gridCols }, (_, ci) => {
                const r = bounds.minRow + ri;
                const c = bounds.minCol + ci;
                const cell = letterMap.get(`${r},${c}`);
                return (
                  <div key={`${ri}-${ci}`} style={{
                    width: CELL, height: CELL,
                    borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 15,
                    ...(cell ? {
                      background: cell.revealed
                        ? 'linear-gradient(145deg,#06b6d4,#2563eb)'
                        : 'rgba(15,23,42,0.72)',
                      border: cell.revealed
                        ? '1px solid rgba(125,211,252,0.65)'
                        : '1px solid rgba(148,163,184,0.18)',
                      color: cell.revealed ? 'white' : 'transparent',
                      boxShadow: cell.revealed
                        ? '0 6px 14px rgba(6,182,212,0.22),inset 0 1px 0 rgba(255,255,255,0.12)'
                        : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                    } : {
                      background: 'transparent', border: 'none',
                    }),
                  }}>
                    {cell?.revealed ? cell.letter : ''}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Recently found bonus words */}
      {bonusWords.length > 0 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center',
          padding: '2px 12px', width: '100%',
        }}>
          {bonusWords.slice(0, 4).map((w, i) => (
            <span key={i} style={{
              background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(34,211,238,0.18)',
              color: '#7dd3fc', fontWeight: 800, fontSize: 11,
              padding: '2px 9px', borderRadius: 999, letterSpacing: 0.8,
            }}>{w.toUpperCase()}</span>
          ))}
        </div>
      )}

      {/* Current word preview */}
      <div style={{ minHeight: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 12px' }}>
        {currentWord ? (
          <div style={{
            background: 'rgba(8,145,178,0.14)',
            border: '1px solid rgba(34,211,238,0.4)',
            borderRadius: 18, padding: '6px 18px',
            color: 'white', fontWeight: 900, fontSize: 16, letterSpacing: 4,
            boxShadow: '0 6px 16px rgba(6,182,212,0.18)',
          }}>
            {currentWord.toUpperCase()}
          </div>
        ) : (
          <div style={{ height: 40 }} />
        )}
      </div>

      {/* Letter Wheel */}
      <div style={{ position: 'relative', width: 232, height: 232, flexShrink: 0 }}>
        {/* Glow backdrop */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 42%, rgba(34,211,238,0.14) 0%, rgba(37,99,235,0.08) 48%, transparent 72%)',
          boxShadow: '0 0 42px rgba(34,211,238,0.12)',
        }} />
        {/* Inner circle */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 58, height: 58, borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(15,23,42,0.65)',
          border: '1px solid rgba(34,211,238,0.12)',
        }} />

        {/* SVG lines between selected letters */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 232 232">
          {selectedIndices.length > 1 && (
            <>
              <polyline
                points={wheelPath}
                fill="none"
                stroke="rgba(34,211,238,0.16)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={wheelPath}
                fill="none"
                stroke="rgba(34,211,238,0.92)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </svg>

        {/* Letter buttons */}
        {letterBank.map((letter, idx) => {
          const pos = getCirclePos(idx, letterBank.length, 36);
          const isSelected = selectedIndices.includes(idx);
          return (
            <button key={idx} onClick={() => addLetterAtIndex(idx)} style={{
              position: 'absolute', ...pos,
              width: 48, height: 48, borderRadius: '50%',
              background: isSelected
                ? 'linear-gradient(145deg,#22d3ee,#2563eb)'
                : 'linear-gradient(145deg,#0ea5e9,#1d4ed8)',
              border: isSelected
                ? '2px solid rgba(255,255,255,0.8)'
                : '1.5px solid rgba(125,211,252,0.45)',
              color: 'white', fontWeight: 900, fontSize: 22,
              cursor: 'pointer',
              boxShadow: isSelected
                ? '0 0 18px rgba(34,211,238,0.35), 0 5px 14px rgba(0,0,0,0.3)'
                : '0 6px 18px rgba(2,132,199,0.28), 0 2px 6px rgba(0,0,0,0.25)',
              transform: `translate(-50%,-50%) scale(${isSelected ? 1.1 : 1})`,
              transition: 'transform 0.1s, box-shadow 0.1s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {letter.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Bottom controls */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', maxWidth: 340, padding: '8px 12px 3px',
      }}>
        {[
          { icon: '💡', label: 'Hint', action: revealHint, badge: hintCount },
          { icon: '🔀', label: 'Shuffle', action: shuffleLetters },
          { icon: currentWord.length >= 3 ? '▶' : '✕', label: currentWord.length >= 3 ? 'Go' : 'Clear',
            action: currentWord.length >= 3 ? () => void submitWord() : clearWord },
          { icon: '↻', label: 'Reset', action: () => void loadRound(currentLevel) },
        ].map(({ icon, label, action, badge }, i) => (
          <button key={i} onClick={action} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            background: 'transparent', border: 'none', cursor: 'pointer',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              position: 'relative',
              background: (i === 2 && currentWord.length >= 3)
                ? 'linear-gradient(135deg,#06b6d4,#2563eb)'
                : 'rgba(15,23,42,0.86)',
              border: '1px solid rgba(34,211,238,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
              color: i === 2 && currentWord.length >= 3 ? 'white' : '#7dd3fc',
              boxShadow: (i === 2 && currentWord.length >= 3) ? '0 4px 16px rgba(6,182,212,0.24)' : 'none',
              transition: 'background 0.2s',
            }}>
              {icon}
              {typeof badge === 'number' ? (
                <span style={{
                  position: 'absolute',
                  top: -3,
                  right: -3,
                  minWidth: 16,
                  height: 16,
                  padding: '0 4px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg,#f59e0b,#f97316)',
                  border: '1px solid rgba(255,255,255,0.28)',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 900,
                  lineHeight: '14px',
                  textAlign: 'center',
                  boxShadow: '0 4px 10px rgba(249,115,22,0.24)',
                }}>
                  {badge}
                </span>
              ) : null}
            </div>
            <span style={{ fontSize: 9, fontWeight: 800, color: i === 2 ? 'rgba(255,255,255,0.72)' : '#7dd3fc' }}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Extra words + shuffle row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', maxWidth: 340, padding: '6px 12px 10px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(15,23,42,0.7)',
          border: '1px solid rgba(34,211,238,0.16)',
          borderRadius: 16, padding: '6px 12px',
        }}>
          <span style={{ fontSize: 16 }}>🔤</span>
          <span style={{ color: 'rgba(255,255,255,0.82)', fontWeight: 800, fontSize: 12 }}>
            {bonusWords.length} Extra Words
          </span>
        </div>
        <button onClick={shuffleLetters} style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'rgba(15,23,42,0.86)',
          border: '1px solid rgba(34,211,238,0.18)',
          color: '#7dd3fc', cursor: 'pointer', fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>↻</button>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
