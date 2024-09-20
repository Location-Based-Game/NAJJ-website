"use client";
import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import MainMenuPanel from "./_main-menu/MainMenuPanel";

export default function Home() {
  const env = process.env.NODE_ENV;
  const buildDir = env === "development" ? "dev-build" : "WebGL/WebGL";
  const name = env === "development" ? "dev-build" : "WebGL";
  const extension = env === "development" ? "" : ".br";

  const [playGame, setPlayGame] = useState(false);
  const [splashScreenComplete, setSplashScreenComplete] = useState(false);

  const { unityProvider, loadingProgression, isLoaded, sendMessage } =
    useUnityContext({
      loaderUrl: `./${buildDir}/Build/${name}.loader.js`,
      dataUrl: `./${buildDir}/Build/${name}.data${extension}`,
      frameworkUrl: `./${buildDir}/Build/${name}.framework.js${extension}`,
      codeUrl: `./${buildDir}/Build/${name}.wasm${extension}`,
    });

  useEffect(() => {
    if (isLoaded) {
      //waits for Unity splash screen to finish
      setTimeout(() => {
        setSplashScreenComplete(true);
      }, 2500);
    }

    if (splashScreenComplete && playGame) {
      sendMessage("Receiver", "StartGame");
    }
  }, [isLoaded, playGame, splashScreenComplete]);

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="pointer-events-none absolute flex h-dvh w-screen items-center justify-center">
        {playGame ? (
          <div
            className="h-2 w-[10rem] bg-gray-900"
            style={{ display: isLoaded ? "none" : "flex" }}
          >
            <div
              className="h-full bg-gray-500"
              style={{
                width: `${Math.round(loadingProgression * 100)}%`,
              }}
            ></div>
          </div>
        ) : (
          <MainMenuPanel />
        )}
      </div>
      <Unity
        unityProvider={unityProvider}
        className={`h-dvh w-screen transition-opacity duration-700 ${splashScreenComplete ? "opacity-100" : "opacity-0"}`}
      />
    </main>
  );
}
