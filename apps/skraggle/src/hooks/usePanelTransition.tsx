import { mainMenuState } from "@/store/store";
import { useAnimate } from "framer-motion";
import { MainMenuState } from "./usePanelUI";
import { useToast } from "./use-toast";
import { useDispatch } from "react-redux";

export type AnimationCallback = (
  state: MainMenuState,
  error?: string,
  ...args: any[]
) => void;

export default function usePanelTransition<T extends any[] = []>(
  callback?: (...args: T) => void,
) {
  const [scope, animate] = useAnimate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const animationCallback: AnimationCallback = (
    state: MainMenuState,
    error?: string,
    ...args: T
  ) => {
    if (error) {
      console.error(error);
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
      }, 100);
    }

    if (!scope.current) return;

    animate(
      scope.current,
      { opacity: 0, x: state.slideFrom === "left" ? "30%" : "-30%" },
      {
        duration: 0.1,
        onComplete: () => {
          dispatch(mainMenuState.updateState(state));
          if (callback) {
            callback(...args);
          }
        },
      },
    );
  };

  return { scope, animationCallback };
}
