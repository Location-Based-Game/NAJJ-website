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
  
  return (
    <UnityReactContext.Provider value={mockUnityContext}>
      {children}
    </UnityReactContext.Provider>
  );
}