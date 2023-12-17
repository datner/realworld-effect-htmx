import { HttpServer } from "@effect/platform-node";
import { Html } from "@kitajs/html";
import { LoginPage } from "components/LoginPage.js";
import { RegisterPage } from "components/RegisterPage.js";
import * as Render from "Render.js";

export const app = HttpServer.router.empty.pipe(
  HttpServer.router.get("/login", Render.page(<LoginPage />)),
  HttpServer.router.get("/register", Render.page(<RegisterPage />)),
);
