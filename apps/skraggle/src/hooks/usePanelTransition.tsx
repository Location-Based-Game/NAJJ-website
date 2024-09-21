import { useAnimate } from "framer-motion";

export default function usePanelTransition(callback: () => void) {
  const [scope, animate] = useAnimate();

  const handleAnimation = () => {
    animate(
      scope.current,
      { opacity: 0 },
      {
        duration: 0.2,
        onComplete: () => {
          callback();
        },
      },
    );
  };

  return { scope, handleAnimation };
}
