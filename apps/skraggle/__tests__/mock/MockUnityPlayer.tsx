"use client";

import { useUnityContext } from "react-unity-webgl";
import { UnityReactContext } from "@/app/UnityPlayer";
import { UnityContextHook } from "react-unity-webgl/distribution/types/unity-context-hook";
import { createMock } from 'ts-auto-mock';

export default function MockUnityPlayer({
  children,
}: {
  children: React.ReactNode;
}) {

  const mockUnityContext:UnityContextHook = createMock<UnityContextHook>();
  
  return (
    <UnityReactContext.Provider value={mockUnityContext}>
      {children}
    </UnityReactContext.Provider>
  );
}