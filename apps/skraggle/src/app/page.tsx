"use client"
import { Unity, useUnityContext } from "react-unity-webgl";

export default function Home() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "./game-files/Build/game-files.loader.js",
    dataUrl: "./game-files/Build/game-files.data.br",
    frameworkUrl: "./game-files/Build/game-files.framework.js.br",
    codeUrl: "./game-files/Build/game-files.wasm.br",
  });

  return <Unity unityProvider={unityProvider} />;
}
