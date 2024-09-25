import { onValue, ref } from "firebase/database"
import { useEffect, useState } from "react"
import { rtdb } from "../firebaseConfig"
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

export default function PlayerList() {
    const joinCode = useSelector((state: RootState) => state.joinCode);
    const [playerList, setPlayerList] = useState<string[]>([])

    useEffect(() => {
        const playersRef = ref(rtdb, `activeGames/jr2p/players`)
        onValue(playersRef, (snapshot) => {
            const data = snapshot.val()
            setPlayerList(data)
        })
    }, [])

    return (
        <div className="grow">
            <div className="font-bold text-2xl text-gray-400 border-b-[1px] border-gray-600 mb-4 pb-2">Players</div>
            {playerList.map((e, i) => {
                return (
                    <div key={i}>{e}</div>
                )
            })}
        </div>
    )
}