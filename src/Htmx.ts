import { HttpServer } from "@effect/platform-node";
import { Effect, Option } from "effect";

export const pushUrl = (target: string | false) => HttpServer.response.setHeader("HX-Push-Url", String(target));

export const navigate = (target: string) => HttpServer.response.setHeader("HX-Location", target);

export const retarget = (target: string) => HttpServer.response.setHeader("HX-Retarget", target);

export const reselect = (target: string) => HttpServer.response.setHeader("HX-Reselect", target);

export const CurrentUrl = HttpServer.request.ServerRequest.pipe(
  Effect.andThen(_ => Effect.fromNullable(_.headers["hx-current-url"])),
  Effect.map(_ => new URL(_)),
);

export const HxRequest = Effect.map(
  HttpServer.request.ServerRequest,
  _ => Boolean(_.headers["hx-request"]),
);
