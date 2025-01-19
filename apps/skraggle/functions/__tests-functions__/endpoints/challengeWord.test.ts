import { challengeWord } from "../../src";
import { db } from "../../src/lib/firebaseAdmin";
import { addPlayer } from "../../src/firebase-actions/addPlayer";
import { createRoomData } from "../../src/firebase-actions/createRoomData";
import { SessionData } from "../../../schemas/sessionSchema";
import { encryptJWT } from "../../src/lib/jwtUtils";
import { ItemTypes } from "../../../types";
import { createGameId } from "../../src/lib/createGameId";
import setGameState from "../../src/firebase-actions/setGameState";
import { ChallengeWordsData } from "../../../schemas/challengeWordSchema";
import { ServerValue } from "firebase-admin/database";
import { COUNTDOWN_SECONDS } from "../../src/endpoints/submitChallengeWords";
import { ChallengeWordSchemaType } from "../../src/endpoints/challengeWord";

const express = require("express");
const supertest = require("supertest");

const app = express();
app.use(express.json());
app.post("/challengeWord", (req: any, res: any) =>
  challengeWord(req as any, res),
);

describe("challengeWord endpoint", () => {
  test("Adds 1 challenger with 1 wagered item to a submitted challenge word", async () => {
    const gameId = createGameId();

    // First create a room with a host
    await createRoomData(gameId);
    const playerName = "Host Player";
    const hostPlayerId = await addPlayer(gameId, playerName);
    await db.ref(`activeGames/${gameId}/host`).set(hostPlayerId);

    await setGameState(gameId, "Gameplay");

    // Add a challenge word
    const wordId = "wordId";
    const challengeWordsData: ChallengeWordsData = {
      playerId: hostPlayerId,
      words: {
        [wordId]: {
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
      placedLetters: {},
      countdown: {
        startAt: ServerValue.TIMESTAMP,
        seconds: COUNTDOWN_SECONDS,
      },
    };

    const challengeWordsRef = db.ref(`activeGames/${gameId}/challengeWords`);
    await challengeWordsRef.set(challengeWordsData);

    const requestData: ChallengeWordSchemaType = {
      wordId,
      wageredLetters: {
        letterBlockId: {
          type: ItemTypes.LetterBlock,
          playerId: hostPlayerId,
          itemId: "letterBlockId",
          isPlaced: false,
          gridPosition: [],
          isDestroyed: false,
          itemData: { letter: "A" },
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
      .post("/challengeWord")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${sessionJWT}`])
      .send(requestData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    const challengersRef = db.ref(
      `activeGames/${gameId}/challengeWords/words/${wordId}/challengers`,
    );
    const challengersRefSnapshot = await challengersRef.get();
    expect(challengersRefSnapshot.exists()).toBeTruthy();
    expect(challengersRefSnapshot.val()).toHaveProperty(hostPlayerId);
    expect(challengersRefSnapshot.val()[hostPlayerId]).toHaveProperty(
      "letterBlockId",
    );
  }, 100000);

  test("Returns an error message if no items were wagered", async () => {
    const gameId = createGameId();

    // First create a room with a host
    await createRoomData(gameId);
    const playerName = "Host Player";
    const hostPlayerId = await addPlayer(gameId, playerName);
    await db.ref(`activeGames/${gameId}/host`).set(hostPlayerId);

    await setGameState(gameId, "Gameplay");

    // Add a challenge word
    const wordId = "wordId";
    const challengeWordsData: ChallengeWordsData = {
      playerId: hostPlayerId,
      words: {
        [wordId]: {
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
      placedLetters: {},
      countdown: {
        startAt: ServerValue.TIMESTAMP,
        seconds: COUNTDOWN_SECONDS,
      },
    };

    const challengeWordsRef = db.ref(`activeGames/${gameId}/challengeWords`);
    await challengeWordsRef.set(challengeWordsData);

    const requestData: ChallengeWordSchemaType = {
      wordId,
      wageredLetters: {},
    };

    const sessionData: SessionData = {
      gameId,
      playerId: hostPlayerId,
      playerName,
    };
    const sessionJWT = await encryptJWT(sessionData);

    const response = await supertest(app)
      .post("/challengeWord")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${sessionJWT}`])
      .send(requestData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("Error: No letters wagered!");
  }, 100000);

  test("Returns an error message if the challenged wordId does not exist", async () => {
    const gameId = createGameId();

    // First create a room with a host
    await createRoomData(gameId);
    const playerName = "Host Player";
    const hostPlayerId = await addPlayer(gameId, playerName);
    await db.ref(`activeGames/${gameId}/host`).set(hostPlayerId);

    await setGameState(gameId, "Gameplay");

    // Add a challenge word
    const wordId = "wordId";
    const challengeWordsData: ChallengeWordsData = {
      playerId: hostPlayerId,
      words: {},
      placedLetters: {},
      countdown: {
        startAt: ServerValue.TIMESTAMP,
        seconds: COUNTDOWN_SECONDS,
      },
    };

    const challengeWordsRef = db.ref(`activeGames/${gameId}/challengeWords`);
    await challengeWordsRef.set(challengeWordsData);

    const requestData: ChallengeWordSchemaType = {
        wordId,
        wageredLetters: {
          letterBlockId: {
            type: ItemTypes.LetterBlock,
            playerId: hostPlayerId,
            itemId: "letterBlockId",
            isPlaced: false,
            gridPosition: [],
            isDestroyed: false,
            itemData: { letter: "A" },
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
      .post("/challengeWord")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`session=${sessionJWT}`])
      .send(requestData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("Error: Invalid wordId!");
  }, 100000);
});
