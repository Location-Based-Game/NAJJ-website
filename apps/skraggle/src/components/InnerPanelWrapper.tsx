import { RootState } from "@/state/store";
import { motion, MotionProps } from "framer-motion";
import { forwardRef, HTMLAttributes } from "react";
import { useSelector } from "react-redux";

type InnerPanelWrapper = HTMLAttributes<HTMLDivElement> & MotionProps;

const InnerPanelWrapper = forwardRef<HTMLDivElement, InnerPanelWrapper>(
  ({ ...props }, ref) => {
    const mainMenuState = useSelector((state: RootState) => state.mainMenu);
    return (
      <motion.div
        ref={ref}
        initial={{
          opacity: 0,
          x: mainMenuState.slideFrom === "left" ? "-30%" : "30%",
        }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.2 }}
        className="flex h-full w-full flex-col items-center justify-center gap-4"
        {...props}
      >
        {props.children}
      </motion.div>
    );
  },
);

export default InnerPanelWrapper;
