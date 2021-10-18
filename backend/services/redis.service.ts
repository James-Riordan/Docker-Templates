import Redis from "ioredis";
import debug from "debug";
import dotenv from "dotenv";

const log: debug.IDebugger = debug("app:redis-service");

// bluebird.promisifyAll(redis.RedisClient.prototype);

dotenv.config();
const { REDIS_HOST, REDIS_MASTER_PASSWORD } = process.env;

class RedisService {
  private client: Redis.Redis;
  private count = 0;
  constructor() {
    this.client = new Redis({
      host: REDIS_HOST,
      password: REDIS_MASTER_PASSWORD,
      retryStrategy(times) {
        const delay = Math.min(times * 500, 20000);
        return delay;
      },
    });
    this.client.on("connect", () => log("Redis Connected!"));
  }
  getRedis(): Redis.Redis {
    return this.client;
  }

  async getOrSet(key: string, dbCall: any, timeLimit: number = 3600) {
    let res = await this.client.get(key);
    console.log(res);
    if (res === null) {
      res = await dbCall();
      this.client.setex(key, timeLimit, JSON.stringify(res));
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
