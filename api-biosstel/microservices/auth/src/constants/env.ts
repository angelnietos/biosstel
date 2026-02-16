import { SHARED_CONSTANTS } from "common";

class ENV {
  public static readonly API_VERSION: string = "0.0.1";
  public static readonly PORT: string =
    process.env.MS_AUTH_PORT || process.env.PORT || "5001";
  public static readonly JWT_SIGN_SEED: string =
    SHARED_CONSTANTS.ENV.JWT_SIGN_SEED;
}

export default ENV;
