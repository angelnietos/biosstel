/**
 * API Template - Shared library for microservices
 */

import SHARED_CONSTANTS from "./src/constants";
import Database from "./src/database/database";
import DatabaseConnectionError from "./src/database/errors/DatabaseConnectionError";
import {
  defaultConnectionParams,
} from "./src/database/shared_database_connection";
import Language from "./src/language";
import { DefaultRequestMiddlewares } from "./src/middlewares";
import SHARED_MODELS from "./src/models";
import { IAuthCode } from "./src/models/auth/auth.model";
import ResponseModel from "./src/utils/response_model";
import ExecMainResponseModel from "./src/utils/exec_main_response_model";
import getTokenFromHeader from "./src/utils/get_token_from_header";
import mailer from "./src/utils/mailer";
import TokenHandler from "./src/utils/token_handler";
import cryptoHandler from "./src/utils/crypto_handler";
import password_handler from "./src/utils/password_handler";

export {
  SHARED_CONSTANTS,
  Database,
  DatabaseConnectionError,
  defaultConnectionParams,
  DefaultRequestMiddlewares,
  Language,
  ResponseModel,
  ExecMainResponseModel,
  getTokenFromHeader,
  mailer,
  TokenHandler,
  cryptoHandler,
  password_handler,
  SHARED_MODELS,
  IAuthCode,
};
