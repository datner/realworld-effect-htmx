import { Context, Effect, Layer } from "effect";
import * as PocketBase from "services/Pocketbase.js";
import * as Session from "services/Session.js";

interface Users {
  readonly _: unique symbol;
}

interface UserCreate {
  username?: string;
  email?: string;
  emailVisibility?: boolean;
  password: string;
  passwordVerification: string;
  verified?: boolean;
  bio?: string;
  image?: File;
}

const make = Effect.gen(function*(_) {
  const pb = yield* _(PocketBase.tag);
  const users = pb.collection("users");

  return {
    register: (input: UserCreate) =>
      Effect.promise(
        (signal) => users.create(input, { signal }),
      ).pipe(
        Effect.andThen(_ => Session.login(_.email, input.password)),
      ),
  };
});

export const tag = Context.Tag<Users, Effect.Effect.Success<typeof make>>("Users");

export const { register } = Effect.serviceFunctions(tag);

export const live = Layer.effect(tag, make);

export const layer = Layer.provide(live, PocketBase.global);
