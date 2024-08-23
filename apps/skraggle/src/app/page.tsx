"use client"
import { Unity, useUnityContext } from "react-unity-webgl";

export default function Home() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "./game-files/UnityBuild/game-files.loader.js",
    dataUrl: "./game-files/UnityBuild/game-files.data.br",
    frameworkUrl: "./game-files/UnityBuild/game-files.framework.js.br",
    codeUrl: "./game-files/UnityBuild/game-files.wasm.br",
  });

  return <Unity unityProvider={unityProvider} />;
}
