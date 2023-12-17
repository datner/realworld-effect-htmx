import { HttpServer } from "@effect/platform-node";
import { Context, Effect, Layer } from "effect";
import PocketBase from "pocketbase";
export { PocketBase as Client };

export const tag = Context.Tag<PocketBase>("PocketBase");

export const make = Effect.sync(() => new PocketBase("http://127.0.0.1:8090"));

export const global = Layer.effect(tag, make);

export const middleware = HttpServer.middleware.make(Effect.provideServiceEffect(tag, make));
