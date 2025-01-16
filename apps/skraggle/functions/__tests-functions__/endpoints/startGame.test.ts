import { startGame } from "../../src";
import { db } from "../../src/lib/firebaseAdmin";
import { addPlayer } from "../../src/firebase-actions/addPlayer";
import { createRoomData } from "../../src/firebase-actions/createRoomData";
import { SessionData } from "../../src/schemas/sessionSchema";
import { encryptJWT } from "../../src/lib/jwtUtils";
import { GameStates, Inventory, ItemTypes, PlayersData } from "../../src/types";
import { createGameId } from "../../src/lib/createGameId";

const express = require("express");
const supertest = require("supertest");

const app = express();
app.use(express.json());
app.post("/startGame", (req: any, res: any) => startGame(req as any, res));

describe("startGame endpoint", () => {
  test("Host starts the game, the game state changes to TurnsDiceRoll, and turn numbers valid", async () => {
    const gameId = createGameId();

    // First create a room with a host
    await createRoomData(gameId);
    const hostPlayerId = await addPlayer(gameId, "Host Player");
    await db.ref(`activeGames/${gameId}/host`).set(hostPlayerId);

    // Add another player to check if turn number is created
    const otherPlayerId = await addPlayer(gameId, "Other Player 1");

    // Check if turn numbers match the player's join order
    const playersRef = db.ref(`activeGames/${gameId}/players`);
    const playersData1 = (await playersRef.get()).val() as PlayersData;
    expect(playersData1[hostPlayerId].turn).toBe(0);
    expect(playersData1[otherPlayerId].turn).toBe(1);

    const sessionData: SessionData = {
      gameId,
      playerId: hostPlayerId,
      playerName: "Host Player",
    };
    const sessionJWT = await encryptJWT(sessionData);

    const response = await supertest(app)
      .post("/startGame")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${sessionJWT}`]);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    // Check if game state is TurnsDiceRoll
    const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
    const gameState = (await gameStateRef.get()).val() as GameStates;
    expect(gameState).toEqual("TurnsDiceRoll");

    // Check if starting dice is in inventory
    const inventoryRef = db.ref(`activeGames/${gameId}/inventories/${hostPlayerId}`);
    const inventorySnapshot = await inventoryRef.get();
    expect(inventorySnapshot.exists()).toBeTruthy();
    const items = Object.values(inventorySnapshot.val() as Inventory)
    expect(items.every(item => item.type === ItemTypes.StartingDice)).toBeTruthy()

    // Turn numbers are different
    const playersData2 = (await playersRef.get()).val() as PlayersData;
    expect(playersData2[hostPlayerId].turn).not.toEqual(
      playersData2[otherPlayerId].turn,
    );
  }, 100000);

  test("Throws an error if a non host player tries to start the game", async () => {
    const gameId = createGameId();

    // First create a room with a host
    await createRoomData(gameId);
    const playerId = await addPlayer(gameId, "Host Player");
    await db.ref(`activeGames/${gameId}/host`).set(playerId);

    const sessionData: SessionData = {
      gameId,
      playerId: "Other Player Id",
      playerName: "Other Player",
    };
    const sessionJWT = await encryptJWT(sessionData);

    const response = await supertest(app)
      .post("/startGame")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${sessionJWT}`]);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error");
  }, 100000);

  test("Throws an error if trying to start a game that does not exist", async () => {
    const sessionData: SessionData = {
      gameId: "xxxx",
      playerId: "",
      playerName: "",
    };
    const sessionJWT = await encryptJWT(sessionData);

    const response = await supertest(app)
      .post("/startGame")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${sessionJWT}`]);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("Error: Game not available!")
  }, 100000);
});
