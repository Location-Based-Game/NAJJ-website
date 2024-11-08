import { BreadcrumbEllipsis } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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

interface NavCollapsedDropdown {
  previousItems: MainMenuStates[];
}

export default function NavCollapsedDropdown({
  previousItems,
}: NavCollapsedDropdown) {
  const [ellipsisOpen, setEllipsisOpen] = useState(false);
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const dispatch = useDispatch();
  const { leaveGame } = useLogOut();

  const handleNavigate = (state: MainMenuStates) => {
    dispatch(
      mainMenuState.updateState({
        state,
        slideFrom: "left",
      }),
    );
  };

  return (
    <DropdownMenu open={ellipsisOpen} onOpenChange={setEllipsisOpen}>
      <DropdownMenuTrigger
        className="flex items-center gap-1 outline-none"
        aria-label="Toggle menu"
      >
        <BreadcrumbEllipsis className="pointer-events-auto h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {previousItems.reverse().map((menuItem, i) => (
          <DropdownMenuItem key={i} onSelect={(e) => e.preventDefault()}>
            <LeaveGameDialogue
              onLeave={() => {
                setEllipsisOpen(false);
                leaveGame(menuItem);
              }}
              onCancel={() => setEllipsisOpen(false)}
              triggerDialogue={!!gameId}
            >
              <Button
                variant="ghost"
                className="h-6 w-full justify-start px-0"
                onClick={() => {
                  if (!!gameId) return;
                  handleNavigate(menuItem);
                }}
              >
                {menuItem}
              </Button>
            </LeaveGameDialogue>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
