import express from "express";

import * as http from "http";

import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import { CommonRoutesConfig } from "./routes/common.routes";
import { UsersRoutes } from "./routes/users.routes";
import debug from "debug";

import { initRedis } from "./services/redis.service";

//production redis url
// let redis_url = process.env.REDIS_URL;
// if (process.env.ENVIRONMENT === 'development') {
//   require('dotenv').config();
//   redis_url = "redis://127.0.0.1";
// }

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT || 8080;
console.log(process.env.PORT);
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");

app.use(express.json());
app.use(cors());

app.set("redis", initRedis());

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));

routes.push(new UsersRoutes(app));

const runningMessage = `Server running at http://localhost:${port}`;
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

app.get("/store/:key", (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

app.get;

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  console.log(runningMessage);
});
