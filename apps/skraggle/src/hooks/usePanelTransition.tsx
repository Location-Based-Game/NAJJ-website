import { RootState } from "@/state/store";
import { useAnimate } from "framer-motion";
import { useSelector } from "react-redux";

export default function usePanelTransition<T extends any[]>(
  callback: (...args: T) => void,
) {
  const [scope, animate] = useAnimate();
  const mainMenuState = useSelector((state: RootState) => state.mainMenu);

  const animationCallback = (direction: "left" | "right", ...args: T) => {
    animate(
      scope.current,
      { opacity: 0, x: direction === "left" ? "30%" : "-30%" },
      {
        duration: 0.1,
        onComplete: () => {
          callback(...args);
        },
      },
    );
  };

  return { scope, animationCallback };
}
