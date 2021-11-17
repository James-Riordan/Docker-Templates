import usersService from "../../services/users.service";
import UsersDao from "../../daos/users.dao";

import argon2 from "argon2";

import debug from "debug";
import { CreateUserDto, PutUserDto } from "../../interfaces/dtos/user.dtos";

const log: debug.IDebugger = debug("app:users-controller");

class UsersController {
  queries = `
  list(limit: Int, page:Int): [User]
  getById(_id: String): User
  getByEmail(email: String): User
`;
  mutations = `
  create(user:UserCreate): User
  login(email: String, password:String): String!
  deleteById(_id: String): String
  updateById(_id: String, user:UserMutation): User`;

  getQueries() {
    return {
      list: this.list,
      getById: this.getById,
      getByEmail: this.getByEmail,
    };
  }

  getMutations() {
    return {
      create: this.create,
      login: this.login,
      deleteById: this.deleteById,
      updateById: this.updateById,
    };

    // TODO need to handle errors and add auth
  }
  list(_: any, data: { limit: number; page: number }, context: any) {
    if (!context.user) throw new Error("Unauthorized");
    return usersService.list(data.limit, data.page);
  }
  getById(_: any, data: { _id: string }, context: any) {
    if (!context.user) throw new Error("Unauthorized");
    return usersService.readById(data._id);
  }
  getByEmail(_: any, data: { email: string }, context: any) {
    if (!context.user) throw new Error("Unauthorized");
    return usersService.getUserByEmail(data.email);
  }
  create(_: any, data: { user: CreateUserDto }, context: any) {
    return usersService.create(data.user);
  }
  login(_: any, data: { email: string; password: string }, context: any) {
    return usersService.login(data.email, data.password);
  }
  deleteById(_: any, data: { _id: string }, context: any) {
    if (!context.user || context.user._id != data._id)
      throw new Error("Unauthorized");
    return usersService.deleteById(data._id);
  }
  updateById(_: any, data: { _id: string; user: PutUserDto }, context: any) {
    if (!context.user || context.user._id != data._id)
      throw new Error("Unauthorized");
    return usersService.updateById(data._id, data.user);
  }
}
export default new UsersController();
