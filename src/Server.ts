import { HttpServer } from "@effect/platform-node";
import { Config, Effect, Layer } from "effect";
import * as http from "node:http";
import type { ListenOptions } from "node:net";

export const make = (Options: Config.Config.Wrap<ListenOptions>) =>
  Effect.gen(function*(_) {
    const options = yield* _(Config.unwrap(Options));

    return HttpServer.server.layer(() => new http.Server(), options);
  });

export const layer = (Options: Config.Config.Wrap<ListenOptions>) => Layer.unwrapEffect(make(Options));
