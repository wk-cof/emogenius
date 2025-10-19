import { css } from "@emotion/react";
import type { Card } from "../types/game";

type MemoryCardProps = {
  card: Card;
  disabled: boolean;
  onClick: () => void;
};

const styles = {
  button: css`
    width: clamp(64px, 12vw, 96px);
    aspect-ratio: 1 / 1;
    border: none;
    padding: 0;
    background: transparent;
    border-radius: 18px;
    position: relative;
    cursor: pointer;
  `,
  buttonPeek: css`
    filter: brightness(1.05);
  `,
  buttonMatched: css`
    cursor: default;
  `,
  face: css`
    position: absolute;
    inset: 0;
    border-radius: 18px;
    display: grid;
    place-items: center;
    font-size: clamp(1.75rem, 6vw, 2.7rem);
    box-shadow: 0 10px 18px rgba(99, 102, 241, 0.2);
    transition: opacity 180ms ease, background 180ms ease, color 180ms ease,
      box-shadow 200ms ease;
    opacity: 0;
  `,
  back: css`
    background: #c7d2fe;
    color: #4338ca;
  `,
  front: css`
    background: #e0e7ff;
    color: #1f2933;
  `,
  frontMatched: css`
    background: #34d399;
    color: #064e3b;
    box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
  `,
  visible: css`
    opacity: 1;
  `
};

export function MemoryCard({ card, disabled, onClick }: MemoryCardProps) {
  const isFlipped = card.state !== "hidden";
  const isRevealed = card.state === "revealed";
  const isMatched = card.state === "matched";

  const buttonStyles = [styles.button];
  if (isMatched) {
    buttonStyles.push(styles.buttonMatched);
  } else if (isRevealed) {
    buttonStyles.push(styles.buttonPeek);
  }

  const frontStyles = [styles.face, styles.front];
  if (isMatched) {
    frontStyles.push(styles.frontMatched);
  }
  if (isFlipped) {
    frontStyles.push(styles.visible);
  }

  const backStyles = [styles.face, styles.back];
  if (!isFlipped) {
    backStyles.push(styles.visible);
  }

  return (
    <button
      type="button"
      css={buttonStyles}
      onClick={onClick}
      disabled={disabled}
      data-state={card.state}
      data-flipped={isFlipped}
      aria-pressed={card.state !== "hidden"}
      aria-label={
        card.state === "hidden"
          ? "Hidden card"
          : card.state === "matched"
          ? `Matched ${card.emoji}`
          : `Revealed ${card.emoji}`
      }
    >
      <span css={backStyles}>❔</span>
      <span css={frontStyles}>{card.emoji}</span>
    </button>
  );
}

export default MemoryCard;
