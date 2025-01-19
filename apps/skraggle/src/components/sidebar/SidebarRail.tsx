import { forwardRef } from "react";
import { useSidebar } from "./sidebar";
import { cn } from "@/lib/tailwindUtils";
import styles from "./sidebar.module.css";

const SidebarRail = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 cursor-w-resize transition-all ease-linear sm:flex",
        styles.rail,
        className,
      )}
      {...props}
    />
  );
});
SidebarRail.displayName = "SidebarRail";

export default SidebarRail;
