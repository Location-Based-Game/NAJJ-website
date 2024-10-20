import { Button } from "@/components/ui/button";
import { useUnityReactContext } from "../../_unity-player/UnityPlayer";
import { ref } from "firebase/database";
import { rtdb } from "@/app/firebaseConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
export default function EndTurnButton() {
  const { sendMessage } = useUnityReactContext();
const currentJoinCode = useSelector((state:RootState) => state.joinCode)

  const handleEndTurn = () => {
    // const gameRef = ref(rtdb, `activeGames/${}`)
  };

  return (
    <Button
      onClick={() => {
        handleEndTurn();
      }}
      className="absolute top-4"
    >
      End Turn
    </Button>
  );
}
