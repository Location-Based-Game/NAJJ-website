import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import type { MainMenuStates } from "@/hooks/usePanelUI";
import { mainMenuState } from "@/store/store";
import { memo, Fragment } from "react";
import {
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { resetClientSessionData } from "@/store/logInSlice";
import { fetchApi } from "@/lib/fetchApi";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import useLogOutOnError from "@/hooks/useLogOutOnError";
import LeaveGameDialogue from "../_main-menu/LeaveGameDialogue";
type MainMenuStateRelation = Record<MainMenuStates, MainMenuStates | null>;
const mainMenuStateRelations: MainMenuStateRelation = {
  Home: null,
  "Sign In to Create": "Home",
  "Sign In to Join": "Enter Join Code",
  "Create Game": "Sign In to Create",
  "Enter Join Code": "Home",
  "Join Game": "Sign In to Join",
  Rejoining: null,
} as const;

const NavHistory = memo(() => {
  const mainMenu = useSelector((state: RootState) => state.mainMenu);
  const { playerPeers } = useUnityReactContext();
  const { logOutOnError } = useLogOutOnError();
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const previousItems: Partial<Record<MainMenuStates, React.ReactNode>> = {};
  const dispatch = useDispatch();

  const handleLeaveGame = async (state: MainMenuStates) => {
    try {
      dispatch(resetClientSessionData());
      await fetchApi("/api/leave-game");
      Object.keys(playerPeers.current).forEach((key) => {
        playerPeers.current[key].destroy(new Error(`disconnected from ${key}`));
      });
      dispatch(
        mainMenuState.updateState({
          state,
          slideFrom: "left",
        }),
      );
    } catch (error) {
      logOutOnError(error, {
        state: "Home",
        slideFrom: "left",
      });
    }
  };

  const handleNavigate = (state: MainMenuStates) => {
    dispatch(
      mainMenuState.updateState({
        state,
        slideFrom: "left",
      }),
    );
  };

  const createBreadCrumb = (previousState: MainMenuStates | null) => {
    if (!previousState) return;
    previousItems[previousState] = (
      <>
        <BreadcrumbItem className="hidden md:block">
          <LeaveGameDialogue
            onLeave={() => handleLeaveGame(previousState)}
            triggerDialogue={!!gameId}
          >
            <Button
              variant="ghost"
              className="px-2 py-2"
              onClick={() => {
                if (!!gameId) return;
                handleNavigate(previousState);
              }}
            >
              {previousState}
            </Button>
          </LeaveGameDialogue>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
      </>
    );
    createBreadCrumb(mainMenuStateRelations[previousState]);
  };
  createBreadCrumb(mainMenuStateRelations[mainMenu.state]);

  return (
    <BreadcrumbList>
      {Object.values(previousItems)
        .reverse()
        .map((e, i) => {
          return <Fragment key={i}>{e}</Fragment>;
        })}
      <BreadcrumbItem>
        <BreadcrumbPage className="px-2 py-2">{mainMenu.state}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
});

NavHistory.displayName = "NavHistory";

export default NavHistory;
