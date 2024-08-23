"use client"
import { Unity, useUnityContext } from "react-unity-webgl";

export default function Home() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "./game-files/Build/game-files.loader.js",
    dataUrl: "./game-files/Build/game-files.data.gz",
    frameworkUrl: "./game-files/Build/game-files.framework.js.gz",
    codeUrl: "./game-files/Build/game-files.wasm.gz",
  });

  return <Unity unityProvider={unityProvider} />;
}
