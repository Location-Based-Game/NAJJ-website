import { useState } from "react";
import { Button } from "@/components/ui/button";
import GuestNameInput, { GuestNameType } from "./GuestNameInput";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { MainMenuState, mainMenuState } from "@/store/store";

interface SignIn {
  back: MainMenuState;
  submitHandler: (values: GuestNameType) => Promise<void>;
  enableButtons: boolean;
}

export default function SignIn({ back, submitHandler, enableButtons }: SignIn) {
  const [nameInput, setNameInput] = useState<string>("");
  const dispatch = useDispatch();

  return (
    <>
      <Button
        disabled={!enableButtons}
        variant={"secondary"}
        className="h-12 w-full"
        onClick={() => {
          dispatch(mainMenuState.updateState(back));
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
          className="h-12 mt-4 w-full"
          type="submit"
        >
          {!enableButtons && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </GuestNameInput>
    </>
  );
}
