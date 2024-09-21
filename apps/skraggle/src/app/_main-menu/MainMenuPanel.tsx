"use client";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import MainButtons from "./MainButtons";
import CreateGame from "./CreateGame";

export type MainMenuState = "main" | "create game" | "join game";

interface MainMenuPanel {
  setPlayGame: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MainMenuPanel() {
  const mainMenuUI = useSelector((state: RootState) => state.mainMenu);

  const handleDimensions = (
    value: number | undefined,
    defaultValue: number,
  ) => {
    return value === undefined ? `${defaultValue}rem` : `${value}rem`;
  };

  const handlePanelUI = (state: MainMenuState) => {
    switch (state) {
      case "main":
        return <MainButtons />;
      case "create game":
        return <CreateGame />;
    }
  };

  return (
    <div
      className="pointer-events-auto z-10 rounded-lg bg-gray-900 bg-opacity-80 p-8 backdrop-blur-lg transition-all duration-200"
      style={{
        height: handleDimensions(mainMenuUI.panelHeight, 34),
        width: handleDimensions(mainMenuUI.panelWidth, 24),
      }}
    >
      {handlePanelUI(mainMenuUI.state)}
    </div>
  );
}
