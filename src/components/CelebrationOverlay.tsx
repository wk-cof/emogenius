import { css, keyframes } from "@emotion/react";
import { primaryButton } from "../styles/primitives";

type CelebrationOverlayProps = {
  elapsedLabel: string;
  onRestart: () => void;
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const popIn = keyframes`
  0% {
    transform: translateY(12px) scale(0.96);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const styles = {
  overlay: css`
    position: absolute;
    inset: 0;
    background: rgba(99, 102, 241, 0.12);
    display: grid;
    place-items: center;
    backdrop-filter: blur(3px);
    animation: ${fadeIn} 280ms ease forwards;
  `,
  card: css`
    background: #ffffff;
    border-radius: 28px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 20px 45px rgba(99, 102, 241, 0.28);
    display: grid;
    gap: 1rem;
    max-width: 320px;
    animation: ${popIn} 320ms ease forwards;
  `,
  heading: css`
    margin: 0;
    font-size: 1.6rem;
    color: #4338ca;
  `,
  message: css`
    margin: 0;
    color: #4c1d95;
    font-weight: 600;
  `,
  emoji: css`
    font-size: 2.6rem;
  `,
  button: primaryButton
};

export function CelebrationOverlay({
  elapsedLabel,
  onRestart
}: CelebrationOverlayProps) {
  const message =
    elapsedLabel !== "00:00"
    ? `You reunited every buddy in ${elapsedLabel}.`
    : "You reunited every buddy!";

  return (
    <div css={styles.overlay} role="dialog" aria-modal="true">
      <div css={styles.card}>
        <span css={styles.emoji} aria-hidden="true">
          🎊
        </span>
        <h2 css={styles.heading}>Brilliant memory!</h2>
        <p css={styles.message}>{message}</p>
        <button type="button" css={styles.button} onClick={onRestart}>
          Play again
        </button>
      </div>
    </div>
  );
}

export default CelebrationOverlay;
