import express from "express";
import * as dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { ApolloError } from "apollo-server-errors";

import { BaseRedisCache } from "apollo-server-cache-redis";

import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import debug from "debug";
import * as jwt from "jsonwebtoken";

import { CommonRoutesConfig } from "./routes/common.routes";
import { UsersRoutes } from "./routes/users.routes";
import graphqlSchema from "./services/gql.service";
import redisService from "./services/redis.service";
import userService from "./services/users.service";
import "./interfaces/express.interface";
import { UserTokenDto } from "./interfaces/dtos/user.dtos";

dotenv.config();

const { JWT_KEY } = process.env;
class App {
  app: express.Application = express();
  server = new ApolloServer({
    typeDefs: graphqlSchema.schema,
    resolvers: graphqlSchema.resolvers,
    cache: new BaseRedisCache({ client: redisService.getRedis() }),
    formatError: (err) => {
      let message = err.message;
      let code = "406";
      if (message.startsWith("E")) {
        // internal mongo error
        message = "Internal server error";
        code = "500";
      } else if (message == "Unauthorized") code = "401";
      return new ApolloError(message, code);
    },
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      try {
        let user: UserTokenDto = <UserTokenDto>jwt.verify(token, JWT_KEY!);
        if (await userService.readById(user._id)) return { user };
      } catch (e) {}
    },
  });
  runInstance: import("http").Server | null = null;
  constructor() {
    const routes: Array<CommonRoutesConfig> = [];
    const userRoutes = new UsersRoutes(this.app);
    routes.push(userRoutes);

    this.server
      .start()
      .then(() => this.server.applyMiddleware({ app: this.app }));

    const port = process.env.PORT || 8080;

    const debugLog: debug.IDebugger = debug("app");

    this.app.use(express.json());
    this.app.use(cors());

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

    this.app.use(expressWinston.logger(loggerOptions));

    //this.app.use(AuthMiddleware.isAuth);

    const runningMessage = `Server running at http://localhost:${port}`;
    this.app.get("/", (req: express.Request, res: express.Response) => {
      res.status(200).send(runningMessage);
    });

    this.app.get(
      "/store/:key",
      (req: express.Request, res: express.Response) => {
        res.status(200).send(runningMessage);
      }
    );

    this.runInstance = this.app.listen(port, () => {
      routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
      });
      console.log(runningMessage);
    });
  }
}

export default new App();
