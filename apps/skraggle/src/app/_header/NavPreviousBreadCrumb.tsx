import useLogOut from "@/hooks/useLogOut";
import LeaveGameDialogue from "../_main-menu/LeaveGameDialogue";
import { mainMenuState, RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { MainMenuStates } from "@/hooks/usePanelUI";
import { BreadcrumbItem } from "@/components/ui/breadcrumb";

export default function NavPreviousBreadCrumb({
  menuItem,
}: {
  menuItem: MainMenuStates;
}) {
  const dispatch = useDispatch();
  const { leaveGame } = useLogOut();
  const { gameId } = useSelector((state: RootState) => state.logIn);

  const handleNavigate = (state: MainMenuStates) => {
    dispatch(
      mainMenuState.updateState({
        state,
        slideFrom: "left",
      }),
    );
  };

  return (
    <BreadcrumbItem>
      <LeaveGameDialogue
        onLeave={() => leaveGame(menuItem)}
        triggerDialogue={!!gameId}
      >
        <Button
          variant="ghost"
          className="px-2 py-2"
          onClick={() => {
            if (!!gameId) return;
            handleNavigate(menuItem);
          }}
        >
          {menuItem}
        </Button>
      </LeaveGameDialogue>
    </BreadcrumbItem>
  );
}
