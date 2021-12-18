import { describe, expect, it, test } from "@jest/globals";
import supertest from "supertest";
import * as jwt from "jsonwebtoken";

import GenericGQLTests from "./generic.gql.test";
import { UserTokenDto } from "../../interfaces/dtos/user.dtos";

const { JWT_KEY } = process.env;
const { genericTest } = GenericGQLTests;

class UsersGQLTests {
  email = "testemail@gmail.com";
  password = "testpass";
  token: string = "";
  decodedToken: UserTokenDto | null = null;
  signupTest = (request: supertest.SuperTest<supertest.Test>) =>
    describe("signup test", () => {
      test("", async () => {
        await genericTest(
          request,
          `
      mutation {
        create(user: {email: "${this.email}", password: "${this.password}"}){
          email
        }
      }
      `
        );
      });
    });
  loginTest = (request: supertest.SuperTest<supertest.Test>) => {
    describe("login test", () => {
      test("", async () => {
        let res = await genericTest(
          request,
          `
      mutation {
        login(email: "${this.email}", password: "${this.password}")
      }
      `
        );
        this.token = res.body.data.login;
        expect(this.token).toEqual(expect.any(String));
        this.decodedToken = <UserTokenDto>jwt.verify(this.token, JWT_KEY!);
        expect(this.decodedToken).toBeInstanceOf(Object);
      });
    });
  };

  restUserTests = (request: supertest.SuperTest<supertest.Test>) =>
    describe("rest of user tests", () => {
      test("regular listing works", async () => {
        let res = await genericTest(
          request,
          `
          query {
            list {
              email
              _id
          }
      }
    `,
          this.token
        );
        const list = res.body.data.list;
        expect(list.length).toBeGreaterThan(0);
        expect(Object.keys(list[0])).toContain("email");
        expect(Object.keys(list[0])).toContain("_id");
      });
      test("page variable works", async () => {
        let res = await genericTest(
          request,
          `
          query {
            list(limit: 1000, page:500000) {
              email
              _id
          }
      }
    `,
          this.token
        );
        const list = res.body.data.list;
        expect(list.length).toEqual(0);
      });
      test("get by id works", async () => {
        let res = await genericTest(
          request,
          `
          query {
            getById(_id: "${this.decodedToken!._id}") {
              _id
              email
            }
          }
        `,
          this.token,
          200
        );
        const data = res.body.data.getById;
        expect(Object.keys(data)).toContain("email");
        expect(Object.keys(data)).toContain("_id");
      });
      test("get by email works", async () => {
        let res = await genericTest(
          request,
          `
          query {
            getByEmail(email: "${this.decodedToken!.email}") {
              _id
              email
            }
          }
        `,
          this.token,
          200
        );
        const data = res.body.data.getByEmail;
        expect(Object.keys(data)).toContain("email");
        expect(Object.keys(data)).toContain("_id");
      });
      test("update by id works", async () => {
        let res = await genericTest(
          request,
          `
          mutation{
            updateById(_id: "${
              this.decodedToken!._id
            }", user:{firstName: "test"}) {
              firstName
            }
          }
        `,
          this.token,
          200
        );
        const data = res.body.data.updateById;
        expect(Object.keys(data)).toContain("firstName");
        expect(data.firstName).toEqual("test");
      });
      test("update by id false verification doesn't work", async () => {
        await genericTest(
          request,
          `
          mutation{
            updateById(_id: "${
              this.decodedToken!._id
            }", user:{lastName: "test"}) {
              lastName
            }
          }
        `,
          await jwt.sign(
            {
              email: "fake email",
              _id: "fake id",
            },
            JWT_KEY!,
            {
              expiresIn: "1d",
            }
          ),
          401
        );
      });
      test("deletion false verification doesn't work", async () => {
        await genericTest(
          request,
          `
      mutation {
        deleteById(_id: "${this.decodedToken!._id}")
      }
      `,
          await jwt.sign(
            {
              email: "fake email",
              _id: "fake id",
            },
            JWT_KEY!,
            {
              expiresIn: "1d",
            }
          ),
          401
        );
      });
    });

  deleteUserTest = (request: supertest.SuperTest<supertest.Test>) =>
    describe("delete account test", () => {
      test("deletion works properly", async () => {
        await genericTest(
          request,
          `
      mutation {
        deleteById(_id: "${this.decodedToken!._id}")
      }
      `,
          this.token
        );
        await genericTest(
          request,
          `
    mutation {
      deleteById(_id: "${this.decodedToken!._id}")
    }
    `,
          this.token,
          401
        );
      });
    });
}

export default new UsersGQLTests();
