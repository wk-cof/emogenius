import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BEST_STORAGE_KEY,
  COACH_EMOJI,
  DEFAULT_COACH_MESSAGE,
  DIFFICULTIES,
  EMOJI_THEMES,
  MISMATCH_TIMEOUT_MS,
  SETTINGS_STORAGE_KEY,
  type CoachMood,
  type Difficulty,
  type ThemeKey
} from "../constants/gameConfig";
import type { BestTimes, Card, StoredSettings } from "../types/game";
import {
  clampCustomDimension,
  difficultyKey,
  formatTime,
  shuffle
} from "../utils/gameUtils";

const isThemeKey = (value: unknown): value is ThemeKey =>
  typeof value === "string" &&
  Object.prototype.hasOwnProperty.call(EMOJI_THEMES, value);

const isDifficultyValue = (value: unknown): value is Difficulty =>
  value === "custom" ||
  (typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(DIFFICULTIES, value));

type UseGameEngineOptions = {
  initialTheme?: ThemeKey;
  initialDifficulty?: Difficulty;
};

type ProgressInfo = {
  fraction: number;
  percent: number;
  stars: string[];
  caption: string;
};

type CoachInfo = {
  message: string;
  mood: CoachMood;
  emoji: string;
};

type GameStats = {
  moves: number;
  elapsedSeconds: number;
  elapsedLabel: string;
  bestTimeLabel: string;
  pairsRemaining: number;
};

export type UseGameEngineReturn = {
  theme: ThemeKey;
  difficulty: Difficulty;
  customRows: number;
  customCols: number;
  rows: number;
  cols: number;
  deck: Card[];
  isBusy: boolean;
  isCustom: boolean;
  isGameWon: boolean;
  stats: GameStats;
  progress: ProgressInfo;
  coach: CoachInfo;
  startNewGame: () => void;
  handleCardClick: (index: number) => void;
  handleThemeChange: (theme: ThemeKey) => void;
  handleDifficultyChange: (difficulty: Difficulty) => void;
  handleCustomRowsChange: (rows: number) => void;
  handleCustomColsChange: (cols: number) => void;
};

export const useGameEngine = (
  options: UseGameEngineOptions = {}
): UseGameEngineReturn => {
  const [theme, setTheme] = useState<ThemeKey>(options.initialTheme ?? "animals");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    options.initialDifficulty ?? "easy"
  );
  const [customRows, setCustomRows] = useState(4);
  const [customCols, setCustomCols] = useState(4);
  const [deck, setDeck] = useState<Card[]>([]);
  const [revealedIndexes, setRevealedIndexes] = useState<number[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [targetPairs, setTargetPairs] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [bestTimes, setBestTimes] = useState<BestTimes>({});
  const [coachMessage, setCoachMessage] = useState(DEFAULT_COACH_MESSAGE);
  const [coachMood, setCoachMood] = useState<CoachMood>("excited");

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings) as Partial<StoredSettings>;
        if (parsed.theme && isThemeKey(parsed.theme)) {
          setTheme(parsed.theme);
        }
        if (parsed.difficulty && isDifficultyValue(parsed.difficulty)) {
          setDifficulty(parsed.difficulty);
        }
        if (typeof parsed.customRows === "number") {
          setCustomRows(clampCustomDimension(parsed.customRows));
        }
        if (typeof parsed.customCols === "number") {
          setCustomCols(clampCustomDimension(parsed.customCols));
        }
      } catch (error) {
        console.warn("Failed to load settings", error);
      }
    }
    const savedBest = localStorage.getItem(BEST_STORAGE_KEY);
    if (savedBest) {
      try {
        const parsed = JSON.parse(savedBest) as BestTimes;
        setBestTimes(parsed);
      } catch (error) {
        console.warn("Failed to load best times", error);
      }
    }
  }, []);

  useEffect(() => {
    const settings: StoredSettings = {
      theme,
      difficulty,
      customRows,
      customCols
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [theme, difficulty, customRows, customCols]);

  useEffect(() => {
    localStorage.setItem(BEST_STORAGE_KEY, JSON.stringify(bestTimes));
  }, [bestTimes]);

  useEffect(() => {
    const timer = isRunning
      ? window.setInterval(() => {
          setSecondsElapsed((seconds) => seconds + 1);
        }, 1000)
      : undefined;
    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [isRunning]);

  const { rows, cols } = useMemo(() => {
    if (difficulty === "custom") {
      return { rows: customRows, cols: customCols };
    }
    return DIFFICULTIES[difficulty];
  }, [customCols, customRows, difficulty]);

  const pairCount = useMemo(
    () => Math.floor((rows * cols) / 2),
    [rows, cols]
  );

  const startNewGame = useCallback(() => {
    const availableEmojis = EMOJI_THEMES[theme];
    const effectivePairCount = Math.min(pairCount, availableEmojis.length);
    const selectedEmojis = shuffle(availableEmojis).slice(0, effectivePairCount);
    const duplicated = selectedEmojis.flatMap((emoji) => [emoji, emoji]);
    const shuffled: Card[] = shuffle(duplicated).map((emoji, index) => ({
      id: index,
      emoji,
      state: "hidden"
    }));

    setDeck(shuffled);
    setRevealedIndexes([]);
    setIsBusy(false);
    setMoves(0);
    setMatches(0);
    setTargetPairs(effectivePairCount);
    setSecondsElapsed(0);
    setIsRunning(false);
    setCoachMood("excited");
    setCoachMessage(DEFAULT_COACH_MESSAGE);
  }, [pairCount, theme]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (targetPairs > 0 && matches === targetPairs) {
      setIsRunning(false);
      const celebrationMessage =
        secondsElapsed > 0
          ? `Amazing memory hero! You finished in ${formatTime(secondsElapsed)}!`
          : "Amazing memory hero! You found every buddy!";
      setCoachMood("celebrating");
      setCoachMessage(celebrationMessage);
      if (secondsElapsed > 0) {
        const key = difficultyKey(difficulty, rows, cols);
        setBestTimes((prev) => {
          const best = prev[key];
          if (best === undefined || secondsElapsed < best) {
            return { ...prev, [key]: secondsElapsed };
          }
          return prev;
        });
      }
    }
  }, [cols, difficulty, matches, rows, secondsElapsed, targetPairs]);

  const handleCardClick = useCallback(
    (index: number) => {
      if (isBusy) return;
      const card = deck[index];
      if (!card || card.state !== "hidden") return;

      const wasFirstPick = revealedIndexes.length === 0;
      const nextDeck = deck.map((item, idx) =>
        idx === index ? { ...item, state: "revealed" as const } : item
      );
      setDeck(nextDeck);

      const updatedRevealed = [...revealedIndexes, index];
      setRevealedIndexes(updatedRevealed);

      if (wasFirstPick) {
        setCoachMood("thinking");
        setCoachMessage(
          `Great choice! Can you remember where another ${card.emoji} buddy is hiding?`
        );
      }

      if (!isRunning) {
        setIsRunning(true);
      }

      if (updatedRevealed.length === 2) {
        setMoves((prev) => prev + 1);
        const [firstIndex, secondIndex] = updatedRevealed;
        const firstCard = nextDeck[firstIndex];
        const secondCard = nextDeck[secondIndex];

        if (!firstCard || !secondCard) {
          setRevealedIndexes([]);
          return;
        }

        if (firstCard.emoji === secondCard.emoji) {
          setDeck((prevDeck) =>
            prevDeck.map((item, idx) =>
              idx === firstIndex || idx === secondIndex
                ? { ...item, state: "matched" as const }
                : item
            )
          );
          setMatches((prev) => prev + 1);
          setRevealedIndexes([]);
          setCoachMood("excited");
          setCoachMessage(
            `Yay! The ${firstCard.emoji} buddies found each other! Keep going!`
          );
        } else {
          setIsBusy(true);
          setCoachMood("encouraging");
          setCoachMessage(
            "Nice try! Take another peek and you'll find the matching buddy."
          );
          window.setTimeout(() => {
            setDeck((prevDeck) =>
              prevDeck.map((item, idx) =>
                idx === firstIndex || idx === secondIndex
                  ? { ...item, state: "hidden" as const }
                  : item
              )
            );
            setRevealedIndexes([]);
            setIsBusy(false);
          }, MISMATCH_TIMEOUT_MS);
        }
      }
    },
    [deck, isBusy, isRunning, revealedIndexes]
  );

  const bestTimeLabel = useMemo(() => {
    const key = difficultyKey(difficulty, rows, cols);
    const best = bestTimes[key];
    return best ? formatTime(best) : "--";
  }, [bestTimes, cols, difficulty, rows]);

  const progress = useMemo<ProgressInfo>(() => {
    const fraction = targetPairs > 0 ? matches / targetPairs : 0;
    const percent = Math.min(100, Math.round(fraction * 100));
    const starSlots = 5;
    const filledStars = Math.min(
      starSlots,
      Math.max(0, Math.round(fraction * starSlots))
    );
    const stars = Array.from({ length: starSlots }, (_, index) =>
      index < filledStars ? "⭐" : "☆"
    );
    let caption = "Mission complete! Everyone is reunited!";
    if (fraction === 0) {
      caption = "Tip: peek at two cards to start the quest!";
    } else if (fraction < 0.34) {
      caption = "Great start! Your memory muscles are warming up.";
    } else if (fraction < 0.67) {
      caption = "Wow! You're halfway through the emoji forest.";
    } else if (fraction < 1) {
      caption = "So close! Just a few more buddies to rescue.";
    }
    return { fraction, percent, stars, caption };
  }, [matches, targetPairs]);

  const coachEmoji = COACH_EMOJI[coachMood];

  const isGameWon = targetPairs > 0 && matches === targetPairs;

  const handleThemeChange = useCallback((nextTheme: ThemeKey) => {
    setTheme(nextTheme);
  }, []);

  const handleDifficultyChange = useCallback(
    (nextDifficulty: Difficulty) => {
      setDifficulty(nextDifficulty);
    },
    []
  );

  const handleCustomRowsChange = useCallback((rowsValue: number) => {
    setCustomRows(clampCustomDimension(rowsValue));
  }, []);

  const handleCustomColsChange = useCallback((colsValue: number) => {
    setCustomCols(clampCustomDimension(colsValue));
  }, []);

  return {
    theme,
    difficulty,
    customRows,
    customCols,
    rows,
    cols,
    deck,
    isBusy,
    isCustom: difficulty === "custom",
    isGameWon,
    stats: {
      moves,
      elapsedSeconds: secondsElapsed,
      elapsedLabel: formatTime(secondsElapsed),
      bestTimeLabel,
      pairsRemaining: Math.max(0, targetPairs - matches)
    },
    progress,
    coach: {
      message: coachMessage,
      mood: coachMood,
      emoji: coachEmoji
    },
    startNewGame,
    handleCardClick,
    handleThemeChange,
    handleDifficultyChange,
    handleCustomRowsChange,
    handleCustomColsChange
  };
};

