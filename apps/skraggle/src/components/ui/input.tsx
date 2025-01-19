import * as React from "react";

import { cn } from "@/lib/tailwindUtils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "text-md placeholder:text-md flex h-9 w-full rounded-md bg-black/30 px-3 py-1 text-sm text-white shadow-sm transition-colors placeholder:text-white/70 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
