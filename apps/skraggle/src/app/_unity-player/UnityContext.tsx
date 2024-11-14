"use client";
import { useUnityContext } from "react-unity-webgl";
import { useState, useEffect, createContext, useContext } from "react";
import useUpdateGameState from "@/app/_unity-player/useUpdateGameState";
import { UnityContextHook } from "react-unity-webgl/distribution/types/unity-context-hook";
import useWebRTC, { PlayerPeers } from "./useWebRTC";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";

export type CallUnityFunctionType = (
  functionName: string,
  param?: ReactUnityEventParameter | object,
) => void;

type UnityData = UnityContextHook & {
  splashScreenComplete: boolean;
  playerPeers: React.MutableRefObject<PlayerPeers>;
  callUnityFunction: CallUnityFunctionType;
};

export const UnityReactContext = createContext<UnityData | null>(null);

export default function UnityContextProvider({
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

  const { sendMessage, isLoaded } = unityContext;
  const [splashScreenComplete, setSplashScreenComplete] = useState(false);

  const callUnityFunction = (
    functionName: string,
    param?: ReactUnityEventParameter | object,
  ) => {
    if (!splashScreenComplete) return;
    if (!param && param !== 0) {
      sendMessage("Receiver", functionName);
      return;
    }

    if (typeof param === "object") {
      sendMessage("Receiver", functionName, JSON.stringify(param));
    } else {
      sendMessage("Receiver", functionName, param);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    //waits for Unity splash screen to finish
    setTimeout(() => {
      setSplashScreenComplete(true);
    }, 2500);
  }, [isLoaded]);

  useUpdateGameState(unityContext);
  const { playerPeers } = useWebRTC(splashScreenComplete, callUnityFunction);

  return (
    <UnityReactContext.Provider
      value={{
        ...unityContext,
        splashScreenComplete,
        playerPeers,
        callUnityFunction,
      }}
    >
      {children}
    </UnityReactContext.Provider>
  );
}

export function useUnityReactContext() {
  const context = useContext(UnityReactContext);
  if (!context) {
    throw new Error(
      "useUnityContext must be used within a UnityReactContextProvider",
    );
  }
  return context;
}
