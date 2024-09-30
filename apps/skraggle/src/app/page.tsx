import GameUI from "./_gameplay-ui/GameUI";
import UnityPlayer from "./UnityPlayer";

export default function Home() {
  return (
    <main className="flex bg-secondary h-screen w-screen items-center justify-center">
      <UnityPlayer>
        <GameUI />
      </UnityPlayer>
    </main>
  );
}
