import * as redis from "redis";

export const initRedis = () => {
  let client = redis.createClient();

  client.on("connect", () => console.log("Redis Connected!"));
  client.on("error", (err) => console.log("Redis Client Error", err));

  return client;
};


export const getKey = (key) =>
/*client.set("key", "value", redis.print);
client.get("key", redis.print);
*/
