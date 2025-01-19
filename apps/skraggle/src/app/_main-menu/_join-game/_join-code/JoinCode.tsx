import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setJoinCode } from "@/store/joinCodeSlice";
import JoinCodeInput from "./JoinCodeInput";
import { mainMenuState } from "@/store/store";
import { useMenuButtons } from "../../InnerPanelWrapper";

export default function JoinCode() {
  const dispatch = useDispatch();
  const {enableButtons, setEnableButtons} = useMenuButtons()
  const [codeInput, setCodeInput] = useState<string>("");

  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_USE_PLACEHOLDER_CODE === "true"
    ) {
      setCodeInput(process.env.NEXT_PUBLIC_PLACEHOLDER_CODE);
      return;
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");
    if (code) setCodeInput(code);
  }, []);

  return (
    <>
      <Button
        disabled={!enableButtons}
        variant={"outline"}
        className="h-12 w-full"
        onClick={() => {
          dispatch(
            mainMenuState.updateState({ state: "Home", slideFrom: "left" }),
          );
          setEnableButtons(false);
        }}
      >
        Back
      </Button>
      <JoinCodeInput
        codeInput={codeInput}
        setCodeInput={setCodeInput}
        setEnableButtons={setEnableButtons}
        callback={() => {
          dispatch(setJoinCode(codeInput));
          dispatch(
            mainMenuState.updateState({
              state: "Sign In to Join",
              slideFrom: "right",
            }),
          );
        }}
      >
        <Button
          disabled={!enableButtons || codeInput.length !== 4}
          className="h-12 w-full"
          type="submit"
        >
          {!enableButtons && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </JoinCodeInput>
    </>
  );
}
