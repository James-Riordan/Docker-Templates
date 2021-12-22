import mongoose from "mongoose";
import debug from "debug";
import dotenv from "dotenv";

const log: debug.IDebugger = debug("app:mongoose-service");

dotenv.config();
const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER, REPLICA_SET } = process.env;
class MongooseService {
  private count = 0;
  private mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    useFindAndModify: false,
  };

  constructor() {
    this.connectWithRetry();
  }

  getMongoose() {
    return mongoose;
  }

  connectWithRetry = () => {
    log("Attempting MongoDB connection (will retry if needed)");
    mongoose
      .connect(
        DB_USER
          ? `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin&replicaSet=${REPLICA_SET}`
          : `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin&replicaSet=${REPLICA_SET}`,
        this.mongooseOptions
      )
      .then(() => {
        log("MongoDB is connected");
        console.log("MongoDB is connected!")
      })
      .catch((err) => {
        const retrySeconds = 5;
        console.log(err);
        console.log(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin&replicaSet=${REPLICA_SET}&authSource=admin`)
      
        log(
          `MongoDB connection unsuccessful (will retry #${++this
            .count} after ${retrySeconds} seconds):`,
          err
        );
        setTimeout(this.connectWithRetry, retrySeconds * 1000);
      });
  };
}
export default new MongooseService();
