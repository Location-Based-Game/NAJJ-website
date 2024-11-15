import {
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import BreadCrumbDropdown from "./BreadCrumbDropdown";
import { ArrowRightFromLine } from "lucide-react";
import { useEffect, useState } from "react";

export default function GameplayBreadCrumb() {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { state: gameState } = useSelector(
    (state: RootState) => state.gameState,
  );
  const { currentTurn, playerTurn } = useSelector(
    (state: RootState) => state.turnState,
  );
  const players = useSelector((state: RootState) => state.players);
  const [title, setTitle] = useState("")

  useEffect(() => {
    if (!gameId) return;
    if (gameState === "TurnsDiceRoll") {
      setTitle("Turns Dice Roll");
      return;
    }

    if (currentTurn === playerTurn) {
      setTitle("Your Turn!");
    } else {
      const currentPlayer = Object.values(players).filter(
        (data) => data.turn === currentTurn,
      )[0];

      if (!currentPlayer) return;

      const currentPlayerName = currentPlayer.name;
      setTitle( `${currentPlayerName}'s Turn`)
    }
  }, [gameId, gameState, currentTurn, playerTurn])

  return (
    <BreadcrumbList>
      <BreadCrumbDropdown
        menuItems={["Home"]}
        customElements={[
          <>
            <ArrowRightFromLine className="size-4 opacity-70" />
            <div className="font-medium text-muted-foreground">Leave Game</div>
          </>,
        ]}
      >
        <div className="mr-2">{gameId}</div>
      </BreadCrumbDropdown>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="px-2 py-2">{title}</BreadcrumbPage>{" "}
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}
