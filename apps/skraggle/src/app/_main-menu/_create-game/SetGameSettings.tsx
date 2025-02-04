import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useMenuButtons } from "../InnerPanelWrapper";
import { mainMenuState, RootState } from "@/store/store";
import { useForm } from "react-hook-form";
import { GameSettings, gameSettingsSchema } from "@schemas/gameSettingsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { setGameSettings } from "@/store/gameSettingsSlice";

export default function SetGameSettings() {
  const dispatch = useDispatch();
  const { enableButtons, setEnableButtons } = useMenuButtons();
  const gameSettings = useSelector((state: RootState) => state.gameSettings);
  const form = useForm<GameSettings>({
    resolver: zodResolver(gameSettingsSchema),
    defaultValues: gameSettings,
  });

  const handleSubmit = async (values: GameSettings) => {
    setEnableButtons(false);
    dispatch(setGameSettings(values));
    dispatch(
      mainMenuState.updateState({
        state: "Sign In to Create",
        slideFrom: "right",
      }),
    );
  };

  return (
    <>
      <Button
        disabled={!enableButtons}
        variant={"secondary"}
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex w-full grow flex-col items-center"
        >
          <FormField
            control={form.control}
            name="realWordsOnly"
            render={({ field }) => (
              <FormItem className="flex flex-row-reverse items-center justify-center gap-3 space-y-0 pb-10 pt-6">
                <FormLabel
                  className="block text-center"
                  htmlFor="real-words-only"
                >
                  Real Words Only
                </FormLabel>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="real-words-only"
                />
              </FormItem>
            )}
          />
          <Button
            disabled={!enableButtons}
            className="h-12 w-full"
            type="submit"
          >
            Continue
          </Button>
        </form>
      </Form>
    </>
  );
}
