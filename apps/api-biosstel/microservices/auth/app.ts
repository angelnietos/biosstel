/**
 * API Template - Auth microservice entry point
 */

import "dotenv/config";
import Server from "./src/server";

const server: Server = new Server();

server.listen();
