import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import { Button } from "@/components/ui/button";
import usePanelTransition from "@/hooks/usePanelTransition";
import { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { child, get, getDatabase, ref } from "firebase/database";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react"
import { useDispatch } from "react-redux";
import { setJoinCode } from "@/state/JoinCodeSlice";

const FormSchema = z.object({
  code: z.string().min(4),
});

export default function JoinCode() {
  const dispatch = useDispatch();
  const [enableButtons, setEnableButtons] = useState(true);
  const { scope, animationCallback } = usePanelTransition();

  const [codeInput, setCodeInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("&nbsp;");

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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: ""
    }
  });

  const handleSubmit = async () => {
    setEnableButtons(false);
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `activeGames/${codeInput}`));
    if (snapshot.exists()) {
      dispatch(setJoinCode(codeInput))
      animationCallback({state: "Sign In to Join", slideFrom: "right"});
      return;
    } else {
      setErrorMessage("Invalid Code!");
    }
    setEnableButtons(true);
  };

  return (
    <InnerPanelWrapper ref={scope}>
      <Button
        disabled={!enableButtons}
        variant={"outline"}
        className="h-12 w-full"
        onClick={() => {
          animationCallback({state: "Home", slideFrom: "left"});
          setEnableButtons(false);
        }}
      >
        Back
      </Button>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex w-full grow flex-col items-center"
        >
          <div className="grow flex flex-col gap-4 items-center justify-center">
            <FormField
              control={form.control}
              name="code"
              render={() => (
                <FormItem>
                  <FormLabel className="block text-center">
                    Enter Join Code
                  </FormLabel>
                  <InputOTP
                    maxLength={4}
                    value={codeInput}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    spellCheck="false"
                    onChange={(value) => {
                      setErrorMessage("&nbsp;");
                      setCodeInput(value);
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormItem>
              )}
            />
            <div
              dangerouslySetInnerHTML={{ __html: errorMessage }}
              className="text-destructive"
            />
          </div>

          <Button
            disabled={!enableButtons || codeInput.length !== 4}
            className="h-12 w-full"
            type="submit"
            onClick={() => {
              handleSubmit();
            }}
          >
            {!enableButtons && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </form>
      </Form>
    </InnerPanelWrapper>
  );
}
