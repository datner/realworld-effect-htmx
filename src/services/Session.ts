import { HttpServer } from "@effect/platform-node";
import { Schema } from "@effect/schema";
import { Context, Effect, Option } from "effect";
import { User } from "models/User.js";
import * as PocketBase from "services/Pocketbase.js";

interface Session {
  readonly user: User;
  readonly pb: PocketBase.Client;
  readonly setCookie: (self: HttpServer.response.ServerResponse) => HttpServer.response.ServerResponse;
  readonly logout: Effect.Effect<never, never, void>;
}
export const tag = Context.Tag<Session>("Session");

export const Cookie = Schema.struct({
  "cookie": Schema.optional(Schema.string).toOption(),
});

class UnauthorizedError extends Schema.TaggedClass<UnauthorizedError>()("UnauthorizedError", {
  cause: Schema.unknown,
}) {}

export const make = Effect.gen(function*(_) {
  const pb = yield* _(PocketBase.make);
  const req = yield* _(HttpServer.request.schemaHeaders(Cookie));

  if (Option.isSome(req.cookie)) {
    pb.authStore.loadFromCookie(req.cookie.value);
  }

  const authResponse = yield* _(
    Effect.succeed(pb),
    Effect.filterOrFail(_ => _.authStore.isValid, () => new UnauthorizedError({ cause: "session invalid" })),
    Effect.tryMapPromise({
      try: (_, signal) => _.collection("users").authRefresh({ signal }),
      catch: (cause) => new UnauthorizedError({ cause }),
    }),
    Effect.tapErrorTag("UnauthorizedError", () => Effect.sync(() => pb.authStore.clear())),
  );

  const user = yield* _(User.decode({ ...authResponse.record, token: authResponse.token }));

  return tag.of({
    user,
    pb,
    setCookie: HttpServer.response.setHeader("set-cookie", pb.authStore.exportToCookie()),
    logout: Effect.sync(() => pb.authStore.clear()),
  });
});

export const login = (username: string, password: string) =>
  Effect.gen(function*(_) {
    const pb = yield* _(PocketBase.make);
    const authResponse = yield* _(
      Effect.tryPromise({
        try: (signal) => pb.collection("users").authWithPassword(username, password, { signal }),
        catch: (cause) => new UnauthorizedError({ cause }),
      }),
    );

    const user = yield* _(User.decode({ ...authResponse.record, token: authResponse.token }));

    return tag.of({
      user,
      pb,
      setCookie: HttpServer.response.setHeader("set-cookie", pb.authStore.exportToCookie()),
      logout: Effect.sync(() => pb.authStore.clear()),
    });
  });

export const middleware = HttpServer.middleware.make(app =>
  app.pipe(
    Effect.andThen(setCookie),
    Effect.provideServiceEffect(tag, make),
    Effect.catchTag("UnauthorizedError", () => HttpServer.response.empty({ status: 401 })),
  )
);

export const user = Effect.map(tag, _ => _.user);
export const { logout } = Effect.serviceConstants(tag);
export const { setCookie } = Effect.serviceFunctions(tag);
