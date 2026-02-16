class DatabasesConfig {
  public static IS_DEV: boolean = process.env.NODE_ENV !== "production";
  public static ENVIRONMENT: string = this.IS_DEV ? "DEV" : "PROD";

  public static readonly DB_HOST: string =
    process.env.DB_HOST || process.env.MSSQL_HOST || "localhost";
  public static readonly DB_PORT: number = parseInt(
    process.env.DB_PORT || process.env.MSSQL_PORT || "1433",
    10
  );
  public static readonly DB_DATABASE: string =
    process.env.DB_NAME || process.env.MSSQL_DATABASE || "";
  public static readonly DB_USER: string =
    process.env.DB_USER || process.env.MSSQL_USER || "";
  public static readonly DB_PASSWORD: string =
    process.env.DB_PASSWORD || process.env.MSSQL_PASSWORD || "";
}

export default DatabasesConfig;
