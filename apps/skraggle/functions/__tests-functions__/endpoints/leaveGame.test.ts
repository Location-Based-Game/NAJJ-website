import { addPlayer } from "../../src/firebase-actions/addPlayer";
import { leaveGame } from "../../src";
import { db } from "../../src/lib/firebaseAdmin";
import { createRoomData } from "../../src/firebase-actions/createRoomData";
import { SessionData } from "../../src/schemas/sessionSchema";
import { encryptJWT } from "../../src/lib/jwtUtils";
const express = require("express");
const supertest = require("supertest");

const app = express();
app.use(express.json());
app.post("/leaveGame", (req: any, res: any) => leaveGame(req as any, res));

describe("leaveGame endpoint", () => {
  test("host and only player leaves the game and room is deleted", async () => {
    const gameId = "aaac";
    await createRoomData(gameId);
    const playerId = await addPlayer(gameId, "Host Player");
    const sessionData: SessionData = {
      gameId,
      playerId,
      playerName: "Host Player",
    };
    const sessionJWT = await encryptJWT(sessionData);

    await db.ref(`activeGames/${gameId}/host`).set(playerId);
    const response = await supertest(app)
      .post("/leaveGame")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${sessionJWT}`])
      .send({ playerName: "test player" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    
    // Check if room is deleted
    const gameRef = db.ref(`activeGames/${gameId}`);
    const gameExists = (await gameRef.get()).exists();
    expect(gameExists).toBeFalsy();
  }, 100000);

  test("host leaves the game and a different player becomes host", async () => {
    const gameId = "aaad";
    await createRoomData(gameId);
    const hostId = await addPlayer(gameId, "Host Player");

    // Adds two players. The first player should become host when the current host leaves
    const otherPlayerId1 = await addPlayer(gameId, "Other Player 1")
    await addPlayer(gameId, "Other Player 2")

    // Check if host player is added
    const hostPlayerRef = db.ref(`activeGames/${gameId}/players/${hostId}`)
    const hostExists = (await hostPlayerRef.get()).exists();
    expect(hostExists).toBeTruthy();

    const sessionData: SessionData = {
      gameId,
      playerId: hostId,
      playerName: "Host Player",
    };
    const sessionJWT = await encryptJWT(sessionData);

    const hostIdRef = db.ref(`activeGames/${gameId}/host`)
    await hostIdRef.set(hostId);
    const response = await supertest(app)
      .post("/leaveGame")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${sessionJWT}`])
      .send({ playerName: "test player" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    // Check if host player is removed
    const hostStillExists = (await hostPlayerRef.get()).exists();
    expect(hostStillExists).toBeFalsy();

    // Check if game host is set to Other Player 1's ID
    const newHostId = (await hostIdRef.get()).val()
    expect(newHostId).toEqual(otherPlayerId1)
  }, 100000);
});
