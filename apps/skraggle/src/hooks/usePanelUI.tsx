import CreateGame from "@/app/_main-menu/_create-game/CreateGame";
import submitGuestNameCreateGame from "@/app/_main-menu/_create-game/submitGuestNameCreateGame";
import JoinGame from "@/app/_main-menu/_join-game/_join-game/JoinGame";
import JoinCode from "@/app/_main-menu/_join-game/JoinCode";
import submitGuestName from "@/app/_main-menu/_join-game/submitGuestName";
import MainButtons from "@/app/_main-menu/MainButtons";
import SignIn from "@/app/_main-menu/SignIn";

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

type MainMenuParams = {
  component: React.ReactNode;
  width: string;
  height: string;
};

export default function usePanelUI() {
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

  return { handlePanelUI };
}
