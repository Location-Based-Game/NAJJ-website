"use client";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import MainButtons from "./MainButtons";
import CreateGame from "./_create-game/CreateGame";
import SignInCreate from "./_create-game/SignInCreate";
import JoinCode from "./_join-game/JoinCode";
import SignInJoin from "./_join-game/_sign-in-join/SignInJoin";
import JoinGame from "./_join-game/JoinGame";

export type MainMenuState =
  | "main"
  | "sign in create"
  | "sign in join"
  | "create game"
  | "enter join code"
  | "join game"

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
      case "sign in create":
        params.component = <SignInCreate />;
        params.height = "20rem"
        break;
      case "sign in join":
        params.component = <SignInJoin />;
        params.height = "20rem"
        break;
      case "enter join code":
        params.component = <JoinCode />
        params.height = "26rem"
        break;
      case "join game":
        params.component = <JoinGame />
        params.width = "34rem"

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
        className="pointer-events-auto z-10 rounded-lg bg-background bg-opacity-80 p-8 backdrop-blur-lg transition-all duration-200"
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
