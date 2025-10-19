import { css, keyframes } from "@emotion/react";
import type { Card } from "../types/game";

type MemoryCardProps = {
  card: Card;
  disabled: boolean;
  onClick: () => void;
};

const matchedBounce = keyframes`
  0% {
    transform: rotateY(180deg) scale(1);
  }
  40% {
    transform: rotateY(180deg) scale(1.08);
  }
  70% {
    transform: rotateY(180deg) scale(0.98);
  }
  100% {
    transform: rotateY(180deg) scale(1);
  }
`;

const styles = {
  button: css`
    width: clamp(64px, 12vw, 96px);
    aspect-ratio: 1 / 1;
    border: none;
    padding: 0;
    background: transparent;
    border-radius: 18px;
    position: relative;
    perspective: 1000px;
    cursor: pointer;

    &:hover,
    &:active {
      transform: none;
      box-shadow: none;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.8;
    }
  `,
  inner: css`
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 18px;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    transition: transform 320ms ease;
  `,
  innerFlipped: css`
    transform: rotateY(180deg);
  `,
  innerPeek: css`
    transform: rotateY(180deg) translate3d(0, -4px, 0);
  `,
  face: css`
    position: absolute;
    inset: 0;
    border-radius: 18px;
    display: grid;
    place-items: center;
    font-size: clamp(1.75rem, 6vw, 2.7rem);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    box-shadow: 0 10px 18px rgba(99, 102, 241, 0.2);
    transition: transform 220ms ease, box-shadow 200ms ease, background 180ms ease,
      color 180ms ease;
  `,
  faceBack: css`
    background: #c7d2fe;
    color: #4338ca;
    transform: rotateY(0deg);
  `,
  faceFront: css`
    background: #e0e7ff;
    transform: rotateY(180deg);
    color: #1f2933;
  `,
  faceFrontPeek: css`
    transform: rotateY(180deg) translateY(-4px);
  `,
  faceFrontMatched: css`
    background: #34d399;
    color: #064e3b;
    box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
    animation: ${matchedBounce} 540ms ease;
  `
};

export function MemoryCard({ card, disabled, onClick }: MemoryCardProps) {
  const isFlipped = card.state !== "hidden";
  const isRevealed = card.state === "revealed";
  const isMatched = card.state === "matched";

  const innerStyles = [styles.inner];
  if (isFlipped) innerStyles.push(styles.innerFlipped);
  if (isRevealed) innerStyles.push(styles.innerPeek);

  const frontStyles = [styles.face, styles.faceFront];
  if (isRevealed) frontStyles.push(styles.faceFrontPeek);
  if (isMatched) frontStyles.push(styles.faceFrontMatched);

  const backStyles = [styles.face, styles.faceBack];

  return (
    <button
      type="button"
      css={styles.button}
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
      <span css={innerStyles} aria-hidden="true">
        {!isFlipped && <span css={backStyles}>❔</span>}
        {isFlipped && <span css={frontStyles}>{card.emoji}</span>}
      </span>
    </button>
  );
}

export default MemoryCard;
