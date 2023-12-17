import { HttpServer } from "@effect/platform-node";
import { ParseResult, Schema } from "@effect/schema";
import { Html } from "@kitajs/html";
import { Effect } from "effect";
import * as Htmx from "Htmx.js";
import { Image, User } from "models/User.js";
import * as Render from "Render.js";
import { Session, Users } from "services/prelude.js";

// ======= POST /login =======

class LoginBody extends Schema.Class<LoginBody>()({
  email: Schema.string,
  password: Schema.string,
}) {}

class LoginResponse extends Schema.Class<LoginResponse>()(
  {
    user: Schema.struct({
      email: Schema.string,
      token: Schema.string,
      username: Schema.string,
      bio: Schema.string,
      image: Image,
    }),
  },
) {}

const Login200 = Schema.transformOrFail(
  LoginResponse,
  User,
  _ => ParseResult.fail(ParseResult.forbidden),
  user => Effect.succeed(new LoginResponse({ user })),
);

const Login = HttpServer.request.schemaBodyUrlParams(LoginBody).pipe(
  Effect.andThen(_ => Session.login(_.email, _.password)),
  Effect.flatMap(_ =>
    HttpServer.response.schemaJson(Login200)(_.user).pipe(
      Effect.andThen(_.setCookie),
    )
  ),
  Effect.andThen(Htmx.navigate("/")),
  Effect.catchTag("UnauthorizedError", _ =>
    Render.fragment(
      <ul id="error-messages" class="error-messages">
        <li>Could not successfully log in</li>
      </ul>,
    ).pipe(
      Effect.map(Htmx.pushUrl(false)),
      Effect.map(Htmx.retarget("#error-messages")),
    )),
);

// ========== POST / =========

class RegisterBody extends Schema.Class<LoginBody>()({
  username: Schema.string,
  email: Schema.string,
  password: Schema.string,
}) {}

const Register = HttpServer.request.schemaBodyUrlParams(RegisterBody).pipe(
  // TODO: Do this right :)
  Effect.andThen(_ => Users.register({ ..._, passwordVerification: _.password })),
  Effect.andThen(Session.make),
  Effect.flatMap(_ =>
    HttpServer.response.schemaJson(Login200)(_.user).pipe(
      Effect.andThen(_.setCookie),
    )
  ),
  Effect.andThen(Htmx.navigate("/")),
  Effect.catchTag("UnauthorizedError", _ =>
    Render.fragment(
      <ul id="error-messages" class="error-messages">
        <li>Could not successfully log in</li>
      </ul>,
    ).pipe(
      Effect.map(Htmx.pushUrl(false)),
      Effect.map(Htmx.retarget("#error-messages")),
    )),
);

export const app = HttpServer.router.empty.pipe(
  HttpServer.router.post("/login", Login),
  HttpServer.router.post("/", Register),
);
