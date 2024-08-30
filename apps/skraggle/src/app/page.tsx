"use client";
import { useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export default function Home() {
  const env = process.env.NODE_ENV;
  const buildDir = env === "development" ? "dev-build" : "game-files";
  const extension = env === "development" ? "" : ".br";

  const [enablePlayer, setEnablePlayer] = useState(false);

  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: `./${buildDir}/Build/${buildDir}.loader.js`,
    dataUrl: `./${buildDir}/Build/${buildDir}.data${extension}`,
    frameworkUrl: `./${buildDir}/Build/${buildDir}.framework.js${extension}`,
    codeUrl: `./${buildDir}/Build/${buildDir}.wasm${extension}`,
  });

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
        <>        
          <div className="absolute w-screen h-dvh items-center justify-center"
            style={{display: loadingProgression === 1 ? "none" : "flex"}}
          >
            <div className="w-[10rem] h-2 bg-gray-900">
              <div className="h-full bg-gray-500" style={{width: `${Math.round(loadingProgression * 100)}%`}}></div>
            </div>
          </div>
          <Unity unityProvider={unityProvider} className="w-screen h-dvh" />
        </>
      )}
    </main>
  );
}
