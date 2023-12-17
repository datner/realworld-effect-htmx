import { Schema } from "@effect/schema";
import { RecordService } from "pocketbase";
import { User } from "./User.ts";

interface UserRecord extends Omit<Schema.Schema.From<typeof User>, "token"> {}
declare module "services/Pocketbase.js" {
  interface Client {
    collection(idOrName: "users"): RecordService<UserRecord>;
  }
}
