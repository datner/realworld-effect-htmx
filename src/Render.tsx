import { HttpServer } from "@effect/platform-node";
import { Html } from "@kitajs/html";
import { Footer } from "components/Footer.js";
import { Header } from "components/Header.js";
import { Page } from "components/Page.js";
import { Effect, Option } from "effect";
import * as Htmx from "Htmx.js";

export const fragment = (body: JSX.Element) =>
  Effect.andThen(
    Effect.promise(async () => body),
    _ => HttpServer.response.text(_, { contentType: "text/html" }),
  );

export const fragmentEffect = <R, E>(body: Effect.Effect<R, E, JSX.Element>) => Effect.andThen(body, fragment);

export const page = (body: JSX.Element) =>
  HttpServer.request.ServerRequest.pipe(
    Effect.map(_ => (
      <Page>
        <Header active={_.url} />
        <main>
          {body}
        </main>
        <Footer />
      </Page>
    )),
    Effect.whenEffect(Effect.negate(Htmx.HxRequest)),
    Effect.map(Option.getOrElse(() => body)),
    Effect.flatMap(fragment),
  );

export const pageEffect = <R, E>(body: Effect.Effect<R, E, JSX.Element>) => Effect.andThen(body, page);
