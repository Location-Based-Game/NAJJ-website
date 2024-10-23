import { useDispatch } from "react-redux";
import { useToast } from "./use-toast";
import type { MainMenuState } from "./usePanelUI";
import { mainMenuState } from "@/store/store";
import { resetClientSessionData } from "@/store/logInSlice";

const defaultState: MainMenuState = {
  state: "Home",
  slideFrom: "left",
};

export default function useLogOutOnError() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const logOutOnError = (
    error: unknown,
    state: MainMenuState = defaultState,
  ) => {
    console.error(error);
    setTimeout(() => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `${error}`,
      });
    }, 100);

    dispatch(resetClientSessionData());
    dispatch(mainMenuState.updateState(state));
  };

  return { logOutOnError };
}
