import { submitChallengeWords } from "../../../index";
import { db } from "../../src/lib/firebaseAdmin";
import { addPlayer } from "../../src/firebase-actions/addPlayer";
import { createRoomData } from "../../src/firebase-actions/createRoomData";
import { SessionData } from "../../../schemas/sessionSchema";
import { encryptJWT } from "../../src/lib/jwtUtils";
import { Inventory } from "../../../types";
import { createGameId } from "../../src/lib/createGameId";
import setGameState from "../../src/firebase-actions/setGameState";
import { getLetterBlocks } from "../../src/lib/getLetterBlocks";
import { SubmittedChallengeWords } from "../../../schemas/challengerSchema";
import { GameSettings } from "../../../schemas/gameSettingsSchema";

const express = require("express");
const supertest = require("supertest");
const gameSettings:GameSettings = {
  realWordsOnly: false
}
const app = express();
app.use(express.json());
app.post("/submitChallengeWords", (req: any, res: any) =>
  submitChallengeWords(req as any, res),
);

describe("submitChallengeWords endpoint", () => {
  test("Submits 1 challenge word and moves 3 letter blocks from inventory to grid", async () => {
    const gameId = createGameId();

    // First create a room with a host
    await createRoomData(gameId, gameSettings);
    const playerName = "Host Player";
    const hostPlayerId = await addPlayer(gameId, playerName);
    await db.ref(`activeGames/${gameId}/host`).set(hostPlayerId);

    await setGameState(gameId, "Gameplay");

    const inventoriesRef = db.ref(
      `activeGames/${gameId}/inventories/${hostPlayerId}`,
    );
    const letterBlocks = getLetterBlocks({}, hostPlayerId) as Inventory;
    await inventoriesRef.set(letterBlocks);

    let placedCount = 0;
    const currentItems = Object.entries(letterBlocks).reduce<Inventory>(
      (obj, [itemId, data]) => {
        if (placedCount < 3) {
          data.isPlaced = true;
          data.gridPosition = [placedCount, 0];
          placedCount++;
        }
        obj[itemId] = data;
        return obj;
      },
      {},
    );

    const data: SubmittedChallengeWords = {
      currentItems,
      submittedChallengeWords: {
        wordId: {
          word: "",
          score: 0,
          doubleBonus: 0,
          tripleBonus: 0,
          scoreMultipliers: [],
          firstPos: [],
          lastPos: [],
          challengers: {},
        },
      },
    };

    const sessionData: SessionData = {
      gameId,
      playerId: hostPlayerId,
      playerName,
    };
    const sessionJWT = await encryptJWT(sessionData);

    const response = await supertest(app)
      .post("/submitChallengeWords")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`__session=${sessionJWT}`])
      .send(data);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    const challengeWordsRef = db.ref(`activeGames/${gameId}/challengeWords`);
    const challengeWordsSnapshot = await challengeWordsRef.get();
    expect(challengeWordsSnapshot.exists()).toBeTruthy();

    // Inventory should have 4 items, since 3 were placed on grid
    const inventorySnapshot = await inventoriesRef.get();
    expect(inventorySnapshot.numChildren()).toEqual(4);

    const gridRef = db.ref(`activeGames/${gameId}/grid`);
    const gridSnapshot = await gridRef.get();
    expect(gridSnapshot.numChildren()).toEqual(3);
  }, 100000);

  test("Submits 2 challenge words and moves 1 letter block from inventory to grid", async () => {
    const gameId = createGameId();

    // First create a room with a host
    await createRoomData(gameId, gameSettings);
    const playerName = "Host Player";
    const hostPlayerId = await addPlayer(gameId, playerName);
    await db.ref(`activeGames/${gameId}/host`).set(hostPlayerId);

    await setGameState(gameId, "Gameplay");

    const inventoriesRef = db.ref(
      `activeGames/${gameId}/inventories/${hostPlayerId}`,
    );
    const letterBlocks = getLetterBlocks({}, hostPlayerId) as Inventory;
    await inventoriesRef.set(letterBlocks);

    let placedCount = 0;
    const currentItems = Object.entries(letterBlocks).reduce<Inventory>(
      (obj, [itemId, data]) => {
        if (placedCount < 1) {
          data.isPlaced = true;
          data.gridPosition = [placedCount, 0];
          placedCount++;
        }
        obj[itemId] = data;
        return obj;
      },
      {},
    );

    const data: SubmittedChallengeWords = {
      currentItems,
      submittedChallengeWords: {
        wordId1: {
          word: "",
          score: 0,
          doubleBonus: 0,
          tripleBonus: 0,
          scoreMultipliers: [],
          firstPos: [],
          lastPos: [],
          challengers: {},
        },
        wordId2: {
          word: "",
          score: 0,
          doubleBonus: 0,
          tripleBonus: 0,
          scoreMultipliers: [],
          firstPos: [],
          lastPos: [],
          challengers: {},
        },
      },
    };

    const sessionData: SessionData = {
      gameId,
      playerId: hostPlayerId,
      playerName,
    };
    const sessionJWT = await encryptJWT(sessionData);

    const response = await supertest(app)
      .post("/submitChallengeWords")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`__session=${sessionJWT}`])
      .send(data);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    const challengeWordsRef = db.ref(`activeGames/${gameId}/challengeWords`);
    const challengeWordsSnapshot = await challengeWordsRef.get();
    expect(challengeWordsSnapshot.exists()).toBeTruthy();
    expect(challengeWordsSnapshot.val()).toHaveProperty("words")
    expect(Object.keys(challengeWordsSnapshot.val().words).length).toEqual(2)

    // Inventory should have 6 items, since 1 was placed on grid
    const inventorySnapshot = await inventoriesRef.get();
    expect(inventorySnapshot.numChildren()).toEqual(6);

    const gridRef = db.ref(`activeGames/${gameId}/grid`);
    const gridSnapshot = await gridRef.get();
    expect(gridSnapshot.numChildren()).toEqual(1);
  }, 100000);

  test("Returns error message if no items were placed", async () => {
    const gameId = createGameId();

    // First create a room with a host
    await createRoomData(gameId, gameSettings);
    const playerName = "Host Player";
    const hostPlayerId = await addPlayer(gameId, playerName);
    await db.ref(`activeGames/${gameId}/host`).set(hostPlayerId);

    const letterBlocks = getLetterBlocks({}, hostPlayerId);

    const data: SubmittedChallengeWords = {
      currentItems: letterBlocks,
      submittedChallengeWords: {
        wordId1: {
          word: "",
          score: 0,
          doubleBonus: 0,
          tripleBonus: 0,
          scoreMultipliers: [],
          firstPos: [],
          lastPos: [],
          challengers: {},
        }
      },
    };

    const sessionData: SessionData = {
      gameId,
      playerId: hostPlayerId,
      playerName,
    };
    const sessionJWT = await encryptJWT(sessionData);

    const response = await supertest(app)
      .post("/submitChallengeWords")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`__session=${sessionJWT}`])
      .send(data);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("Error: No items placed!")
  }, 100000);

  test("Returns error message if the data is incorrect", async () => {
    const response = await supertest(app)
      .post("/submitChallengeWords")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .send({ randomData: "random data" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("Error: Invalid Data!")
  }, 100000);
});
