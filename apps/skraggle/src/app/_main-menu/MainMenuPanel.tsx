import { useSelector } from "react-redux";
import { MainMenuStates, RootState } from "@/store/store";
import { AnimatePresence } from "framer-motion";
import CreateGame from "./_create-game/CreateGame";
import CreateLogIn from "./_create-game/CreateLogIn";
import MainButtons from "./_home/MainButtons";
import Rejoining from "./_rejoin/Rejoining";
import JoinCode from "./_join-game/_join-code/JoinCode";
import JoinGame from "./_join-game/JoinGame";
import JoinLogIn from "./_join-game/JoinLogIn";
import { useEffect, useState } from "react";
import InnerPanelWrapper from "./InnerPanelWrapper";
import RejoinFailed from "./_rejoin/RejoinFailed";

export default function MainMenuPanel() {
  const { state } = useSelector((state: RootState) => state.mainMenu);
  const [currentUI, setCurrentUI] = useState(<></>);
  const [targetWidth, setTargetWidth] = useState("24rem");

  const getMenuComponent = (state: MainMenuStates) => {
    setTargetWidth("24rem");
    switch (state) {
      case "Home":
        return <MainButtons />;
      case "Sign In to Create":
        return <CreateLogIn />;
      case "Sign In to Join":
        return <JoinLogIn />;
      case "Enter Join Code":
        return <JoinCode />;
      case "Join Game":
        setTargetWidth("34rem");
        return <JoinGame />;
      case "Create Game":
        setTargetWidth("34rem");
        return <CreateGame />;
      case "Rejoining":
        return <Rejoining />;
      case "Rejoin Failed":
        setTargetWidth("30rem")
        return <RejoinFailed />
    }
  };

  useEffect(() => {
    setCurrentUI(
      <InnerPanelWrapper key={state} translateX={"24rem"}>
        {getMenuComponent(state)}
      </InnerPanelWrapper>,
    );
  }, [state]);

  return (
    <div
      className="pointer-events-auto relative z-10 flex h-full items-center justify-center"
      style={{ width: targetWidth }}
    >
      <img
        src="/Logo.png"
        alt="Skraggl.io Logo"
        className="absolute top-[4rem] h-auto min-w-[80vw] md:min-w-[700px]"
      />
      <AnimatePresence mode="popLayout" initial={false}>
        {currentUI}
      </AnimatePresence>
    </div>
  );
}
