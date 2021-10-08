import UsersDao from "../daos/users.dao";
import { CRUD } from "../interfaces/crud.interface";
import {
  CreateUserDto,
  PatchUserDto,
  PutUserDto,
} from "../interfaces/dtos/user.dtos";
class UsersService implements CRUD {
  async create(resource: CreateUserDto) {
    return UsersDao.addUser(resource);
  }

  async deleteById(id: string) {
    return UsersDao.removeUserById(id);
  }

  async list(limit: number, page: number) {
    return UsersDao.getUsers(limit, page);
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
