import dotenv from "dotenv";
dotenv.config();

class ENV {
  public static readonly JWT_SIGN_SEED: string =
    process.env.JWT_SIGN_SEED || process.env.JWT_SECRET || "";
  public static readonly JWT_SECRET: string =
    process.env.JWT_SECRET || process.env.JWT_SIGN_SEED || "";
  public static readonly EXPIRING_TIME_JWT: string =
    process.env.EXPIRING_TIME_JWT || "24h";
  public static readonly EXPIRING_TIME_TOKEN: string | number =
    process.env.EXPIRING_TIME_TOKEN || "2D";
  public static readonly API_VERSION: string =
    process.env.API_VERSION || "0.0.1";
}

export default ENV;
