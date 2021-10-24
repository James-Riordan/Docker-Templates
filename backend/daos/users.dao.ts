import {
  CreateUserDto,
  PatchUserDto,
  PutUserDto,
} from "../interfaces/dtos/user.dtos";
import mongooseService from "../services/mongoose.service";

import shortid from "shortid";
import debug from "debug";

import * as bcrypt from "bcrypt"

const log: debug.IDebugger = debug("app:in-memory-dao");
class UsersDao {
  users: Array<CreateUserDto> = [];
  Schema = mongooseService.getMongoose().Schema;
  userSchema = new this.Schema(
    {
      _id: { type: String },
      email: { type: String, required: true, unique: true },
      password: { type: String, select: false },
      firstName: String,
      lastName: String,
      permissionFlags: Number,
    },
    { id: false }
  );
  uniqueFields: Array<string> = ["_id", "email"];
  User: any = undefined
  constructor() {
    log("Created new instance of UsersDao");

    this.userSchema.pre('save', async function(next){
      let user:any = this;
      // only hash the password if it has been modified (or is new)
      if (!user.isModified('password')) return next();
      user.password = await bcrypt.hash(user.password, 10);
      next()

    })
    this.User = mongooseService.getMongoose().model("Users", this.userSchema);
  }

  async addUser(userFields: CreateUserDto) {
    const userId = shortid.generate();
    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionFlags: 1,
    });
    await user.save();
    return await this.getUserById(userId);
  }

  async getUserByEmail(email: string, getPassword?:boolean) {
    return this.User.findOne({ email: email }).select(getPassword?'+password':'').exec();
  }

  async getUserById(userId: string) {
    return this.User.findOne({ _id: userId }).populate("User").exec();
  }

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();

    return existingUser;
  }

  async removeUserById(userId: string) {
    return this.User.deleteOne({ _id: userId }).exec();
  }
}

export default new UsersDao();
