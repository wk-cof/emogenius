import { css } from "@emotion/react";
import type { CoachMood } from "../constants/gameConfig";

type CoachPanelProps = {
  mood: CoachMood;
  emoji: string;
  message: string;
};

const styles = {
  container: css`
    display: flex;
    gap: 1.25rem;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-radius: 26px;
    box-shadow: 0 18px 30px rgba(249, 168, 212, 0.25);
    transition: background 200ms ease, box-shadow 200ms ease, color 200ms ease;
  `,
  message: css`
    margin: 0;
    font-weight: 700;
    font-size: clamp(1rem, 2.6vw, 1.1rem);
  `,
  avatar: css`
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 2.5rem;
    background: rgba(255, 255, 255, 0.72);
    box-shadow: 0 12px 26px rgba(249, 168, 212, 0.35);
  `
};

const moodStyles: Record<
  CoachMood,
  { container: ReturnType<typeof css>; avatar: ReturnType<typeof css> }
> = {
  excited: {
    container: css`
      background: linear-gradient(120deg, #fef3c7, #fde68a);
      color: #92400e;
    `,
    avatar: css`
      box-shadow: 0 12px 26px rgba(249, 168, 212, 0.35);
    `
  },
  thinking: {
    container: css`
      background: linear-gradient(120deg, #e0e7ff, #c7d2fe);
      color: #312e81;
      box-shadow: 0 18px 30px rgba(79, 70, 229, 0.2);
    `,
    avatar: css`
      box-shadow: 0 12px 26px rgba(79, 70, 229, 0.3);
    `
  },
  encouraging: {
    container: css`
      background: linear-gradient(120deg, #dcfce7, #bbf7d0);
      color: #166534;
      box-shadow: 0 18px 30px rgba(34, 197, 94, 0.22);
    `,
    avatar: css`
      box-shadow: 0 12px 26px rgba(34, 197, 94, 0.3);
    `
  },
  celebrating: {
    container: css`
      background: linear-gradient(120deg, #fde68a, #fbcfe8);
      color: #9d174d;
      box-shadow: 0 18px 30px rgba(236, 72, 153, 0.26);
    `,
    avatar: css`
      box-shadow: 0 12px 26px rgba(236, 72, 153, 0.35);
    `
  }
};

export function CoachPanel({ mood, emoji, message }: CoachPanelProps) {
  const moodStyle = moodStyles[mood];
  return (
    <section css={[styles.container, moodStyle.container]} aria-live="polite">
      <div css={[styles.avatar, moodStyle.avatar]} aria-hidden="true">
        {emoji}
      </div>
      <p css={styles.message}>{message}</p>
    </section>
  );
}

export default CoachPanel;
