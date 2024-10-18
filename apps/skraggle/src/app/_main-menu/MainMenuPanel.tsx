import { useDispatch, useSelector } from "react-redux";
import usePanelUI from "@/hooks/usePanelUI";
import { useEffect } from "react";
import { SessionData } from "@/schemas/sessionSchema";
import { LogInType, setLogInSession } from "@/store/logInSlice";
import { mainMenuState, RootState } from "@/store/store";

export default function MainMenuPanel() {
  const mainMenuUI = useSelector((state: RootState) => state.mainMenu);
  const { handlePanelUI } = usePanelUI();
  const dispatch = useDispatch();

  useEffect(() => {
    const sessionCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('session_data='))
      ?.split('=')[1];

    if (!sessionCookie) return;

    (async () => {
      const data = await fetch("/api/rejoin")
      const res = await data.json()

      if (!res.data.gameId) return;

      const {gameId, playerId, playerName} = res.data;
      const sessionData: LogInType = {
        loading: false,
        gameId,
        playerId,
        playerName,
      };
  
      dispatch(setLogInSession(sessionData))

      if (res.isHost) {
        dispatch(mainMenuState.updateState({
          state: "Create Game",
          slideFrom: "right"
        }));
      } else {
        dispatch(mainMenuState.updateState({
          state: "Join Game",
          slideFrom: "right"
        }));
      }
      
    })()

  }, [])

  return (
    <div
      className="pointer-events-auto z-10 overflow-hidden rounded-lg bg-background bg-opacity-80 p-8 backdrop-blur-lg transition-all duration-200"
      style={{
        height: handlePanelUI(mainMenuUI).height,
        width: handlePanelUI(mainMenuUI).width,
      }}
    >
      {handlePanelUI(mainMenuUI).component}
    </div>
  );
}
