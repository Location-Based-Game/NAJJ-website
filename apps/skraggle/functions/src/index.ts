/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export { addPlayer } from "./endpoints/addPlayer";
export { changePlayerColor } from "./endpoints/changePlayerColor";
export { createRoom } from "./endpoints/createRoom";
export { endTurn } from "./endpoints/endTurn";
export { leaveGame } from "./endpoints/leaveGame";
export { logIn } from "./endpoints/logIn";
export { rejoin } from "./endpoints/rejoin";
export { sendPeerSignal } from "./endpoints/sendPeerSignal";
export { setInventory } from "./endpoints/setInventory";
export { startGame } from "./endpoints/startGame";
export { submitWord } from "./endpoints/submitWord";

export { onPlayerDisconnect } from "./events/onPlayerDisconnect";

export { deleteRoomsEveryDay } from "./scheduled-functions/deleteRoomsEveryDay";
