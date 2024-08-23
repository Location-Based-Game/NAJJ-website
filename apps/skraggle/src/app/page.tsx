"use client"
import { Unity, useUnityContext } from "react-unity-webgl";

export default function Home() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "./game-files/UnityBuild/game-files.loader.js",
    dataUrl: "./game-files/UnityBuild/game-files.data.gz",
    frameworkUrl: "./game-files/UnityBuild/game-files.framework.js.gz",
    codeUrl: "./game-files/UnityBuild/game-files.wasm.gz",
  });

  return <Unity unityProvider={unityProvider} />;
}
