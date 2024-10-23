import { useSelector } from "react-redux";
import usePanelUI from "@/hooks/usePanelUI";
import { RootState } from "@/store/store";
import useSessionRejoin from "./useSessionRejoin";

export default function MainMenuPanel() {
  const mainMenuUI = useSelector((state: RootState) => state.mainMenu);
  const { handlePanelUI } = usePanelUI();
  useSessionRejoin();

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