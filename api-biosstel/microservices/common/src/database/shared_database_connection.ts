export interface DatabaseConnectionParams {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export const defaultConnectionParams: DatabaseConnectionParams = {
  host: process.env.DB_HOST || process.env.MSSQL_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || process.env.MSSQL_PORT || "1433", 10),
  database: process.env.DB_NAME || process.env.MSSQL_DATABASE || "",
  username: process.env.DB_USER || process.env.MSSQL_USER || "",
  password: process.env.DB_PASSWORD || process.env.MSSQL_PASSWORD || "",
};

export default defaultConnectionParams;
