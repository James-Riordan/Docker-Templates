import Redis from "ioredis";
import bluebird from "bluebird";
import debug from "debug";
import dotenv from "dotenv";

const log: debug.IDebugger = debug("app:redis-service");

// bluebird.promisifyAll(redis.RedisClient.prototype);

dotenv.config();
const { REDIS_MASTER_PASSWORD } = process.env;

class RedisService {
  private client: Redis.Redis | undefined;
  private count = 0;
  constructor() {
    this.connectWithRetry();
  }
  getRedis(): Redis.Redis {
    console.log(Object.getOwnPropertyNames(this.client!));
    return this.client!;
  }
  connectWithRetry = () => {
    this.client = new Redis({
      password: REDIS_MASTER_PASSWORD,
    });
    this.client.on("connect", () => log("Redis Connected!"));
    this.client.on("error", (err: Error) => {
      const retrySeconds = 5;
      console.error(err);
      log(
        `Redis connection unsuccessful (will retry #${++this
          .count} after ${retrySeconds} seconds):`,
        err
      );
      setTimeout(this.connectWithRetry, retrySeconds * 1000);
    });
  };

  async getOrSet(key: string, dbCall: any, timeLimit: number = 3600) {
    let res = await this.client!.get(key);
    console.log(res);
    if (res === null) {
      res = await dbCall();
      this.client!.setex(key, timeLimit, JSON.stringify(res));
    } else res = JSON.parse(res);
    return res;
  }
}

/*deletePrefix(){ //TODO https://athlan.pl/redis-delete-keys-prefix-nodejs/ https://hub.docker.com/r/bitnami/redis/
    this.redis.RedisClient.prototype.delWildcard = function(key, callback) {
      var redis = this
    
      redis.keys(key, function(err, rows) {
        async.each(rows, function(row, callbackDelete) {
          redis.del(row, callbackDelete)
        }, callback)
      });
    }
  }*/

export default new RedisService();
