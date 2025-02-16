import { onRequest, type Request } from "firebase-functions/v2/https";
import { deleteSession } from "./sessionUtils";
import type { Response } from "express";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
const JWT_SECRET_TOKEN = defineSecret("JWT_SECRET_TOKEN");

export function onAuthorizedRequest(
  handler: (request: Request, response: Response) => Promise<void>,
) {
  return onRequest(
    { cors: true, secrets: [JWT_SECRET_TOKEN] },
    async (request, response) => {
      response.set("Access-Control-Allow-Credentials", "true");

      try {
        await handler(request, response);
      } catch (error) {
        deleteSession(response);
        logger.error(`${error}`);
        response.status(400).send({ error: `${error}` });
      }
    },
  );
}
