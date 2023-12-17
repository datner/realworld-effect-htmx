import { NodeContext, Runtime } from "@effect/platform-node";
import { Cause, Config, ConfigProvider, Effect, Layer, Logger, ReadonlyArray, ReadonlyRecord } from "effect";
import { inspect } from "node:util";
import { Users } from "services/prelude.js";
import * as Router from "./Router.js";
import * as Server from "./Server.js";

const ServerLive = Server.layer({
  port: Config.number("port"),
});

const provider = ConfigProvider.fromEnv().pipe(
  ConfigProvider.constantCase,
);

const simpleLogger = Logger.mapInput(
  Logger.make(m => {
    console.group(m.date);
    console.log(typeof m.message === "string" ? m.message : inspect(m.message, false, 11, true));
    console.log(Cause.pretty(m.cause));
    console.group("annotations");
    console.log(inspect(ReadonlyRecord.fromEntries(m.annotations), false, 5, true));
    console.groupEnd();
    console.group("spans");
    console.log(inspect(ReadonlyArray.fromIterable(m.spans), false, 5, true));
    console.groupEnd();
    console.groupEnd();
    return m;
  }),
  _ => {
    if (typeof _ === "object" && _ != null && "authorization" in _) {
      const { authorization, ...rest } = _;
      return { authorization: "Bearer [redacted]", ...rest };
    }
    return _;
  },
);

const context = Layer.mergeAll(
  Users.layer,
  NodeContext.layer,
  ServerLive,
);

const HttpLive = Router.serve.pipe(
  Layer.provide(context),
  Layer.provide(Layer.setConfigProvider(provider)),
  Layer.provide(Logger.replace(Logger.defaultLogger, simpleLogger)),
);

Layer.launch(HttpLive).pipe(
  Effect.tapErrorCause(Effect.logError),
  Runtime.runMain,
);
