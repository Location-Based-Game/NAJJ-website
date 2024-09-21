import { motion, MotionProps } from "framer-motion";
import { forwardRef, HTMLAttributes } from "react";

type InnerPanelWrapper = HTMLAttributes<HTMLDivElement> & MotionProps;

const InnerPanelWrapper = forwardRef<HTMLDivElement, InnerPanelWrapper>(
  ({ ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
