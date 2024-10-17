import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import usePanelUI from "@/hooks/usePanelUI";
import { useEffect } from "react";
import { SessionData } from "@/schemas/sessionSchema";

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
    const sessionData = JSON.parse(decodeURIComponent(sessionCookie)) as SessionData;


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
