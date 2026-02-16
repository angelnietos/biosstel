import { Sequelize } from "sequelize";
import DatabaseConnectionError from "./errors/DatabaseConnectionError";
import SHARED_CONSTANTS from "../constants";
import { DatabaseConnectionParams } from "./shared_database_connection";

const dialect = (process.env.DB_DIALECT || "mssql") as "mssql" | "postgres";

class Database {
  private static _sequelize: Sequelize | undefined;

  public static async connect(params?: DatabaseConnectionParams) {
    try {
      const config = {
        host: params?.host || SHARED_CONSTANTS.DATABASES.DB_HOST,
        port: params?.port || SHARED_CONSTANTS.DATABASES.DB_PORT,
        database: params?.database || SHARED_CONSTANTS.DATABASES.DB_DATABASE,
        username: params?.username || SHARED_CONSTANTS.DATABASES.DB_USER,
        password: params?.password || SHARED_CONSTANTS.DATABASES.DB_PASSWORD,
        dialect,
        logging: false,
        pool: {
          max: 25,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        ...(dialect === "mssql"
          ? {
              dialectOptions: {
                options: {
                  encrypt: false,
                  trustServerCertificate: true,
                },
              },
            }
          : {}),
      };

      this._sequelize = new Sequelize(config as any);

      if ("setMaxListeners" in this._sequelize) {
        (this._sequelize as any).setMaxListeners(0);
      }

      await this._sequelize.authenticate();
      console.log("Database connection established.");
    } catch (error) {
      console.error("Database connection error:", error);
      await this.disconnect();
      throw new DatabaseConnectionError(
        SHARED_CONSTANTS.ERROR_CODES.DATABASE_CONNECTION_ERROR
      );
    }
  }

  public static isConnected(): boolean {
    return this._sequelize !== undefined;
  }

  public static getConnection(): Sequelize {
    if (!this._sequelize) {
      throw new Error("Database not connected. Call Database.connect() first.");
    }
    return this._sequelize;
  }

  public static async disconnect() {
    if (this._sequelize) {
      await this._sequelize.close();
      this._sequelize = undefined;
      console.log("Connection closed.");
    }
  }
}

export default Database;
