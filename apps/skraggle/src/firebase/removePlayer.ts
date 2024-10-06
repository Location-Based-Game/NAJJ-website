import { rtdb } from "@/app/firebaseConfig";
import { child, ref, remove } from "firebase/database";

export default async function removePlayer(code: string | null, playerKey: string) {
    if (!code) {
        throw new Error("invalid code!")
    }
    const playersRef = ref(rtdb, `activeGames/${code}/players`);
    await remove(child(playersRef, playerKey));
}