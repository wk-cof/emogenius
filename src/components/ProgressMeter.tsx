import { css } from "@emotion/react";

type ProgressMeterProps = {
  percent: number;
  stars: string[];
  caption: string;
};

const styles = {
  root: css`
    background: rgba(254, 243, 199, 0.75);
    padding: 1.2rem 1.5rem;
    border-radius: 24px;
    display: grid;
    gap: 0.75rem;
    box-shadow: 0 14px 30px rgba(251, 191, 36, 0.22);
    text-align: center;
  `,
  track: css`
    position: relative;
    height: 16px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.6);
    overflow: hidden;
  `,
  fill: (percent: number) =>
    css`
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: ${percent}%;
      border-radius: inherit;
      background: linear-gradient(90deg, #f472b6, #c084fc, #38bdf8);
      transition: width 260ms ease;
    `,
  stars: css`
    display: flex;
    justify-content: center;
    gap: 0.35rem;
    font-size: 1.25rem;
    color: #f59e0b;
  `,
  caption: css`
    margin: 0;
    color: #9d174d;
    font-weight: 600;
  `
};

export function ProgressMeter({ percent, stars, caption }: ProgressMeterProps) {
  return (
    <section css={styles.root} aria-label="Adventure meter">
      <div css={styles.track} role="presentation">
        <div css={styles.fill(percent)} aria-hidden="true" />
      </div>
      <div css={styles.stars} aria-hidden="true">
        {stars.map((star, index) => (
          <span key={index}>{star}</span>
        ))}
      </div>
      <p css={styles.caption}>{caption}</p>
    </section>
  );
}

export default ProgressMeter;
