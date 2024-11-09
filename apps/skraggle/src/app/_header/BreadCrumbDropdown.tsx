import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useLogOut from "@/hooks/useLogOut";
import { MainMenuStates } from "@/hooks/usePanelUI";
import { RootState, mainMenuState } from "@/store/store";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LeaveGameDialogue from "../_main-menu/LeaveGameDialogue";
import { useUnityReactContext } from "../_unity-player/UnityContext";

interface NavCollapsedDropdown {
  menuItems: MainMenuStates[];
  customElements?: React.ReactNode[];
  children: React.ReactNode;
}

export default function BreadCrumbDropdown({
  menuItems,
  customElements,
  children
}: NavCollapsedDropdown) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const dispatch = useDispatch();
  const { leaveGame } = useLogOut();
  const { callUnityFunction } = useUnityReactContext();

  const handleNavigate = (state: MainMenuStates) => {
    dispatch(
      mainMenuState.updateState({
        state,
        slideFrom: "left",
      }),
    );
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger
        className="flex items-center gap-1 outline-none"
        aria-label="Toggle menu"
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {menuItems.map((menuItem, i) => (
          <LeaveGameDialogue
            onLeave={async () => {
              setDropdownOpen(false);
              await leaveGame(menuItem);
              callUnityFunction("ResetGame");
            }}
            onCancel={() => setDropdownOpen(false)}
            triggerDialogue={!!gameId}
            key={i}
          >
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                if (!!gameId) return;
                handleNavigate(menuItem);
              }}
            >
              {customElements ? (
                customElements[i]
              ) : (
                menuItem
              )}
            </DropdownMenuItem>
          </LeaveGameDialogue>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
