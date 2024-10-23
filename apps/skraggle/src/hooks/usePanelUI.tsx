import CreateGame from "@/app/_main-menu/_create-game/CreateGame";
import CreateLogIn from "@/app/_main-menu/_create-game/CreateLogIn";
import JoinCode from "@/app/_main-menu/_join-game/_join-code/JoinCode";
import JoinGame from "@/app/_main-menu/_join-game/JoinGame";
import JoinLogIn from "@/app/_main-menu/_join-game/JoinLogIn";
import MainButtons from "@/app/_main-menu/MainButtons";
import Rejoining from "@/app/_main-menu/Rejoining";

export type MainMenuState = {
  state:
    | "Home"
    | "Sign In to Create"
    | "Sign In to Join"
    | "Create Game"
    | "Enter Join Code"
    | "Join Game"
    | "Rejoining"
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
        params.component = <CreateLogIn />;
        params.height = "20rem";
        break;
      case "Sign In to Join":
        params.component = <JoinLogIn />;
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
      case "Rejoining":
        params.component = <Rejoining />;
        params.height = "26rem";
        break;
    }

    return params;
  };

  return { handlePanelUI };
}
