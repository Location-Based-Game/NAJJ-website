import { ref, get, getDatabase, child } from "firebase/database";
import { GameRoom } from "./createRoom";

export default async function getRoom(code: string | null): Promise<GameRoom> {
  if (!code) {
    throw new Error("invalid code!");
  }

  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `activeGames/${code}`));

  if (!snapshot.exists()) {
    throw new Error("Game not available!");
  } else {
    return snapshot.val() as GameRoom;
  }
}
