/**
 * API Template - Auth microservice server
 */

import express, { Application } from "express";
import cors from "cors";
import nocache from "nocache";
import helmet from "helmet";
import Routes from "./routes/routes";
import CONSTANTS from "./constants";
import { SHARED_CONSTANTS, Database, defaultConnectionParams } from "common";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 20;
process.setMaxListeners(0);

class Server {
  private _app: Application;
  private _port: string;
  private _routes: Routes;
  private _microserviceName: string = "Auth";

  constructor() {
    this._app = express();
    this._app.use(helmet({ hidePoweredBy: true }));
    this._port = CONSTANTS.ENV.PORT;
    this._routes = new Routes(this._app);
    this.init();
  }

  public async listen() {
    const environment = SHARED_CONSTANTS.DATABASES.ENVIRONMENT;
    try {
      await Database.connect(defaultConnectionParams);
      this.initMiddlewares();
      this._routes.init();

      this._app
        .listen(+this._port, "localhost", () => {
          console.log(
            `(${environment}) - Microservice ${this._microserviceName}\tPort: ${this._port}\tVersion: ${CONSTANTS.ENV.API_VERSION}\tStatus: OK`
          );
        })
        .on("error", (e) => {
          console.error(
            `(${environment}) - Microservice ${this._microserviceName}\tPort: ${this._port}\tStatus: KO\tError: ${e.message}`
          );
        });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  }

  private init() {
    this.initMiddlewares();
    this._routes.init();
  }

  private initMiddlewares() {
    this._app.use(cors());
    this._app.use(
      cors({
        origin: "*",
        methods: ["POST"],
        allowedHeaders: ["*", "Content-Type", "Apollo-Require-Preflight"],
        exposedHeaders: ["*", "Content-Range", "X-Content-Range"],
      })
    );
    this._app.use(express.json({ limit: "10mb" }));
    this._app.use(nocache());
  }
}

export default Server;
