import { addPlayer } from "../../src/firebase-actions/addPlayer";
import { addPlayer as addPlayerEndPoint } from "../../src";
import { db } from "../../src/lib/firebaseAdmin";
import { createRoomData } from "../../src/firebase-actions/createRoomData";
import { createGameId } from "../../src/lib/createGameId";

const express = require("express");
const supertest = require("supertest");

const gameId = createGameId();

jest.mock("../../src/lib/sessionUtils", () => ({
  getSessionData: jest.fn(() => Promise.resolve({ gameId })),
  setSessionCookie: jest.fn(),
  deleteSession: jest.fn(),
}));

const app = express();
app.use(express.json());
app.post("/addPlayer", (req: any, res: any) =>
  addPlayerEndPoint(req as any, res),
);

describe("addPlayer endpoint", () => {
  test("adds a player to an existing room with just the host, and keep adding players until max is reached", async () => {
    // First create a room with a host
    await createRoomData(gameId)
    const playerId = await addPlayer(gameId, "Host Player");
    await db.ref(`activeGames/${gameId}/host`).set(playerId);

    const response = await supertest(app)
      .post("/addPlayer")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .send({ playerName: "test player" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    const gameRef = db.ref(`activeGames/${gameId}`);
    const gameExists = (await gameRef.get()).exists();
    expect(gameExists).toBeTruthy();

    const playersRef = db.ref(`activeGames/${gameId}/players`);
    const players = await playersRef.get();
    expect(players.exists()).toBeTruthy();
    expect(Object.values(players.val()).length).toEqual(2);

    // // Add players until max is reached
    await Promise.all(
      [...Array(6)].map(async (_, i) => {
        await supertest(app)
          .post("/addPlayer")
          .set("Origin", "http://localhost")
          .set("Content-Type", "application/json")
          .send({ playerName: `test player ${i}` });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
      }),
    );

    // Max players reached, throws an error when adding one more
    const lastResponse = await supertest(app)
      .post("/addPlayer")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .send({ playerName: "last player" });

    expect(lastResponse.status).toBe(400);
    expect(lastResponse.body).toHaveProperty("error");
  }, 100000);

  test("returns error message if the data is incorrect", async () => {
    const response = await supertest(app)
      .post("/addPlayer")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .send({ randomData: "test player" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  }, 100000);
});
