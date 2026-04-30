import "dotenv/config";
import http from "node:http";

import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import express from "express";

import { createContext, type GraphQLContext } from "./context.js";
import { resolvers, typeDefs } from "./graphql.js";

async function bootstrap() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: createContext,
    }),
  );

  const port = Number(process.env.PORT ?? 3333);
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  console.log(`Servidor GraphQL iniciado em http://localhost:${port}/graphql`);
}

bootstrap().catch((error) => {
  console.error("Falha ao iniciar servidor:", error);
  process.exit(1);
});
