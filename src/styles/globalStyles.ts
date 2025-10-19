import { css } from "@emotion/react";

export const globalStyles = css`
  :root {
    font-family: "Nunito", "Segoe UI", sans-serif;
    color: #1f2933;
    background: linear-gradient(160deg, #f0f4ff 0%, #fdf3f0 100%);
    min-height: 100%;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
  }

  #root {
    display: flex;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  button,
  select,
  input {
    font: inherit;
  }
`;
