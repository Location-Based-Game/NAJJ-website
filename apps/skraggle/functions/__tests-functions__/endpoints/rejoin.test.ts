import { rejoin } from "../../src";
import { db } from "../../src/lib/firebaseAdmin";
import { addPlayer } from "../../src/firebase-actions/addPlayer";
import { createRoomData } from "../../src/firebase-actions/createRoomData";
import { SessionData } from "../../src/schemas/sessionSchema";
import { encryptJWT } from "../../src/lib/jwtUtils";
import { createGameId } from "../../src/lib/createGameId";

const express = require("express");
const supertest = require("supertest");

const app = express();
app.use(express.json());
app.post("/rejoin", (req: any, res: any) => rejoin(req as any, res));

describe("rejoin endpoint", () => {
  test("Host rejoins the game", async () => {
    const gameId = createGameId();

    // First create a room with a host
    await createRoomData(gameId);
    const playerName = "Host Player";
    const hostPlayerId = await addPlayer(gameId, playerName);
    await db.ref(`activeGames/${gameId}/host`).set(hostPlayerId);

    const sessionData: SessionData = {
      gameId,
      playerId: hostPlayerId,
      playerName,
    };
    const sessionJWT = await encryptJWT(sessionData);

    const response = await supertest(app)
      .post("/rejoin")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${sessionJWT}`]);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("isHost");
    expect(response.body.data.isHost).toBeTruthy();

    expect(response.body.data).toHaveProperty("gameId");
    expect(response.body.data.gameId).toEqual(gameId);

    expect(response.body.data).toHaveProperty("playerId");
    expect(response.body.data.playerId).toEqual(hostPlayerId);

    expect(response.body.data).toHaveProperty("playerName");
    expect(response.body.data.playerName).toEqual(playerName);
  }, 100000);

  test("Non host rejoins the game", async () => {
    const gameId = createGameId();

    // First create a room with a host
    await createRoomData(gameId);
    const hostPlayerId = await addPlayer(gameId, "Host Player");
    await db.ref(`activeGames/${gameId}/host`).set(hostPlayerId);

    const playerName = "Other Player 1";
    const otherPlayerId = await addPlayer(gameId, playerName);

    const sessionData: SessionData = {
      gameId,
      playerId: otherPlayerId,
      playerName,
    };
    const sessionJWT = await encryptJWT(sessionData);

    const response = await supertest(app)
      .post("/rejoin")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${sessionJWT}`]);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).not.toHaveProperty("isHost");

    expect(response.body.data).toHaveProperty("gameId");
    expect(response.body.data.gameId).toEqual(gameId);

    expect(response.body.data).toHaveProperty("playerId");
    expect(response.body.data.playerId).toEqual(otherPlayerId);

    expect(response.body.data).toHaveProperty("playerName");
    expect(response.body.data.playerName).toEqual(playerName);
  }, 100000);

  test("Throws an error if trying to rejoin without a playerId", async () => {
    const gameId = createGameId();

    // First create a room with a host
    await createRoomData(gameId);
    const hostPlayerId = await addPlayer(gameId, "Host Player");
    await db.ref(`activeGames/${gameId}/host`).set(hostPlayerId);

    const sessionData: SessionData = {
      gameId,
      playerId: "",
      playerName: "",
    };
    const sessionJWT = await encryptJWT(sessionData);

    const response = await supertest(app)
      .post("/rejoin")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${sessionJWT}`]);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("Error: No playerId assigned!")
  }, 100000);

  test("Throws an error if trying to rejoin a game that does not exist", async () => {
    const sessionData: SessionData = {
      gameId: "xxxx",
      playerId: "",
      playerName: "",
    };
    const sessionJWT = await encryptJWT(sessionData);

    const response = await supertest(app)
      .post("/rejoin")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${sessionJWT}`]);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("Error: Game not available!")
  }, 100000);
});
