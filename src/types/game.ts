import type { Difficulty, ThemeKey } from "../constants/gameConfig";

export type CardState = "hidden" | "revealed" | "matched";

export type Card = {
  id: number;
  emoji: string;
  state: CardState;
};

export type StoredSettings = {
  theme: ThemeKey;
  difficulty: Difficulty;
  customRows: number;
  customCols: number;
};

export type BestTimes = Record<string, number>;
