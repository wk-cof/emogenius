import { css } from "@emotion/react";

export const focusRing = css`
  &:focus-visible {
    outline: 3px solid rgba(79, 70, 229, 0.4);
    outline-offset: 3px;
  }
`;

export const controlField = css`
  border-radius: 12px;
  border: 1px solid #d9dde8;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  transition: transform 150ms ease, box-shadow 150ms ease;
  ${focusRing};
`;

export const primaryButton = css`
  border: none;
  border-radius: 12px;
  padding: 0.65rem 1.5rem;
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(99, 102, 241, 0.25);
  transition: transform 150ms ease, box-shadow 150ms ease;
  ${focusRing};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 24px rgba(99, 102, 241, 0.28);
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const secondaryButton = css`
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  color: #1f2933;
  border: 1px solid #cbd2d9;
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease;
  ${focusRing};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(148, 163, 184, 0.2);
  }

  &:active {
    transform: translateY(1px);
  }
`;
