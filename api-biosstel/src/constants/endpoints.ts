/**
 * Endpoints for microservices
 */

class ENDPOINTS {
  public static readonly AUTH = {
    LOGIN: "login",
    LOGIN_WITH_AUTH_CODE: "login-with-auth-code",
    LOGIN_WITH_AUTH_CODE_AND_ENCRYPTED_ID: "login-with-auth-code-and-encrypted-id",
    FORGOT_PASSWORD: "forgot-password",
    RESET_PASSWORD: "reset-password",
    VALIDATE_TOKEN: "validate_token",
    REFRESH_TOKEN: "refreshToken",
    SOCIAL_LOGIN: "social_login",
  };
}

export default ENDPOINTS;
