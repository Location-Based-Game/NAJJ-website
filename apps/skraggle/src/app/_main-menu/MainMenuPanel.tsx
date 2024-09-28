"use client";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import MainButtons from "./MainButtons";
import CreateGame from "./_create-game/CreateGame";
import SignInCreate from "./_create-game/SignInCreate";
import JoinCode from "./_join-game/JoinCode";
import SignIn from "./SignIn";
import JoinGame from "./_join-game/_join-game/JoinGame";
import submitGuestName from "./_join-game/submitGuestName";
import submitGuestNameCreateGame from "./_create-game/submitGuestNameCreateGame";

export type MainMenuState = {
  state:
    | "Home"
    | "Sign In to Create"
    | "Sign In to Join"
    | "Create Game"
    | "Enter Join Code"
    | "Join Game";
  slideFrom: "left" | "right";
};

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

    switch (state.state) {
      case "Home":
        params.component = <MainButtons />;
        break;
      case "Sign In to Create":
        params.component = (
          <SignIn
            back={{
              state: "Home",
              slideFrom: "left",
            }}
            submitHandler={submitGuestNameCreateGame}
          />
        );
        params.height = "20rem";
        break;
      case "Sign In to Join":
        params.component = (
          <SignIn
            back={{
              state: "Enter Join Code",
              slideFrom: "left",
            }}
            submitHandler={submitGuestName}
          />
        );
        params.height = "20rem";
        break;
      case "Enter Join Code":
        params.component = <JoinCode />;
        params.height = "26rem";
        break;
      case "Join Game":
        params.component = <JoinGame />;
        params.width = "34rem";
        break;
      case "Create Game":
        params.component = <CreateGame />;
        params.width = "40rem";
        break;
    }

    return params;
  };

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
