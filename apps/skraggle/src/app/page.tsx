import MainMenuPanel from "./_main-menu/MainMenuPanel";
import UnityPlayer from "./UnityPlayer";

export default function Home() {
  return (
    <main className="flex bg-secondary h-screen w-screen items-center justify-center">
      <UnityPlayer>
        <MainMenuPanel />
      </UnityPlayer>
    </main>
  );
}
