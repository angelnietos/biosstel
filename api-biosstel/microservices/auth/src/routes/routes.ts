import { Application } from "express";
import v1 from "./v1";

class Routes {
  private _app: Application;

  constructor(app: Application) {
    this._app = app;
  }

  public init() {
    this._app.use("/api/v1", v1);
  }
}

export default Routes;
