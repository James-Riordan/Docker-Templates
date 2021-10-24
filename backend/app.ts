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

const PORT = process.env.PORT || 4000;

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
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

startApolloServer(typeDefs, resolvers);

// const routes: Array<CommonRoutesConfig> = [];
// const debugLog: debug.IDebugger = debug("app");

// routes.push(new UsersRoutes(app));

// const runningMessage = `Server running at http://localhost:${port}`;
// app.get("/", (req: express.Request, res: express.Response) => {
//   res.status(200).send(runningMessage);
// });

// app.get("/store/:key", (req: express.Request, res: express.Response) => {
//   res.status(200).send(runningMessage);
// });

// server.listen(port, () => {
//   routes.forEach((route: CommonRoutesConfig) => {
//     debugLog(`Routes configured for ${route.getName()}`);
//   });
//   console.log(runningMessage);
// });
