import { HttpServer } from "@effect/platform-node";
import * as Authentication from "apps/Authentication.js";
import * as Root from "apps/Root.js";
import * as User from "apps/User.js";
import * as Users from "apps/Users.js";
import * as Pocketbase from "services/Pocketbase.js";

export const api = HttpServer.router.empty.pipe(
  HttpServer.router.mount("/user", User.app),
  HttpServer.router.mount("/users", Users.app),
);

export const serve = HttpServer.router.empty.pipe(
  HttpServer.router.concat(Root.app),
  HttpServer.router.concat(Authentication.app),
  HttpServer.router.get("/favicon.ico", HttpServer.response.file("favicon.ico")),
  HttpServer.router.mount("/api", api),
  HttpServer.router.use(Pocketbase.middleware),
  HttpServer.server.serve(HttpServer.middleware.logger),
);
