import { createRoom } from "../src"
import { db } from "../src/lib/firebaseAdmin";
const express = require("express");
const supertest = require("supertest")

jest.mock("../src/lib/sessionUtils", () => ({
  getSessionData: jest.fn(() => Promise.resolve({ gameId: "aaaa" })),
  setSessionCookie: jest.fn(),
  deleteSession: jest.fn(),
}));

const app = express();
app.use(express.json());
app.post("/createRoom", (req:any, res:any) => createRoom(req as any, res));

describe("create room endpoint", () => {

  test("creates a room and adds a host player", async () => {
    const response = await supertest(app)
    .post("/createRoom")
    .set("Origin", "http://localhost")
    .set("Content-Type", "application/json")
    .send(JSON.stringify({ playerName: "test player" }));

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("data");

  const gameRef = db.ref("activeGames/aaaa")
  const gameExists = (await gameRef.get()).exists()
  expect(gameExists).toBe(true)

  const playersRef = db.ref("activeGames/aaaa/players")
  const players = await playersRef.get()
  expect(players.exists()).toBe(true)
  expect(Object.values(players.val()).length).toEqual(1)
  }, 100000);
});
