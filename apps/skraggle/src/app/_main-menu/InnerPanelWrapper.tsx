import { cn } from "@/lib/tailwindUtils";
import { RootState } from "@/store/store";
import { motion, MotionProps } from "framer-motion";
import React, { createContext, forwardRef, HTMLAttributes, useContext, useState } from "react";
import { useSelector } from "react-redux";
import styles from "@styles/panel.module.css"

type InnerPanelWrapper = HTMLAttributes<HTMLDivElement> &
  MotionProps & {
    translateX: string;
  };

const MenuButtonsContext = createContext<{
  enableButtons: boolean;
  setEnableButtons: React.Dispatch<React.SetStateAction<boolean>>
} | null>(null)

const InnerPanelWrapper = forwardRef<HTMLDivElement, InnerPanelWrapper>(
  ({ translateX, ...props }, ref) => {
    const { slideFrom } = useSelector((state: RootState) => state.mainMenu);
    const [enableButtons, setEnableButtons] = useState(false);

    return (
      <motion.div
        ref={ref}
        initial={{
          opacity: 0,
          x: slideFrom === "left" ? `-${translateX}` : translateX,
          zIndex: 1,
        }}
        animate={{ opacity: 1, x: 0 }}
        exit={{
          opacity: 0,
          x: slideFrom === "left" ? translateX : `-${translateX}`,
          scale: 0.5,
          zIndex: -1,
        }}
        transition={{
          x: { duration: 0.3, ease: "circOut" },
          opacity: { duration: 0.2 }
        }}
        onAnimationComplete={() => setEnableButtons(true)}
        className={cn("flex w-full flex-col items-center relative justify-center gap-4", styles.woodBorder)}
        {...props}
      >
        <div className={styles.woodBackground}></div>
        <MenuButtonsContext.Provider value={{enableButtons, setEnableButtons}}>
          {props.children}
        </MenuButtonsContext.Provider>
      </motion.div>
    );
  },
);

export function useMenuButtons() {
  const context = useContext(MenuButtonsContext);
  if (!context) {
    throw new Error(
      "useMenuButtons must be used within a useMenuButtonsProvider",
    );
  }
  return context;
}

InnerPanelWrapper.displayName = "InnerPanelWrapper";

export default InnerPanelWrapper;
