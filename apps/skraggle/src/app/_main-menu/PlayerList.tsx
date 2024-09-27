import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { rtdb } from "../firebaseConfig";

export default function PlayerList() {
  const [playerList, setPlayerList] = useState<string[]>([]);

  useEffect(() => {
    const playersRef = ref(rtdb, `activeGames/jr2p/players`);
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      setPlayerList(data);
    });
  }, []);

  return (
    <div className="grow">
      <div className="mb-4 border-b-[1px] border-gray-600 pb-2 text-2xl font-bold text-gray-400">
        Players
      </div>
      {Object.values(playerList).map((e, i) => {
        return <div key={i}>{e}</div>;
      })}
    </div>
  );
}
