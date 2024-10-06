import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { Button } from "@/components/ui/button";
import usePanelTransition from "@/hooks/usePanelTransition";
import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setJoinCode } from "@/state/JoinCodeSlice";
import JoinCodeInput from "./JoinCodeInput";

export default function JoinCode() {
  const dispatch = useDispatch();
  const [enableButtons, setEnableButtons] = useState(true);
  const { scope, animationCallback } = usePanelTransition();
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
    <InnerPanelWrapper ref={scope}>
      <Button
        disabled={!enableButtons}
        variant={"outline"}
        className="h-12 w-full"
        onClick={() => {
          animationCallback({ state: "Home", slideFrom: "left" });
          setEnableButtons(false);
        }}
      >
        Back
      </Button>
      <JoinCodeInput
        codeInput={codeInput}
        setCodeInput={setCodeInput}
        setEnableButtons={(setEnableButtons)}
        callback={() => {
          dispatch(setJoinCode(codeInput));
          animationCallback({ state: "Sign In to Join", slideFrom: "right" });
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
    </InnerPanelWrapper>
  );
}
