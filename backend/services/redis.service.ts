import Redis from "ioredis";
import debug from "debug";
import dotenv from "dotenv";
import async from "async";
const log: debug.IDebugger = debug("app:redis-service");

// bluebird.promisifyAll(redis.RedisClient.prototype);

dotenv.config();
const { REDIS_HOST, REDIS_MASTER_PASSWORD, REDIS_PORT } = process.env;

class RedisService {
  private client: Redis.Redis;
  private count = 0;
  constructor() {
    // this.client = new Redis(`redis://${REDIS_MASTER_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`)
    this.client = new Redis({
      host: REDIS_HOST,
      password: REDIS_MASTER_PASSWORD,
      port: Number(REDIS_PORT),
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

  async get(key: string): Promise<any> {
    let res = await this.client.get(key);
    if (res) res = JSON.parse(res);
    return res;
  }
  async delete(key: string): Promise<any> {
    return this.client.del(key);
  }
  async set(key: string, value: any, timeLimit: number = 3600) {
    return await this.client.setex(key, timeLimit, JSON.stringify(value));
  }
  async setIdentifiers(
    value: any,
    identifierFields: Array<string>,
    singularPrefix: string,
    timeLimit?: number
  ) {
    for (let identifier of identifierFields) {
      this.set(
        `${singularPrefix} ${identifier} ${value[identifier]}`,
        value,
        timeLimit ? timeLimit : undefined
      );
    }
  }

  // has data for plural, create data for singular
  async getOrSetPlural(
    key: string,
    dbCall: any,
    identifierFields: Array<string>,
    singularPrefix: string,
    timeLimit: number = 3600
  ): Promise<any> {
    let res = await this.get(key);
    if (res === null) {
      res = await dbCall();
      if (res == null) return res;
      this.set(key, res, timeLimit); // setting plural
      for (let obj of res) {
        // setting singular identifiers
        this.setIdentifiers(obj, identifierFields, singularPrefix, timeLimit);
      }
    }
    return res;
  }

  // has data for singular, want to set for all identifiers
  async getOrSetSingular(
    key: string,
    dbCall: any,
    identifierFields: Array<string>,
    singularPrefix: string,
    timeLimit: number = 3600
  ): Promise<any> {
    let res = await this.get(key);
    if (res === null) {
      // setting singular identifiers
      res = await dbCall();
      if (res == null) return res;
      await this.setIdentifiers(
        res,
        identifierFields,
        singularPrefix,
        timeLimit
      );
    }
    return res;
  }

  deletePrefix(prefix: string) {
    let { client } = this;
    client.keys(prefix + "*", function (err, rows) {
      async.each(rows, function (row, callbackDelete) {
        client.del(row, callbackDelete);
      });
    });
  }

  //identifierFields is a list of required fields you can iterate over for the data type

  async deleteBy(
    key: string,
    identifierFields: Array<string>,
    singularPrefix: string,
    pluralPrefix?: string
  ) {
    if (pluralPrefix) this.deletePrefix(pluralPrefix);
    let redisData = await this.get(key);
    if (redisData) {
      for (let field of identifierFields) {
        this.delete(`${singularPrefix} ${field} ${redisData[field]}`);
      }
    }
  }
}

export default new RedisService();
