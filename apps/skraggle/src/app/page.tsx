"use client";
import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export default function Home() {
  const env = process.env.NODE_ENV;
  const buildDir = env === "development" ? "dev-build" : "game-files";
  const extension = env === "development" ? "" : ".br";

  const [enablePlayer, setEnablePlayer] = useState(false);

  const { unityProvider, requestFullscreen, isLoaded } = useUnityContext({
    loaderUrl: `./${buildDir}/Build/${buildDir}.loader.js`,
    dataUrl: `./${buildDir}/Build/${buildDir}.data${extension}`,
    frameworkUrl: `./${buildDir}/Build/${buildDir}.framework.js${extension}`,
    codeUrl: `./${buildDir}/Build/${buildDir}.wasm${extension}`,
  });

  useEffect(() => {
    if (isLoaded) {
      requestFullscreen(true)
    }
  }, [isLoaded])

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      {!enablePlayer && (
        <button
          className="border rounded-md border-white py-2 px-4"
          onClick={() => {
            setEnablePlayer(true);
          }}
        >
          Play
        </button>
      )}
      {enablePlayer && (
        <Unity unityProvider={unityProvider} className="w-screen h-screen" />
      )}
    </main>
  );
}
