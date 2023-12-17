import { HttpServer } from "@effect/platform-node";
import { Effect } from "effect";
import * as Session from "services/Session.js";

const Me = Session.user.pipe(
  Effect.andThen(HttpServer.response.json),
);

export const app = HttpServer.router.empty.pipe(
  HttpServer.router.get("/", Me),
  HttpServer.router.use(Session.middleware),
);
