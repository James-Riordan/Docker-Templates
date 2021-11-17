import { describe, expect, test } from "@jest/globals";
import supertest from "supertest";

import App from "../app";
import { UserTokenDto } from "../interfaces/dtos/user.dtos";
import AppTests from "./app.test";
import UsersGQLTests from "./gql/user.gql.test";

const { loginTest, signupTest, restUserTests, deleteUserTest } = UsersGQLTests;
const { init, destruct } = AppTests;

describe("sequentially run tests", () => {
  init();

  const request = supertest(App.app);

  signupTest(request);
  loginTest(request);
  restUserTests(request);
  deleteUserTest(request);
  destruct();
});
