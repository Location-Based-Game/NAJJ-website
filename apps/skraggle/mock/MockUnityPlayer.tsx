"use client";

import { useUnityContext } from "react-unity-webgl";
import { UnityReactContext } from "@/app/_unity-player/UnityContext";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";

export default function MockUnityPlayer({
  children,
}: {
  children: React.ReactNode;
}) {
  const env = process.env.NODE_ENV;
  const buildDir = env === "development" ? "dev-build" : "WebGL/WebGL";
  const name = env === "development" ? "dev-build" : "WebGL";
  const extension = env === "development" ? "" : ".br";

  const mockUnityContext = useUnityContext({
    loaderUrl: `./${buildDir}/Build/${name}.loader.js`,
    dataUrl: `./${buildDir}/Build/${name}.data${extension}`,
    frameworkUrl: `./${buildDir}/Build/${name}.framework.js${extension}`,
    codeUrl: `./${buildDir}/Build/${name}.wasm${extension}`,
  });

  const { sendMessage, isLoaded, unityProvider } = mockUnityContext;

  const callUnityFunction = (
    functionName: string,
    param?: ReactUnityEventParameter | object,
  ) => {
    if (!param) {
      sendMessage("Receiver", functionName);
      return;
    }

    if (typeof param === "object") {
      sendMessage("Receiver", functionName, JSON.stringify(param));
    } else {
      sendMessage("Receiver", functionName, param);
    }
  };

  return (
    <UnityReactContext.Provider value={{...mockUnityContext, splashScreenComplete: false, callUnityFunction }}>
      {children}
    </UnityReactContext.Provider>
  );
}