type HeaderBarProps = {
  onRestart: () => void;
};

import { css } from "@emotion/react";
import { primaryButton } from "../styles/primitives";

const styles = {
  wrapper: css`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
  `,
  heading: css`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  `,
  title: css`
    font-size: clamp(2.2rem, 4vw, 2.8rem);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  `,
  subtitle: css`
    margin: 0;
    color: #52606d;
  `,
  button: primaryButton
};

export function HeaderBar({ onRestart }: HeaderBarProps) {
  return (
    <header css={styles.wrapper}>
      <div css={styles.heading}>
        <h1 css={styles.title}>Emoji Match</h1>
        <p css={styles.subtitle}>Flip, find the pair, and beat your best time!</p>
      </div>
      <button
        type="button"
        css={styles.button}
        onClick={onRestart}
        aria-label="Restart game"
      >
        Restart
      </button>
    </header>
  );
}

export default HeaderBar;
