import {
  CreateUserDto,
  PatchUserDto,
  PutUserDto,
} from "../interfaces/dtos/user.dtos";
import mongooseService from "../services/mongoose.service";

//import { composeWithMongoose } from "graphql-compose-mongoose";
import shortid from "shortid";
import debug from "debug";
import * as bcrypt from "bcrypt";

const log: debug.IDebugger = debug("app:in-memory-dao");
const { HASH_KEY } = process.env;

class UsersDao {
  users: Array<CreateUserDto> = [];
  Schema = mongooseService.getMongoose().Schema;
  userSchema = new this.Schema(
    {
      _id: { type: String },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true, select: false },
      firstName: String,
      lastName: String,
      permissionFlags: Number,
    },
    { id: false }
  );
  userGQLSchema = `type User {
    _id: ID!
    email: String!
    firstName: String
    lastName: String
    permissionFlags: Int
  }
  input UserCreate {
    email: String!
    password: String!
    firstName: String
    lastName: String
  }
  input UserMutation {
    email: String
    password: String
    firstName: String
    lastName: String
  }
  `;
  User = mongooseService.getMongoose().model("Users", this.userSchema);
  uniqueFields: Array<string> = ["_id", "email"];

  constructor() {
    log("Created new instance of UsersDao");
  }

  async addUser(userFields: CreateUserDto) {
    const userId = shortid.generate();
    userFields.password = await bcrypt.hash(userFields.password, HASH_KEY!);
    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionFlags: 1,
    });
    await user.save();
    return await this.getUserById(userId);
  }

  async getUserByEmail(email: string, password = false) {
    let query = this.User.findOne({ email: email });
    if (password) query.select("+password");
    return query.exec();
  }

  async getUserById(userId: string, password = false) {
    let query = this.User.findOne({ _id: userId }).populate("User");
    if (password) query.select("+password");
    return query.exec();
  }

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
    if (userFields.password)
      userFields.password = await bcrypt.hash(userFields.password, HASH_KEY!);
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true, runValidators: true }
    ).exec();
    return existingUser;
  }

  async removeUserById(userId: string) {
    return this.User.deleteOne({ _id: userId }).exec();
  }
}

export default new UsersDao();
