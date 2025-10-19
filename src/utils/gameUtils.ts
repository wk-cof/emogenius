import { MAX_CUSTOM_DIMENSION, MIN_CUSTOM_DIMENSION, type Difficulty } from "../constants/gameConfig";

export const clampCustomDimension = (value: number) =>
  Math.min(MAX_CUSTOM_DIMENSION, Math.max(MIN_CUSTOM_DIMENSION, Math.round(value)));

export const shuffle = <T,>(array: readonly T[]): T[] => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

export const difficultyKey = (difficulty: Difficulty, rows: number, cols: number) =>
  difficulty === "custom" ? `custom-${rows}x${cols}` : difficulty;
