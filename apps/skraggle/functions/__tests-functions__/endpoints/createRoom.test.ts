import { createRoom } from "../../src";
import { db } from "../../src/lib/firebaseAdmin";
import { createGameId } from "../../src/lib/createGameId";
const express = require("express");
const supertest = require("supertest");

const gameId = createGameId()

jest.mock("../../src/lib/sessionUtils", () => ({
  getSessionData: jest.fn(() => Promise.resolve({ gameId })),
  setSessionCookie: jest.fn(),
  deleteSession: jest.fn(),
}));

const app = express();
app.use(express.json());
app.post("/createRoom", (req: any, res: any) => createRoom(req as any, res));

describe("createRoom endpoint", () => {
  test("creates a room and adds a host player", async () => {
    const response = await supertest(app)
      .post("/createRoom")
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
    expect(Object.values(players.val()).length).toEqual(1);
  }, 100000);

  test("returns error message if the data is incorrect", async () => {
    const response = await supertest(app)
      .post("/createRoom")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .send({ randomData: "test player" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  }, 100000);
});
