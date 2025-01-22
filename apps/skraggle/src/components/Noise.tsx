import { cn } from "@/lib/tailwindUtils";
import { forwardRef } from "react";

const Noise = forwardRef<SVGSVGElement, React.SVGAttributes<SVGSVGElement>>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "pointer-events-none absolute right-0 top-0 h-full w-full mix-blend-multiply",
          className,
        )}
        ref={ref}
        {...props}
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    );
  },
);

Noise.displayName = "Noise";
export default Noise;
