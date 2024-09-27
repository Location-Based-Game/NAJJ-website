import { MainMenuState } from "@/app/_main-menu/MainMenuPanel";
import { mainMenuState } from "@/state/store";
import { useAnimate } from "framer-motion";
import { useDispatch } from "react-redux";

export default function usePanelTransition<T extends any[] = []>(
  callback?: (...args: T) => void,
) {
  const [scope, animate] = useAnimate();
  const dispatch = useDispatch()

  const animationCallback = (state:MainMenuState, ...args: T) => {
    animate(
      scope.current,
      { opacity: 0, x: state.slideFrom === "left" ? "30%" : "-30%" },
      {
        duration: 0.1,
        onComplete: () => {
          dispatch(mainMenuState.updateState(state))
          if (callback) {
            callback(...args);
          }
        },
      },
    );
  };

  return { scope, animationCallback };
}
