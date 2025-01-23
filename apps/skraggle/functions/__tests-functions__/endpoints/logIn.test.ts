import { logIn } from "../../../index";
import { SessionData, sessionSchema } from "../../../schemas/sessionSchema";
import { SESSION_SET_MESSAGE } from "../../../shared/constants";
import { decryptJWT, encryptJWT } from "../../src/lib/jwtUtils";
const express = require("express");
const supertest = require("supertest");

const app = express();
app.use(express.json());
app.post("/logIn", (req: any, res: any) => logIn(req as any, res));

describe("logIn endpoint", () => {
  test("logs in without a gameId to create a session with a new gameId", async () => {
    const response = await supertest(app)
      .post("/logIn")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .send({ gameId: null });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("gameId");
    expect(response.body.data.gameId).toBeTruthy();

    const sessionCookie = response.headers["set-cookie"][0]
      .split("; ")
      .find((row: string) => row.startsWith("__session="))
      ?.split("=")[1];

    const parsedData = await decryptJWT(sessionCookie);
    const validatedData = sessionSchema.safeParse(parsedData);
    expect(validatedData.success).toBeTruthy();
    expect(validatedData.data?.gameId).toBeTruthy();
    expect(validatedData.data?.playerId).toBeFalsy();
    expect(validatedData.data?.playerName).toBeFalsy();
  }, 100000);

  test("logs in with a gameId to create a session with the given gameId", async () => {
    const response = await supertest(app)
      .post("/logIn")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .send({ gameId: "test" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("gameId");
    expect(response.body.data.gameId).toBeTruthy();

    const sessionCookie = response.headers["set-cookie"][0]
      .split("; ")
      .find((row: string) => row.startsWith("__session="))
      ?.split("=")[1];

    const parsedData = await decryptJWT(sessionCookie);
    const validatedData = sessionSchema.safeParse(parsedData);
    expect(validatedData.success).toBeTruthy();
    expect(validatedData.data?.gameId).toEqual("test");
    expect(validatedData.data?.playerId).toBeFalsy();
    expect(validatedData.data?.playerName).toBeFalsy();
  }, 100000);

  test("returns error message if a session already exists", async () => {
    const sessionData: SessionData = {
      gameId: "xxxx",
      playerId: "hostPlayerId",
      playerName: "host player",
    };
    const sessionJWT = await encryptJWT(sessionData);

    const response = await supertest(app)
      .post("/logIn")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .set("Cookie", [`__session=${sessionJWT}`])
      .send({ gameId: "test" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual(SESSION_SET_MESSAGE);
  }, 100000);

  test("returns error message if the data is incorrect", async () => {
    const response = await supertest(app)
      .post("/logIn")
      .set("Origin", "http://localhost")
      .set("Content-Type", "application/json")
      .send({ randomData: "randomData" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("Error: Invalid Data!");
  }, 100000);
});
