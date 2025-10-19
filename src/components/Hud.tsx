import { css } from "@emotion/react";

type HudProps = {
  moves: number;
  elapsedLabel: string;
  pairsRemaining: number;
  bestTimeLabel: string;
};

const styles = {
  root: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    background: #eef2ff;
    padding: 1rem;
    border-radius: 18px;
    color: #3730a3;
  `,
  stat: css`
    text-align: center;
  `,
  label: css`
    display: block;
    font-size: 0.85rem;
    color: #4338ca;
  `
};

export function Hud({
  moves,
  elapsedLabel,
  pairsRemaining,
  bestTimeLabel
}: HudProps) {
  return (
    <section css={styles.root} aria-live="polite" aria-label="Game stats">
      <div css={styles.stat}>
        <strong>{moves}</strong>
        <span css={styles.label}>Moves</span>
      </div>
      <div css={styles.stat}>
        <strong>{elapsedLabel}</strong>
        <span css={styles.label}>Timer</span>
      </div>
      <div css={styles.stat}>
        <strong>{pairsRemaining}</strong>
        <span css={styles.label}>Pairs remaining</span>
      </div>
      <div css={styles.stat}>
        <strong>{bestTimeLabel}</strong>
        <span css={styles.label}>Best time</span>
      </div>
    </section>
  );
}

export default Hud;
