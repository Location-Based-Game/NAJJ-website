"use client";
import useSetGameState from "@/hooks/useSetGameState";
import { useUnityContext, Unity } from "react-unity-webgl";
import Loader from "./_gameplay-ui/Loader";
import { useState, useEffect, createContext, useContext } from "react";
import useUpdateGameState from "@/hooks/useUpdateGameState";
import { UnityContextHook } from "react-unity-webgl/distribution/types/unity-context-hook";

export const UnityReactContext = createContext<UnityContextHook | null>(null);

export default function UnityPlayer({
  children,
}: {
  children: React.ReactNode;
}) {
  const env = process.env.NODE_ENV;
  const buildDir = env === "development" ? "dev-build" : "WebGL/WebGL";
  const name = env === "development" ? "dev-build" : "WebGL";
  const extension = env === "development" ? "" : ".br";

  const unityContext = useUnityContext({
    loaderUrl: `./${buildDir}/Build/${name}.loader.js`,
    dataUrl: `./${buildDir}/Build/${name}.data${extension}`,
    frameworkUrl: `./${buildDir}/Build/${name}.framework.js${extension}`,
    codeUrl: `./${buildDir}/Build/${name}.wasm${extension}`,
  });

  const { sendMessage, isLoaded, unityProvider } = unityContext;

  const [splashScreenComplete, setSplashScreenComplete] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    //waits for Unity splash screen to finish
    setTimeout(() => {
      setSplashScreenComplete(true);
    }, 2500);
  }, [isLoaded]);

  useSetGameState(sendMessage, isLoaded);
  useUpdateGameState(unityContext);
  
  return (
    <UnityReactContext.Provider value={unityContext}>
      <Loader
        splashScreenComplete={splashScreenComplete}
      >
        {children}
      </Loader>
      <Unity
        unityProvider={unityProvider}
        className={`h-dvh w-screen transition-opacity duration-700 ${splashScreenComplete ? "opacity-100" : "opacity-0"}`}
      />
    </UnityReactContext.Provider>
  );
}

export function useUnityReactContext() {
  const context = useContext(UnityReactContext);
  if (!context) {
    throw new Error("useUnityContext must be used within a UnityReactContextProvider");
  }
  return context;
}