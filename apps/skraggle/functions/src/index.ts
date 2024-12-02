/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const helloWorld4 = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export { addPlayer } from "./endpoints/addPlayer";
export { changePlayerColor } from "./endpoints/changePlayerColor";
export { createRoom } from "./endpoints/createRoom";
export { leaveGame } from "./endpoints/leaveGame";
export { logIn } from "./endpoints/logIn";
export { rejoin } from "./endpoints/rejoin";
export { sendPeerSignal } from "./endpoints/sendPeerSignal";
export { setInventory } from "./endpoints/setInventory";
export { startGame } from "./endpoints/startGame";
