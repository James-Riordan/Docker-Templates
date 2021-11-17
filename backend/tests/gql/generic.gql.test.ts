import { expect } from "@jest/globals";
import supertest from "supertest";

class GenericGQLTests {
  genericTest = async (
    request: supertest.SuperTest<supertest.Test>,
    query: String,
    token: string = "",
    code: Number = 200
  ) => {
    let res = await request
      .post("/graphql")
      .send({
        query: query,
      })
      .set("Accept", "application/json")
      .set("authorization", token)
      .expect("Content-Type", /json/);
    if (code == 200 && res.body) {
      expect(res.status).toEqual(200);
      expect(res.body.errors).toEqual(undefined);
    } else if (code != 200) {
      expect(res.body.errors);
      expect(res.body.errors[0].extensions.code).toEqual(code.toString());
    }
    return res;
  };
}

export default new GenericGQLTests();
