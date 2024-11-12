import useLogOut from "@/hooks/useLogOut";
import { mainMenuState, RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { MainMenuStates } from "@/hooks/usePanelUI";
import { BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useLeaveGame } from "../LeaveGameProvider";

export default function NavPreviousBreadCrumb({
  menuItem,
}: {
  menuItem: MainMenuStates;
}) {
  const dispatch = useDispatch();
  const { leaveGame } = useLogOut();
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { setOpenDialogue, onLeave } = useLeaveGame();

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
      <Button
        variant="ghost"
        className="px-2 py-2"
        onClick={() => {
          if (!!gameId) {
            onLeave.current = async () => {
              await leaveGame(menuItem);
            };
            setOpenDialogue(true);
          } else {
            handleNavigate(menuItem);
          }
        }}
      >
        {menuItem}
      </Button>
    </BreadcrumbItem>
  );
}
