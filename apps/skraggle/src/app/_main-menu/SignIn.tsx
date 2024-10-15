import type { AnimationCallback } from "@/hooks/usePanelTransition";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import GuestNameInput, { GuestNameType } from "./GuestNameInput";
import { Loader2 } from "lucide-react";
import { MainMenuState } from "@/hooks/usePanelUI";

interface SignIn {
  back: MainMenuState;
  submitHandler: (values: GuestNameType) => Promise<void>;
  animationCallback: AnimationCallback;
  enableButtons: boolean;
}

export default function SignIn({
  back,
  submitHandler,
  animationCallback,
  enableButtons
}: SignIn) {
  const [nameInput, setNameInput] = useState<string>("");

  return (
    <>
      <Button
        disabled={!enableButtons}
        variant={"outline"}
        className="h-12 w-full"
        onClick={() => {
          animationCallback(back);
        }}
      >
        Back
      </Button>
      <GuestNameInput
        handleSubmit={submitHandler}
        setNameInput={setNameInput}
        nameInput={nameInput}
      >
        <Button
          disabled={!enableButtons || nameInput.length < 1}
          className="h-12 w-full"
          type="submit"
        >
          {!enableButtons && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </GuestNameInput>
    </>
  );
}
