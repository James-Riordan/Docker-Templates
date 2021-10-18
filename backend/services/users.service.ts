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
    return UsersDao.addUser(resource);
  }

  async deleteById(id: string) {
    return UsersDao.removeUserById(id);
  }

  async list(limit: number, page: number) {
    let res = await redisService
      .getRedis()
      .getAsync("listUsersLimit" + limit + "Page" + page);
    if (res === null) {
      res = UsersDao.getUsers(limit, page);
      redisService
        .getRedis()
        .setex(
          "listUsersLimit" + limit + "Page" + page,
          3600,
          JSON.stringify(res)
        );
    } else res = JSON.parse(res);
    return res;
  }

  async patchById(id: string, resource: PatchUserDto) {
    return UsersDao.updateUserById(id, resource);
  }

  async readById(id: string) {
    return UsersDao.getUserById(id);
  }

  async putById(id: string, resource: PutUserDto) {
    return UsersDao.updateUserById(id, resource);
  }

  async getUserByEmail(email: string) {
    return UsersDao.getUserByEmail(email);
  }
}

export default new UsersService();
