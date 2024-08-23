"use client"
import { Unity, useUnityContext } from "react-unity-webgl";

export default function Home() {
  const env = process.env.NODE_ENV
  const buildDir = env === "development" ? "dev-build" : "game-files"
  const extension = env === "development" ? "" : ".br"

  const { unityProvider } = useUnityContext({
    loaderUrl: `./${buildDir}/Build/${buildDir}.loader.js`,
    dataUrl: `./${buildDir}/Build/${buildDir}.data${extension}`,
    frameworkUrl: `./${buildDir}/Build/${buildDir}.framework.js${extension}`,
    codeUrl: `./${buildDir}/Build/${buildDir}.wasm${extension}`,
  });

  return <Unity unityProvider={unityProvider} className="w-screen h-screen" />;
}
