import InnerPanelWrapper from "@/components/InnerPanelWrapper";
import usePanelTransition from "@/hooks/usePanelTransition";
import { mainMenuState, RootState } from "@/state/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainMenuState } from "../MainMenuPanel";
import { setGuestName } from "@/state/GuestNameSlice";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { get, ref, getDatabase, child, push, set } from "firebase/database";
import { rtdb } from "@/app/firebaseConfig";

const FormSchema = z.object({
  guestName: z.string().min(1),
});

export default function SignInJoin() {
  const dispatch = useDispatch();
  const guestName = useSelector((state: RootState) => state.guestName);

  const [enableButtons, setEnableButtons] = useState(true);

  const { scope, handleAnimation } = usePanelTransition(
    (state: MainMenuState) => {
      dispatch(mainMenuState.updateState(state));
    },
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      guestName: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    setEnableButtons(false);
    const dbRef = ref(getDatabase());
    
    const snapshot = await get(child(dbRef, `activeGames/jr2p`));
    if (snapshot.exists()) {
      //add player to db
      const playersRef = ref(rtdb, `activeGames/jr2p/players`);

      if (Object.values(snapshot.val().players).length >= 8) {
        handleAnimation("main");
        return;
      }

      const newPlayerRef = push(playersRef);
      dispatch(setGuestName(values.guestName));
      await set(newPlayerRef, values.guestName);

      handleAnimation("join game");
      return;
    } else {
      handleAnimation("main");
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
          handleAnimation("enter join code");
          setEnableButtons(false);
        }}
      >
        Back
      </Button>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-4 flex w-full grow flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="guestName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-center">
                  Enter as Guest
                </FormLabel>
                <Input
                  placeholder="name"
                  maxLength={20}
                  {...field}
                  className="text-center"
                />
              </FormItem>
            )}
          ></FormField>
          <Button
            disabled={!enableButtons || form.getValues().guestName.length < 1}
            className="h-12 w-full"
            type="submit"
          >
            Continue
          </Button>
        </form>
      </Form>
    </InnerPanelWrapper>
  );
}
