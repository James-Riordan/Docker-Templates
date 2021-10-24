import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import typeDefs from "./GQL/typedefs";
import resolvers from "./GQL/resolvers";
import express from "express";
import http from "http";

import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import { CommonRoutesConfig } from "./routes/common.routes";
import { UsersRoutes } from "./routes/users.routes";
import debug from "debug";

const PORT = process.env.PORT || 8000;

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

async function startApolloServer(typeDefs: any, resolvers: any) {
  const app: express.Application = express();
  app.use(expressWinston.logger(loggerOptions));
  app.use(express.json());
  app.use(cors());
  const routes: Array<CommonRoutesConfig> = [];
  const userRoutes = new UsersRoutes(app);
  routes.push(userRoutes);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
  await new Promise<void>((resolve) =>
    app.listen({ port: PORT }, resolve)
  );
  const runningMessage=(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(runningMessage)
  app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage);
  });
}

startApolloServer(typeDefs, resolvers);
