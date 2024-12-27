import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { mainMenuState } from "@/store/store";
import { useMenuButtons } from "../InnerPanelWrapper";

export default function MainButtons() {
  const {enableButtons, setEnableButtons} = useMenuButtons()
  const dispatch = useDispatch();

  return (
    <>
      <Button
        disabled={!enableButtons}
        variant={"outline"}
        className="h-12 w-full"
        onClick={() => {
          setEnableButtons(false);
          dispatch(
            mainMenuState.updateState({
              state: "Enter Join Code",
              slideFrom: "right",
            }),
          );
        }}
      >
        Join Game
      </Button>
      <Button
        disabled={!enableButtons}
        className="h-12 w-full"
        onClick={() => {
          setEnableButtons(false);
          dispatch(
            mainMenuState.updateState({
              state: "Sign In to Create",
              slideFrom: "right",
            }),
          );
        }}
      >
        Create Game
      </Button>
    </>
  );
}
