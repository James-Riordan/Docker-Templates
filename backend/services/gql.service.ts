import { gql } from "apollo-server-express";
import UsersDao from "../daos/users.dao";
import UsersController from "../controllers/gql/users.gql.controller";

class GQLService {
  schema = gql(
    UsersDao.userGQLSchema +
      `type Query {
      ` +
      UsersController.queries +
      `}
      type Mutation {` +
      UsersController.mutations +
      `}`
  );
  resolvers = {
    Query: UsersController.getQueries(),
    Mutation: UsersController.getMutations(),
  };
}
export default new GQLService();
