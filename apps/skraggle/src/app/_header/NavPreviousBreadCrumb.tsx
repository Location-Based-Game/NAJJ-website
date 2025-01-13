import useLogOut from "@/hooks/useLogOut";
import { mainMenuState, MainMenuStates, RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
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
        className="px-2 py-2 font-normal text-white/60 hover:bg-[#4b4e5344] hover:text-white/60"
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
