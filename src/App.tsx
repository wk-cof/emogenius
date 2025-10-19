import { css, keyframes } from "@emotion/react";
import CelebrationOverlay from "./components/CelebrationOverlay";
import CoachPanel from "./components/CoachPanel";
import ControlsPanel from "./components/ControlsPanel";
import GameGrid from "./components/GameGrid";
import HeaderBar from "./components/HeaderBar";
import Hud from "./components/Hud";
import ProgressMeter from "./components/ProgressMeter";
import { useGameEngine } from "./hooks/useGameEngine";

const float = keyframes`
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(18px);
  }
`;

const styles = {
  shell: css`
    background: rgba(255, 255, 255, 0.92);
    border-radius: 28px;
    box-shadow: 0 24px 55px rgba(31, 41, 51, 0.16);
    padding: 2.5rem;
    width: min(980px, 100%);
    display: grid;
    gap: 2rem;
    position: relative;
    overflow: hidden;

    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 280px;
      height: 280px;
      border-radius: 50%;
      opacity: 0.4;
      filter: blur(0.5px);
      z-index: 0;
    }

    &::before {
      top: -120px;
      right: -90px;
      background: radial-gradient(
        circle at 30% 30%,
        #fbcfe8 0%,
        transparent 70%
      );
      animation: ${float} 12s ease-in-out infinite alternate;
    }

    &::after {
      bottom: -140px;
      left: -110px;
      background: radial-gradient(
        circle at 70% 70%,
        #bfdbfe 0%,
        transparent 70%
      );
      animation: ${float} 14s ease-in-out infinite alternate;
    }

    > * {
      position: relative;
      z-index: 1;
    }

    @media (max-width: 768px) {
      padding: 1.5rem;
    }
  `
};

export default function App() {
  const {
    theme,
    difficulty,
    customRows,
    customCols,
    cols,
    deck,
    isBusy,
    isCustom,
    isGameWon,
    stats,
    progress,
    coach,
    startNewGame,
    handleCardClick,
    handleThemeChange,
    handleDifficultyChange,
    handleCustomRowsChange,
    handleCustomColsChange
  } = useGameEngine();

  return (
    <div css={styles.shell}>
      <HeaderBar onRestart={startNewGame} />
      <CoachPanel mood={coach.mood} emoji={coach.emoji} message={coach.message} />
      <ControlsPanel
        theme={theme}
        difficulty={difficulty}
        customRows={customRows}
        customCols={customCols}
        isCustom={isCustom}
        onThemeChange={handleThemeChange}
        onDifficultyChange={handleDifficultyChange}
        onRowsChange={handleCustomRowsChange}
        onColsChange={handleCustomColsChange}
        onApplyCustom={startNewGame}
      />
      <ProgressMeter
        percent={progress.percent}
        stars={progress.stars}
        caption={progress.caption}
      />
      <Hud
        moves={stats.moves}
        elapsedLabel={stats.elapsedLabel}
        pairsRemaining={stats.pairsRemaining}
        bestTimeLabel={stats.bestTimeLabel}
      />
      <GameGrid
        deck={deck}
        cols={cols}
        isBusy={isBusy}
        onCardClick={handleCardClick}
      />
      {isGameWon && (
        <CelebrationOverlay
          elapsedLabel={stats.elapsedLabel}
          onRestart={startNewGame}
        />
      )}
    </div>
  );
}
