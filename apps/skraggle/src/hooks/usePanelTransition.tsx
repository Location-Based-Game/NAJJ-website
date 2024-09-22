import { useAnimate } from "framer-motion";

export default function usePanelTransition<T extends any[]>(
  callback: (...args: T) => void,
) {
  const [scope, animate] = useAnimate();

  const handleAnimation = (...args: T) => {
    animate(
      scope.current,
      { opacity: 0 },
      {
        duration: 0.2,
        onComplete: () => {
          callback(...args);
        },
      },
    );
  };

  return { scope, handleAnimation };
}
