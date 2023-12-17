import { Schema } from "@effect/schema";
import { String } from "effect";

export const Image = Schema.transform(
  Schema.string,
  Schema.nullable(Schema.string),
  _ => String.isNonEmpty(_) ? _ : null,
  _ => String.isString(_) ? _ : "",
);

export class User extends Schema.Class<User>()({
  collectionId: Schema.literal("_pb_users_auth_"),
  collectionName: Schema.literal("users"),
  id: Schema.string,
  email: Schema.string,
  emailVisibility: Schema.boolean,
  token: Schema.string,
  username: Schema.string,
  bio: Schema.string,
  image: Image,
  verified: Schema.boolean,
}) {
  _tag = "User";
  static parse = Schema.parse(this);
  static decode = Schema.decode(this);
}
