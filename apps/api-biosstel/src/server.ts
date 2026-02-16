/**
 * GraphQL Server with subgraphs (template - auth only)
 */

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
  ApolloServerPluginInlineTraceDisabled,
  ApolloServerPluginLandingPageDisabled,
} from "@apollo/server/plugin/disabled";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import express, { Application } from "express";
import http from "http";
import cors from "cors";
import gql from "graphql-tag";
import { mergeSchemas } from "@graphql-tools/schema";
import helmet from "helmet";
import SUBGRAPH_CONFIG from "./subgraphs";
import getTokenFromRequest from "./context/getTokenFromRequest";
import ContextValue from "./dataSources/contextValue";
import { AuthAPI } from "./dataSources";
import dotenv from "dotenv";
dotenv.config();

import "./utils/event-emitter-config";

const SUBGRAPH_DATA_SOURCES: Record<string, string[]> = {
  auth: ["authAPI"],
};

const PORT = process.env.GATEWAY_PORT || "8001";
const API_VERSION = "0.0.1";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

class Server {
  private _app: Application;
  private _httpServer: http.Server;
  private _port: string;
  private _servers: Map<string, ApolloServer<ContextValue>> = new Map();

  constructor() {
    this._app = express();
    this._httpServer = http.createServer(this._app);
    this._port = PORT;
    this.init();
  }

  public async listen() {
    console.log("Starting GraphQL Server...");
    await new Promise<void>((resolve) =>
      this._httpServer
        .listen({ port: this._port }, () => {
          console.log(
            `GraphQL Server\tPort: ${this._port}\tVersion: ${API_VERSION}\tStatus: OK`
          );
          resolve();
        })
        .on("error", (e) => {
          console.error(
            `GraphQL Server\tPort: ${this._port}\tStatus: KO\tError: ${e.message}`
          );
        })
    );
  }

  private init() {
    this.initMiddlewares();
    this.initSubgraphs();
    this.setupNotFoundRoutes();
  }

  private initMiddlewares() {
    this._app.use(
      helmet({
        hidePoweredBy: true,
        hsts: { maxAge: IS_PRODUCTION ? 31536000 : 300, includeSubDomains: IS_PRODUCTION, preload: IS_PRODUCTION },
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'none'"],
            scriptSrc: IS_PRODUCTION ? ["'self'"] : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            frameAncestors: ["'none'"],
            formAction: ["'none'"],
            baseUri: ["'self'"],
          },
        },
        crossOriginEmbedderPolicy: false,
        frameguard: { action: "deny" },
        noSniff: true,
        xssFilter: true,
      })
    );
    this._app.use(express.json({ limit: "10mb" }));
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["*", "Content-Type", "Apollo-Require-Preflight"],
        exposedHeaders: ["*", "Content-Range", "X-Content-Range"],
      })
    );
  }

  private async initSubgraphs() {
    const serverPromises = SUBGRAPH_CONFIG.map(async (subgraph) => {
      const baseSchema = subgraph.getSchema();
      const schema = mergeSchemas({
        schemas: [baseSchema],
        typeDefs: gql`
          extend type Query {
            _empty: String
          }
        `,
        resolvers: {
          Query: { _empty: () => "" },
        },
      });

      const server = new ApolloServer<ContextValue>({
        schema,
        introspection: !IS_PRODUCTION,
        csrfPrevention: false,
        formatError: (formattedError, error) => {
          console.error("GraphQL Error:", { message: formattedError.message, path: formattedError.path });
          if (IS_PRODUCTION) {
            return {
              message: formattedError.message,
              extensions: { code: formattedError.extensions?.code || "INTERNAL_SERVER_ERROR" },
            };
          }
          return formattedError;
        },
        plugins: [
          ApolloServerPluginDrainHttpServer({ httpServer: this._httpServer }),
          IS_PRODUCTION ? ApolloServerPluginLandingPageDisabled() : ApolloServerPluginLandingPageLocalDefault(),
          ApolloServerPluginInlineTraceDisabled(),
        ],
      });

      await server.start();
      this._servers.set(subgraph.name, server);
      return { name: subgraph.name, server };
    });

    const servers = await Promise.all(serverPromises);
    servers.forEach(({ name, server }) => this.setupSubgraphRoute(name, server));
  }

  private setupNotFoundRoutes() {
    ["/", "/robots.txt", "/sitemap.xml"].forEach((route) => {
      this._app.get(route, (_req, res) => {
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        res.status(404).json({ error: "Not Found", message: "" });
      });
    });
  }

  private setupSubgraphRoute(subgraphName: string, server: ApolloServer<ContextValue>) {
    const path = `/${subgraphName}`;
    const requiredDataSources: string[] = SUBGRAPH_DATA_SOURCES[subgraphName] || [];

    this._app.use(
      path,
      cors({ origin: ["*"], methods: ["GET", "POST", "OPTIONS"] }),
      express.json({ limit: "10mb" }),
      express.urlencoded({ extended: true }),
      expressMiddleware(server, {
        context: async ({ req }) => {
          const { cache } = server;
          const token = getTokenFromRequest(req);
          const dataSources: any = {};
          if (requiredDataSources.includes("authAPI")) {
            dataSources.authAPI = new AuthAPI({ token, cache });
          }
          return { dataSources };
        },
      })
    );
  }
}

export default Server;
