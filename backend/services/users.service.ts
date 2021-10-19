import UsersDao from "../daos/users.dao";
import { CRUD } from "../interfaces/crud.interface";
import {
  CreateUserDto,
  PatchUserDto,
  PutUserDto,
} from "../interfaces/dtos/user.dtos";
import redisService from "./redis.service";

class UsersService implements CRUD {
  async create(resource: CreateUserDto) {
    const res = await UsersDao.addUser(resource);
    redisService.setIdentifiers(res, UsersDao.uniqueFields, "user");
    return res;
  }

  async deleteById(id: string) {
    redisService.deleteBy(
      `user _id ${id}`,
      UsersDao.uniqueFields,
      "user",
      "users"
    );
    const res = await UsersDao.removeUserById(id);
    return res;
  }

  async list(limit: number, page: number) {
    return await redisService.getOrSetPlural(
      `users limit ${limit} page ${page}`,
      async () => await UsersDao.getUsers(limit, page),
      UsersDao.uniqueFields,
      "user"
    );
  }

  async readById(id: string) {
    return await redisService.getOrSetSingular(
      `user _id ${id}`,
      async () => await UsersDao.getUserById(id),
      UsersDao.uniqueFields,
      "user"
    );
  }

  async patchById(id: string, resource: PatchUserDto) {
    redisService.deletePrefix("users");
    const res = await UsersDao.updateUserById(id, resource);
    redisService.setIdentifiers(res, UsersDao.uniqueFields, "user");
    return res;
  }

  async putById(id: string, resource: PutUserDto) {
    redisService.deletePrefix("users");
    const res = await UsersDao.updateUserById(id, resource);
    redisService.setIdentifiers(res, UsersDao.uniqueFields, "user");
    return res;
  }

  async getUserByEmail(email: string) {
    return await redisService.getOrSetSingular(
      `user email ${email}`,
      async () => await UsersDao.getUserByEmail(email),
      UsersDao.uniqueFields,
      "user"
    );
  }
}

export default new UsersService();
