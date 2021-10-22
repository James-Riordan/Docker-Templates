import { SchemaComposer } from "graphql-compose";
import UserController from "../controllers/users.controller";

const schemaComposer = new SchemaComposer();
const { UserQuery, UserMutation } = UserController;

schemaComposer.Query.addFields({ ...UserQuery });
schemaComposer.Mutation.addFields({ ...UserMutation });

export default schemaComposer.buildSchema();
