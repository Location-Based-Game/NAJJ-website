import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import usePanelUI from "@/hooks/usePanelUI";
import { useEffect } from "react";

export default function MainMenuPanel() {
  const mainMenuUI = useSelector((state: RootState) => state.mainMenu);
  const { handlePanelUI } = usePanelUI();

  useEffect(() => {
    console.log(mainMenuUI)
  }, [mainMenuUI])

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
