import PlayerData from "@/components/GetPlayers";
import GameUI from "./_gameplay-ui/GameUI";
import UnityPlayer from "./_unity-player/UnityContext";

export default function Home() {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-secondary">
      <PlayerData>
        <UnityPlayer>
          <GameUI />
        </UnityPlayer>
      </PlayerData>
    </main>
  );
}
