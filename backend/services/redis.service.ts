import * as redis from "redis";
import bluebird from "bluebird";
import debug from "debug";

const log: debug.IDebugger = debug("app:redis-service");

bluebird.promisifyAll(redis.RedisClient.prototype);

class RedisService {
  private client: any;
  private count = 0;
  constructor() {
    this.client = redis.createClient();
    this.connectWithRetry();
  }
  getRedis() {
    return this.client;
  }
  connectWithRetry = () => {
    this.client.on("connect", () => console.log("Redis Connected!"));
    this.client.on("error", (err: Error) => {
      const retrySeconds = 5;
      console.log(err);
      log(
        `Redis connection unsuccessful (will retry #${++this
          .count} after ${retrySeconds} seconds):`,
        err
      );
      this.client = redis.createClient();
      setTimeout(this.connectWithRetry, retrySeconds * 1000);
    });
  };
}
export const initRedis = () => {
  let client = redis.createClient();

  client.on("connect", () => log("Redis Connected!"));
  client.on("error", (err) => {
    log("Redis Client Error", err);
  });
};

export default new RedisService();
