import express from "express";

import usersService from "../services/users.service";

import debug from "debug";

const log: debug.IDebugger = debug("app:users-controller");
class UsersController {
  // TODO need to handle errors and add auth
  async listUsers(req: express.Request, res: express.Response) {
    const users = await usersService.list(100, 0);
    res.status(200).send(users);
  }

  async getUserById(req: express.Request, res: express.Response) {
    const user = await usersService.readById(req.body.id);
    res.status(200).send(user);
  }

  async createUser(req: express.Request, res: express.Response) {
    const userId = await usersService.create(req.body);
    res.status(201).send({ id: userId });
  }

  async patch(req: express.Request, res: express.Response) {
    log(await usersService.patchById(req.body.id, req.body));
    //204 no content
    res.status(204).send();
  }

  async put(req: express.Request, res: express.Response) {
    log(await usersService.putById(req.body.id, req.body));
    res.status(204).send();
  }

  async removeUser(req: express.Request, res: express.Response) {
    log(await usersService.deleteById(req.body.id));
    res.status(204).send();
  }

  async login(req: express.Request, res: express.Response) {
    try{
      const token = await usersService.login(req.body.email, req.body.password)
      res.status(202).send(token)
    }
    catch(e){
      console.error(e)
      res.status(401).send("Login failed.")
    }
  }
}

export default new UsersController();
