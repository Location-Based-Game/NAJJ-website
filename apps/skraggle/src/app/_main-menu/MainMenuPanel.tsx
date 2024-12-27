import { useSelector } from "react-redux";
import { MainMenuStates, RootState } from "@/store/store";
import useSessionRejoin from "./_home/useSessionRejoin";
import { AnimatePresence } from "framer-motion";
import CreateGame from "./_create-game/CreateGame";
import CreateLogIn from "./_create-game/CreateLogIn";
import MainButtons from "./_home/MainButtons";
import Rejoining from "./_home/Rejoining";
import JoinCode from "./_join-game/_join-code/JoinCode";
import JoinGame from "./_join-game/JoinGame";
import JoinLogIn from "./_join-game/JoinLogIn";
import { useEffect, useState } from "react";
import InnerPanelWrapper from "./InnerPanelWrapper";

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
        setTargetWidth("40rem");
        return <CreateGame />;
      case "Rejoining":
        return <Rejoining />;
    }
  };

  useEffect(() => {
    setCurrentUI(
      <InnerPanelWrapper key={state} translateX={"24rem"}>
        {getMenuComponent(state)}
      </InnerPanelWrapper>,
    );
  }, [state]);

  useSessionRejoin();

  return (
    <div
      className="pointer-events-auto relative z-10 flex h-full items-center justify-center"
      style={{ width: targetWidth }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {currentUI}
      </AnimatePresence>
    </div>
  );
}
