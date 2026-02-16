class ErrorCodes {
  public static readonly DATABASE_CONNECTION_ERROR: string =
    "database_connection_error";
  public static readonly GENERIC_ERROR: string = "generic_error";
  public static readonly REQUIRED_FIELDS_ERROR: string = "required_fields_error";
  public static readonly USER_DOES_NOT_EXIST: string = "user_does_not_exist";
  public static readonly USER_NOT_ACTIVATED: string = "user_not_activated";
  public static readonly ORGANIZATION_DELETED: string = "organization_deleted";
  public static readonly AUTH_CODE_EXPIRED: string = "auth_code_expired";
  public static readonly AUTH_CODE_NOT_ACTIVE: string = "auth_code_not_active";
  public static readonly AUTH_CODE_ALREADY_SENT: string = "auth_code_already_sent";
  public static readonly AUTH_CODE_INVALID: string = "auth_code_invalid";
  public static readonly INCORRECT_PASSWORD: string = "incorrect_password";
  public static readonly TOKEN_VERIFICATION: string = "error_token_verify";
  public static readonly USER_NOT_FOUND: string = "user_not_found";
  public static readonly ERROR_CREATING_RESET_LINK: string =
    "error_creating_reset_link";
  public static readonly PASSWORDS_DONT_MATCH: string = "passwords_dont_match";
  public static readonly ERROR_MODIFYING_PASSWORD: string =
    "error_modifying_password";
  public static readonly ERROR_PASSWORD_REQUIRIMENTS: string =
    "error_password_requiriments";
  public static readonly ERROR_ENCRYPTING_PASSWORD: string =
    "error_encrypting_password";
  public static readonly ERROR_DECRYPTING_ID: string = "error_decrypting_id";
  public static readonly USER_NOT_ACTIVE: string = "user_not_active";
  public static readonly SOCIAL_LOGIN_ERROR: string = "social_login_error";
  public static readonly USER_UPDATE: string = "error_update_user";
  public static readonly SERVER_ERROR: string = "server_error";
}

export default ErrorCodes;
