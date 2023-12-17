import { HttpServer } from "@effect/platform-node";
import { Html } from "@kitajs/html";
import { HomePage } from "components/HomePage.js";
import * as Render from "Render.js";

export const app = HttpServer.router.empty.pipe(
  HttpServer.router.get("/", Render.page(<HomePage />)),
);
