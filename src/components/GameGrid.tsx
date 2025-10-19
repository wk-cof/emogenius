import { css } from "@emotion/react";
import type { Card } from "../types/game";
import MemoryCard from "./MemoryCard";

type GameGridProps = {
  deck: Card[];
  cols: number;
  isBusy: boolean;
  onCardClick: (index: number) => void;
};

const styles = {
  grid: (cols: number) =>
    css`
      display: grid;
      gap: 0.75rem;
      justify-content: center;
      grid-template-columns: repeat(${cols}, minmax(60px, 1fr));
    `
};

export function GameGrid({ deck, cols, isBusy, onCardClick }: GameGridProps) {
  return (
    <section css={styles.grid(cols)} aria-label="Memory cards">
      {deck.map((card, index) => (
        <MemoryCard
          key={card.id}
          card={card}
          disabled={card.state === "matched" || isBusy}
          onClick={() => onCardClick(index)}
        />
      ))}
    </section>
  );
}

export default GameGrid;
