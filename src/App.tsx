import { useCallback, useEffect, useMemo, useState } from "react";

const THEMES = {
  animals: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🐔",
    "🦄",
    "🐙",
    "🦋",
    "🐢",
    "🐞",
    "🐝"
  ],
  food: [
    "🍏",
    "🍊",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🫐",
    "🍒",
    "🍑",
    "🥑",
    "🥕",
    "🍅",
    "🍔",
    "🍟",
    "🍕",
    "🌮",
    "🍣",
    "🍩",
    "🍪",
    "🧁",
    "🍿",
    "🥨"
  ],
  sports: [
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🎾",
    "🏐",
    "🏉",
    "🥏",
    "🎱",
    "🏓",
    "🏸",
    "🥊",
    "🥋",
    "🥌",
    "⛳",
    "🥅",
    "⛸️",
    "🤿",
    "🛼",
    "🚴",
    "🤸",
    "🏇"
  ],
  nature: [
    "🌲",
    "🌳",
    "🌴",
    "🌵",
    "🌼",
    "🌻",
    "🌸",
    "🌺",
    "🌷",
    "🌹",
    "🍁",
    "🍄",
    "🌙",
    "⭐",
    "🌈",
    "⚡",
    "❄️",
    "🔥",
    "🌊",
    "🪵",
    "🪨",
    "🌞"
  ],
  space: [
    "🚀",
    "🛰️",
    "🛸",
    "🌌",
    "🌠",
    "🪐",
    "☄️",
    "🌙",
    "⭐",
    "🌞",
    "🌎",
    "🌏",
    "🌍",
    "👽",
    "👾",
    "🧑‍🚀",
    "🛰",
    "📡",
    "🔭",
    "🪐",
    "🪂",
    "🪄"
  ],
  transport: [
    "🚗",
    "🚕",
    "🚌",
    "🚎",
    "🏎️",
    "🚓",
    "🚑",
    "🚒",
    "🚐",
    "🚚",
    "🚜",
    "🛵",
    "🏍️",
    "🚲",
    "🛴",
    "🚂",
    "✈️",
    "🛥️",
    "🚁",
    "🚀",
    "🛸",
    "🚡"
  ]
} as const;

const DIFFICULTIES = {
  easy: { label: "Easy • 4x3", rows: 3, cols: 4 },
  medium: { label: "Medium • 4x4", rows: 4, cols: 4 },
  hard: { label: "Hard • 4x6", rows: 4, cols: 6 }
} as const;

type ThemeKey = keyof typeof THEMES;
type DifficultyKey = keyof typeof DIFFICULTIES;
type Difficulty = DifficultyKey | "custom";

type CardState = "hidden" | "revealed" | "matched";

type Card = {
  id: number;
  emoji: string;
  state: CardState;
};

type StoredSettings = {
  theme: ThemeKey;
  difficulty: Difficulty;
  customRows: number;
  customCols: number;
};

type BestTimes = Record<string, number>;

const SETTINGS_STORAGE_KEY = "emoji-match-settings";
const BEST_STORAGE_KEY = "emoji-match-best-times";

const shuffle = <T,>(array: T[]): T[] => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

const difficultyKey = (difficulty: Difficulty, rows: number, cols: number) =>
  difficulty === "custom" ? `custom-${rows}x${cols}` : difficulty;

const clampCustomDimension = (value: number) =>
  Math.min(6, Math.max(2, Math.round(value)));

type CoachMood = "excited" | "thinking" | "encouraging" | "celebrating";

const COACH_EMOJI: Record<CoachMood, string> = {
  excited: "😺",
  thinking: "🤔",
  encouraging: "💪",
  celebrating: "🎉"
};

export default function App() {
  const [theme, setTheme] = useState<ThemeKey>("animals");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
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
  const [coachMessage, setCoachMessage] = useState(
    "Let's go on an emoji adventure! Flip two cards to find a buddy pair."
  );
  const [coachMood, setCoachMood] = useState<CoachMood>("excited");

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings) as StoredSettings;
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.difficulty) setDifficulty(parsed.difficulty);
        if (parsed.customRows) setCustomRows(parsed.customRows);
        if (parsed.customCols) setCustomCols(parsed.customCols);
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

  const pairCount = useMemo(() => Math.floor((rows * cols) / 2), [rows, cols]);

  const startNewGame = useCallback(() => {
    const availableEmojis = THEMES[theme];
    const effectivePairCount = Math.min(pairCount, availableEmojis.length);
    const selectedEmojis = shuffle(availableEmojis).slice(0, effectivePairCount);
    const duplicated = selectedEmojis.flatMap((emoji) => [emoji, emoji]);
    const shuffled = shuffle(duplicated).map((emoji, index) => ({
      id: index,
      emoji,
      state: "hidden" as CardState
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
    setCoachMessage(
      "Let's go on an emoji adventure! Flip two cards to find a buddy pair."
    );
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

  const handleCardClick = (index: number) => {
    if (isBusy) return;
    const card = deck[index];
    if (!card || card.state !== "hidden") return;

    const wasFirstPick = revealedIndexes.length === 0;

    const updatedDeck = deck.map((item, idx) =>
      idx === index ? { ...item, state: "revealed" } : item
    );
    setDeck(updatedDeck);
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
      const firstCard = updatedDeck[firstIndex];
      const secondCard = updatedDeck[secondIndex];

      if (firstCard.emoji === secondCard.emoji) {
        setDeck((prevDeck) =>
          prevDeck.map((item, idx) =>
            idx === firstIndex || idx === secondIndex
              ? { ...item, state: "matched" }
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
                ? { ...item, state: "hidden" }
                : item
            )
          );
          setRevealedIndexes([]);
          setIsBusy(false);
        }, 900);
      }
    }
  };

  const bestTime = useMemo(() => {
    const key = difficultyKey(difficulty, rows, cols);
    const best = bestTimes[key];
    return best ? formatTime(best) : "--";
  }, [bestTimes, cols, difficulty, rows]);

  const progressFraction = useMemo(
    () => (targetPairs > 0 ? matches / targetPairs : 0),
    [matches, targetPairs]
  );

  const progressPercent = Math.min(100, Math.round(progressFraction * 100));

  const progressCaption = useMemo(() => {
    if (progressFraction === 0) {
      return "Tip: peek at two cards to start the quest!";
    }
    if (progressFraction < 0.34) {
      return "Great start! Your memory muscles are warming up.";
    }
    if (progressFraction < 0.67) {
      return "Wow! You're halfway through the emoji forest.";
    }
    if (progressFraction < 1) {
      return "So close! Just a few more buddies to rescue.";
    }
    return "Mission complete! Everyone is reunited!";
  }, [progressFraction]);

  const progressStars = useMemo(() => {
    const starSlots = 5;
    const filledStars = Math.min(
      starSlots,
      Math.max(0, Math.round(progressFraction * starSlots))
    );
    return Array.from({ length: starSlots }, (_, index) =>
      index < filledStars ? "⭐" : "☆"
    );
  }, [progressFraction]);

  const coachEmoji = COACH_EMOJI[coachMood];

  const isGameWon = targetPairs > 0 && matches === targetPairs;

  const isCustom = difficulty === "custom";

  return (
    <div className="app-shell">
      <header>
        <div>
          <h1>Emoji Match</h1>
          <p>Flip, find the pair, and beat your best time!</p>
        </div>
        <button type="button" onClick={startNewGame} aria-label="Restart game">
          Restart
        </button>
      </header>

      <section className={`coach coach-${coachMood}`} aria-live="polite">
        <div className="coach-avatar" aria-hidden="true">
          {coachEmoji}
        </div>
        <p>{coachMessage}</p>
      </section>

      <section className="controls" aria-label="Game settings">
        <div className="controls-row">
          <label htmlFor="theme-select">Theme</label>
          <select
            id="theme-select"
            value={theme}
            onChange={(event) => setTheme(event.target.value as ThemeKey)}
          >
            {Object.keys(THEMES).map((key) => (
              <option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="controls-row">
          <label htmlFor="difficulty-select">Difficulty</label>
          <select
            id="difficulty-select"
            value={difficulty}
            onChange={(event) =>
              setDifficulty(event.target.value as Difficulty)
            }
          >
            {Object.entries(DIFFICULTIES).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </div>
        {isCustom && (
          <div className="controls-row" role="group" aria-label="Custom board size">
            <label htmlFor="row-input">Rows</label>
            <input
              id="row-input"
              type="number"
              min={2}
              max={6}
              value={customRows}
              onChange={(event) =>
                setCustomRows(clampCustomDimension(Number(event.target.value)))
              }
            />
            <label htmlFor="col-input">Columns</label>
            <input
              id="col-input"
              type="number"
              min={2}
              max={6}
              value={customCols}
              onChange={(event) =>
                setCustomCols(clampCustomDimension(Number(event.target.value)))
              }
            />
            <button
              type="button"
              className="secondary"
              onClick={startNewGame}
              aria-label="Apply custom grid"
            >
              Apply size
            </button>
          </div>
        )}
      </section>

      <section className="progress-meter" aria-label="Adventure meter">
        <div className="progress-track" role="presentation">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="progress-stars" aria-hidden="true">
          {progressStars.map((star, index) => (
            <span key={index}>{star}</span>
          ))}
        </div>
        <p className="progress-caption">{progressCaption}</p>
      </section>

      <section className="hud" aria-live="polite" aria-label="Game stats">
        <div className="hud-stat">
          <strong>{moves}</strong>
          <span>Moves</span>
        </div>
        <div className="hud-stat">
          <strong>{formatTime(secondsElapsed)}</strong>
          <span>Timer</span>
        </div>
        <div className="hud-stat">
          <strong>{targetPairs - matches}</strong>
          <span>Pairs remaining</span>
        </div>
        <div className="hud-stat">
          <strong>{bestTime}</strong>
          <span>Best time</span>
        </div>
      </section>

      <section
        className="game-grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(60px, 1fr))`
        }}
        aria-label="Memory cards"
      >
        {deck.map((card, index) => (
          <button
            key={card.id}
            type="button"
            className="card-button"
            onClick={() => handleCardClick(index)}
            disabled={card.state === "matched" || isBusy}
            data-state={card.state}
            aria-pressed={card.state !== "hidden"}
            aria-label={
              card.state === "hidden"
                ? "Hidden card"
                : card.state === "matched"
                ? `Matched ${card.emoji}`
                : `Revealed ${card.emoji}`
            }
          >
            {card.state === "hidden" && !revealedIndexes.includes(index)
              ? "❔"
              : card.emoji}
          </button>
        ))}
      </section>
      {isGameWon && (
        <div className="celebration-overlay" role="dialog" aria-modal="true">
          <div className="celebration-card">
            <span className="celebration-emoji" aria-hidden="true">
              🎊
            </span>
            <h2>Brilliant memory!</h2>
            <p>
              {secondsElapsed > 0
                ? `You reunited every buddy in ${formatTime(secondsElapsed)}.`
                : "You reunited every buddy!"}
            </p>
            <button type="button" onClick={startNewGame}>
              Play again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
