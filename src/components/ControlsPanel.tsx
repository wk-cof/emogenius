import { css } from "@emotion/react";
import {
  DIFFICULTIES,
  EMOJI_THEMES,
  MAX_CUSTOM_DIMENSION,
  MIN_CUSTOM_DIMENSION,
  type Difficulty,
  type ThemeKey
} from "../constants/gameConfig";
import { controlField, secondaryButton } from "../styles/primitives";

type ControlsPanelProps = {
  theme: ThemeKey;
  difficulty: Difficulty;
  customRows: number;
  customCols: number;
  isCustom: boolean;
  onThemeChange: (theme: ThemeKey) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onRowsChange: (rows: number) => void;
  onColsChange: (cols: number) => void;
  onApplyCustom: () => void;
};

const styles = {
  root: css`
    display: grid;
    gap: 1rem;
  `,
  row: css`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  `,
  label: css`
    font-weight: 600;
  `,
  field: controlField,
  applyButton: css`
    ${secondaryButton};
  `
};

export function ControlsPanel({
  theme,
  difficulty,
  customRows,
  customCols,
  isCustom,
  onThemeChange,
  onDifficultyChange,
  onRowsChange,
  onColsChange,
  onApplyCustom
}: ControlsPanelProps) {
  return (
    <section css={styles.root} aria-label="Game settings">
      <div css={styles.row}>
        <label css={styles.label} htmlFor="theme-select">
          Theme
        </label>
        <select
          id="theme-select"
          value={theme}
          css={styles.field}
          onChange={(event) => onThemeChange(event.target.value as ThemeKey)}
        >
          {Object.keys(EMOJI_THEMES).map((key) => (
            <option key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div css={styles.row}>
        <label css={styles.label} htmlFor="difficulty-select">
          Difficulty
        </label>
        <select
          id="difficulty-select"
          value={difficulty}
          css={styles.field}
          onChange={(event) =>
            onDifficultyChange(event.target.value as Difficulty)
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
        <div css={styles.row} role="group" aria-label="Custom board size">
          <label css={styles.label} htmlFor="row-input">
            Rows
          </label>
          <input
            id="row-input"
            type="number"
            min={MIN_CUSTOM_DIMENSION}
            max={MAX_CUSTOM_DIMENSION}
            value={customRows}
            css={styles.field}
            onChange={(event) => onRowsChange(Number(event.target.value))}
          />
          <label css={styles.label} htmlFor="col-input">
            Columns
          </label>
          <input
            id="col-input"
            type="number"
            min={MIN_CUSTOM_DIMENSION}
            max={MAX_CUSTOM_DIMENSION}
            value={customCols}
            css={styles.field}
            onChange={(event) => onColsChange(Number(event.target.value))}
          />
          <button
            type="button"
            css={styles.applyButton}
            onClick={onApplyCustom}
            aria-label="Apply custom grid size"
          >
            Apply size
          </button>
        </div>
      )}
    </section>
  );
}

export default ControlsPanel;
