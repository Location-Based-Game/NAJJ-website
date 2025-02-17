"use client";
import dynamic from "next/dynamic";
import { useUnityReactContext } from "./UnityContext";
import { cn } from "@/lib/tailwindUtils";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import cursors from "@styles/cursors.module.css";

const Unity = dynamic(
  () => import("react-unity-webgl").then((mod) => mod.Unity),
  { ssr: false },
);

export default function UnityCanvas() {
  const { isGameActive } = useSelector((state: RootState) => state.gameState);
  const {
    splashScreenComplete,
    unityProvider,
    addEventListener,
    removeEventListener,
  } = useUnityReactContext();

  const [viewPortCursor, setViewPortCursor] = useState(cursors.auto);
  const updateCursor = (cursorType: any) => {
    setViewPortCursor(cursors[cursorType]);
  };

  useEffect(() => {
    if (!splashScreenComplete) return;
    addEventListener("SetCursorType", updateCursor);

    return () => {
      removeEventListener("SetCursorType", updateCursor);
    };
  }, [addEventListener, removeEventListener, splashScreenComplete]);

  const handleClick = (event: MouseEvent) => {
    if (event.target instanceof HTMLCanvasElement) {
      // Triggers Radix's outside click handler to close dialogues, context menus, etc
      document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  };

  useEffect(() => {
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, []);

  return (
    <Unity
      unityProvider={unityProvider}
      className={cn(
        "h-full w-full transition-opacity duration-700",
        isGameActive ? "pointer-events-auto" : "pointer-events-none",
        splashScreenComplete ? "opacity-100" : "opacity-0",
        viewPortCursor,
      )}
    />
  );
}
