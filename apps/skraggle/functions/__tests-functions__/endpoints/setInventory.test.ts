import { setInventory } from "../../../index";
import { db } from "../../src/lib/firebaseAdmin";
import { addPlayer } from "../../src/firebase-actions/addPlayer";
import { createRoomData } from "../../src/firebase-actions/createRoomData";
import { SessionData } from "../../../schemas/sessionSchema";
import { encryptJWT } from "../../src/lib/jwtUtils";
import { GameStates, Inventory, ItemTypes } from "../../../types";
import { createGameId } from "../../src/lib/createGameId";
import setGameState from "../../src/firebase-actions/setGameState";
import { createTurnNumbers } from "../../src/firebase-actions/createTurnNumbers";

const express = require("express");
const supertest = require("supertest");

const app = express();
app.use(express.json());
app.post("/setInventory", (req: any, res: any) =>
  setInventory(req as any, res),
);

describe("setInventory endpoint", () => {
  test("Create and cast starting dice, and add 7 letter blocks to the player inventory", async () => {
    const gameId = createGameId();

    // First create a room with a host
    await createRoomData(gameId);
    const playerName = "Host Player";
    const hostPlayerId = await addPlayer(gameId, playerName);
    await db.ref(`activeGames/${gameId}/host`).set(hostPlayerId);

    // Create turn numbers & starting dice
    await setGameState(gameId, "TurnsDiceRoll");
    await createTurnNumbers(gameId);

    // Get starting dice and place them on grid
    const inventoryRef = db.ref(
      `activeGames/${gameId}/inventories/${hostPlayerId}`,
    );
    const inventorySnapshot = await inventoryRef.get();
    expect(inventorySnapshot.exists()).toBeTruthy();
    const castStartingDice = Object.entries(
      inventorySnapshot.val() as Inventory,
    ).reduce<Inventory>((res, [itemId, data]) => {
      data.isPlaced = true;
      data.itemData = JSON.stringify(data.itemData);
      res[itemId] = data;
      return res;
    }, {});

    const sessionData: SessionData = {
      gameId,
      playerId: hostPlayerId,
      playerName,
    };
    const sessionJWT = await encryptJWT(sessionData);

    const response = await supertest(app)
      .post("/setInventory")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${sessionJWT}`])
      .send({ currentItems: castStartingDice });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    // Check if 7 letter blocks are added to the player inventory
    const inventorySnapshot2 = await inventoryRef.get();
    expect(inventorySnapshot2.exists()).toBeTruthy();
    expect(inventorySnapshot2.numChildren()).toEqual(7);
    const items = Object.values(inventorySnapshot2.val() as Inventory);
    expect(
      items.every((item) => item.type === ItemTypes.LetterBlock),
    ).toBeTruthy();

    // Game state should be FirstTurn after casting dice
    const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
    const gameState = (await gameStateRef.get()).val() as GameStates;
    expect(gameState).toEqual("FirstTurn");
  }, 100000);

  test("Create and cast starting dice and place them on grid when there are 2 or more players, then add 7 letter blocks to each player inventory when all starting dice is cast", async () => {
    const gameId = createGameId();

    // First create a room with a host with 1 other player
    await createRoomData(gameId);
    const playerName = "Host Player";
    const hostPlayerId = await addPlayer(gameId, playerName);
    await db.ref(`activeGames/${gameId}/host`).set(hostPlayerId);
    const otherPlayerId = await addPlayer(gameId, "Other Player 1");

    // Create turn numbers & starting dice
    await setGameState(gameId, "TurnsDiceRoll");
    await createTurnNumbers(gameId);

    // Get host's starting dice and place them on grid
    const hostInventoryRef = db.ref(
      `activeGames/${gameId}/inventories/${hostPlayerId}`,
    );
    const hostInventorySnapshot = await hostInventoryRef.get();
    expect(hostInventorySnapshot.exists()).toBeTruthy();
    const castStartingDice = Object.entries(
      hostInventorySnapshot.val() as Inventory,
    ).reduce<Inventory>((res, [itemId, data]) => {
      data.isPlaced = true;
      data.itemData = JSON.stringify(data.itemData);
      res[itemId] = data;
      return res;
    }, {});

    const hostSessionData: SessionData = {
      gameId,
      playerId: hostPlayerId,
      playerName,
    };
    const hostSessionJWT = await encryptJWT(hostSessionData);

    const response = await supertest(app)
      .post("/setInventory")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${hostSessionJWT}`])
      .send({ currentItems: castStartingDice });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    // There should be 2 starting dice on the grid
    const gridRef = db.ref(`activeGames/${gameId}/grid`);
    const gridSnapshot = await gridRef.get();
    expect(gridSnapshot.exists()).toBeTruthy();
    expect(gridSnapshot.numChildren()).toEqual(2);
    const items = Object.values(gridSnapshot.val() as Inventory);
    expect(
      items.every((item) => item.type === ItemTypes.StartingDice),
    ).toBeTruthy();

    // Host player inventory should be empty
    const hostInventorySnapshot2 = await hostInventoryRef.get();
    expect(hostInventorySnapshot2.exists()).toBeFalsy();

    // Game state should still be TurnsDiceRoll
    const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
    const gameState = (await gameStateRef.get()).val() as GameStates;
    expect(gameState).toEqual("TurnsDiceRoll");

    // Other player should still have dice in inventory
    const otherPlayerInventoryRef = db.ref(
      `activeGames/${gameId}/inventories/${otherPlayerId}`,
    );
    const otherPlayerInventorySnapshot = await otherPlayerInventoryRef.get();
    expect(otherPlayerInventorySnapshot.exists()).toBeTruthy();
    const otherPlayerInventory =
      otherPlayerInventorySnapshot.val() as Inventory;
    expect(
      Object.values(otherPlayerInventory).every(
        (item) => item.type === ItemTypes.StartingDice,
      ),
    ).toBeTruthy();

    // Get other player's starting dice and place them on grid
    const castOtherPlayerStartingDice = Object.entries(
      otherPlayerInventory,
    ).reduce<Inventory>((res, [itemId, data]) => {
      data.isPlaced = true;
      data.itemData = JSON.stringify(data.itemData);
      res[itemId] = data;
      return res;
    }, {});

    const otherPlayerSessionData: SessionData = {
      gameId,
      playerId: otherPlayerId,
      playerName,
    };
    const otherPlayerSessionJWT = await encryptJWT(otherPlayerSessionData);

    const otherPlayerResponse = await supertest(app)
      .post("/setInventory")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${otherPlayerSessionJWT}`])
      .send({ currentItems: castOtherPlayerStartingDice });

    expect(otherPlayerResponse.status).toBe(200);
    expect(otherPlayerResponse.body).toHaveProperty("data");

    // Grid should be cleared
    const gridSnapshot2 = await gridRef.get();
    expect(gridSnapshot2.exists()).toBeFalsy();

    const gameState2 = (await gameStateRef.get()).val() as GameStates;
    expect(gameState2).toEqual("FirstTurn");

    // Both host and other player should have 7 letter blocks in their inventories
    const hostInventorySnapshot3 = await hostInventoryRef.get();
    expect(hostInventorySnapshot3.exists()).toBeTruthy();
    expect(hostInventorySnapshot3.numChildren()).toEqual(7);
    const hostInventory = hostInventorySnapshot3.val() as Inventory;
    expect(
      Object.values(hostInventory).every(
        (item) => item.type === ItemTypes.LetterBlock,
      ),
    ).toBeTruthy();

    const otherPlayerInventorySnapshot2 = await otherPlayerInventoryRef.get();
    expect(otherPlayerInventorySnapshot2.exists()).toBeTruthy();
    expect(otherPlayerInventorySnapshot2.numChildren()).toEqual(7);
    const otherPlayerInventory2 =
      otherPlayerInventorySnapshot2.val() as Inventory;
    expect(
      Object.values(otherPlayerInventory2).every(
        (item) => item.type === ItemTypes.LetterBlock,
      ),
    ).toBeTruthy();
  }, 100000);

  test("Add a player after host has created and cast starting dice, and still transition to FirstTurn state and add 7 letter blocks to each player inventory", async () => {
    const gameId = createGameId();

    // First create a room with a host
    await createRoomData(gameId);
    const playerName = "Host Player";
    const hostPlayerId = await addPlayer(gameId, playerName);
    await db.ref(`activeGames/${gameId}/host`).set(hostPlayerId);

    // Create turn numbers & starting dice
    await setGameState(gameId, "TurnsDiceRoll");
    await createTurnNumbers(gameId);

    // Player is added **AFTER** turn numbers & dice are created. Inventory should be empty
    const otherPlayerId = await addPlayer(gameId, "Other Player 1");
    const otherPlayerInventoryRef = db.ref(
      `activeGames/${gameId}/inventories/${otherPlayerId}`,
    );
    const otherPlayerInventorySnapshot = await otherPlayerInventoryRef.get();
    expect(otherPlayerInventorySnapshot.exists()).toBeFalsy();

    // Get host's starting dice and place them on grid
    const hostInventoryRef = db.ref(
      `activeGames/${gameId}/inventories/${hostPlayerId}`,
    );
    const hostInventorySnapshot = await hostInventoryRef.get();
    expect(hostInventorySnapshot.exists()).toBeTruthy();
    const castStartingDice = Object.entries(
      hostInventorySnapshot.val() as Inventory,
    ).reduce<Inventory>((res, [itemId, data]) => {
      data.isPlaced = true;
      data.itemData = JSON.stringify(data.itemData);
      res[itemId] = data;
      return res;
    }, {});

    const hostSessionData: SessionData = {
      gameId,
      playerId: hostPlayerId,
      playerName,
    };
    const hostSessionJWT = await encryptJWT(hostSessionData);

    const response = await supertest(app)
      .post("/setInventory")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${hostSessionJWT}`])
      .send({ currentItems: castStartingDice });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    // Check if 7 letter blocks are added to all player inventories
    const hostInventorySnapshot2 = await hostInventoryRef.get();
    expect(hostInventorySnapshot2.exists()).toBeTruthy();
    expect(hostInventorySnapshot2.numChildren()).toEqual(7);
    const hostInventory = hostInventorySnapshot2.val() as Inventory;
    expect(
      Object.values(hostInventory).every(
        (item) => item.type === ItemTypes.LetterBlock,
      ),
    ).toBeTruthy();

    const otherPlayerInventorySnapshot2 = await otherPlayerInventoryRef.get();
    expect(otherPlayerInventorySnapshot2.exists()).toBeTruthy();
    expect(otherPlayerInventorySnapshot2.numChildren()).toEqual(7);
    const otherPlayerInventory =
      otherPlayerInventorySnapshot2.val() as Inventory;
    expect(
      Object.values(otherPlayerInventory).every(
        (item) => item.type === ItemTypes.LetterBlock,
      ),
    ).toBeTruthy();

    // Game state should be FirstTurn after casting dice
    const gameStateRef = db.ref(`activeGames/${gameId}/gameState`);
    const gameState = (await gameStateRef.get()).val() as GameStates;
    expect(gameState).toEqual("FirstTurn");
  }, 100000);

  test("returns error message if the data is incorrect", async () => {
    const response = await supertest(app)
      .post("/setInventory")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .send({ randomData: "random data" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  }, 100000);
});
