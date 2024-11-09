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
import { useGetPlayers } from "@/components/GetPlayers";

export default function GameplayBreadCrumb() {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { state: gameState } = useSelector(
    (state: RootState) => state.gameState,
  );
  const { currentTurn, playerTurn } = useSelector(
    (state: RootState) => state.turnState,
  );
  const { playerData } = useGetPlayers();

  const getTitleState = () => {
    if (!gameId) return;
    if (gameState === "TurnsDiceRoll") {
      return "Turns Dice Roll";
    }

    if (currentTurn === playerTurn) {
      return "Your Turn!";
    } else {
      const currentPlayerName = Object.values(playerData).filter(
        (data) => data.turn === currentTurn,
      )[0].name;
      return `${currentPlayerName}'s Turn`;
    }
  };

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
        <BreadcrumbPage className="px-2 py-2">{getTitleState()}</BreadcrumbPage>{" "}
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}
