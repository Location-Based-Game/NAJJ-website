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

export { addPlayer } from "./functions/src/endpoints/addPlayer";
export { challengeWord } from "./functions/src/endpoints/challengeWord";
export { changePlayerColor } from "./functions/src/endpoints/changePlayerColor";
export { createRoom } from "./functions/src/endpoints/createRoom";
export { endTurnGetNewLetters } from "./functions/src/endpoints/endTurnGetNewLetters";
export { leaveGame } from "./functions/src/endpoints/leaveGame";
export { logIn } from "./functions/src/endpoints/logIn";
export { rejoin } from "./functions/src/endpoints/rejoin";
export { sendPeerSignal } from "./functions/src/endpoints/sendPeerSignal";
export { setInventory } from "./functions/src/endpoints/setInventory";
export { startGame } from "./functions/src/endpoints/startGame";
export { submitChallengeWords } from "./functions/src/endpoints/submitChallengeWords";

export { onPlayerDisconnect } from "./functions/src/events/onPlayerDisconnect";

export { deleteRoomsEveryDay } from "./functions/src/scheduled-functions/deleteRoomsEveryDay";
