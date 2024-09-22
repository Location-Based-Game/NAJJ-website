"use client";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import MainButtons from "./MainButtons";
import CreateGame from "./CreateGame";
import TypeNameOrSignIn from "./TypeNameOrSignIn";

export type MainMenuState =
  | "main"
  | "type name or sign in"
  | "create game"
  | "join game";

interface MainMenuPanel {
  setPlayGame: React.Dispatch<React.SetStateAction<boolean>>;
}

type MainMenuParams = {
  component: React.ReactNode;
  width: string;
  height: string;
};

export default function MainMenuPanel() {
  const mainMenuUI = useSelector((state: RootState) => state.mainMenu);

  const handlePanelUI = (state: MainMenuState) => {
    const params: MainMenuParams = {
      component: <></>,
      height: "34rem",
      width: "24rem",
    };

    switch (state) {
      case "main":
        params.component = <MainButtons />;
        break;
      case "type name or sign in":
        params.component = <TypeNameOrSignIn />;
        params.height = "20rem"
        break;
      case "create game":
        params.component = <CreateGame />;
        params.width = "40rem";
        break;
    }

    return params;
  };

  return (
    <>
      <div
        className="pointer-events-auto z-10 rounded-lg bg-gray-900 bg-opacity-80 p-8 backdrop-blur-lg transition-all duration-200"
        style={{
          height: handlePanelUI(mainMenuUI.state).height,
          width: handlePanelUI(mainMenuUI.state).width,
        }}
      >
        {handlePanelUI(mainMenuUI.state).component}
      </div>
    </>
  );
}
