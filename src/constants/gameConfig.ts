export const EMOJI_THEMES = {
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

export type ThemeKey = keyof typeof EMOJI_THEMES;

export const DIFFICULTIES = {
  easy: { label: "Easy • 4x3", rows: 3, cols: 4 },
  medium: { label: "Medium • 4x4", rows: 4, cols: 4 },
  hard: { label: "Hard • 4x6", rows: 4, cols: 6 }
} as const;

export type DifficultyKey = keyof typeof DIFFICULTIES;
export type Difficulty = DifficultyKey | "custom";

export type CoachMood = "excited" | "thinking" | "encouraging" | "celebrating";

export const COACH_EMOJI: Record<CoachMood, string> = {
  excited: "😺",
  thinking: "🤔",
  encouraging: "💪",
  celebrating: "🎉"
};

export const SETTINGS_STORAGE_KEY = "emoji-match-settings";
export const BEST_STORAGE_KEY = "emoji-match-best-times";

export const DEFAULT_COACH_MESSAGE =
  "Let's go on an emoji adventure! Flip two cards to find a buddy pair.";

export const MIN_CUSTOM_DIMENSION = 2;
export const MAX_CUSTOM_DIMENSION = 6;
export const MISMATCH_TIMEOUT_MS = 900;
