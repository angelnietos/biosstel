class DEVELOPMENT_KEYS {
  public static readonly FRONTEND_URL: string =
    process.env.FRONTEND_URL || "http://localhost:4041";
  public static readonly FRONTEND_VERIFY_CODE_URL: string =
    process.env.FRONTEND_VERIFY_CODE_URL || `${this.FRONTEND_URL}/verify-code`;

  public static readonly MAILER_HOST: string =
    process.env.MAILER_HOST || "smtp.example.com";
  public static readonly MAILER_PORT: number = parseInt(
    process.env.MAILER_PORT || "465",
    10
  );
  public static readonly MAILER_USER: string =
    process.env.MAILER_USER || "";
  public static readonly MAILER_PASS: string =
    process.env.MAILER_PASS || "";

  public static readonly FORGOT_PASSWORD_SUBJECT: string =
    "forgot_password_subject";
  public static readonly FORGOT_PASSWORD_CONTENT_1: string =
    "forgot_password_content_1";
  public static readonly FORGOT_PASSWORD_CONTENT_2: string =
    "forgot_password_content_2";
  public static readonly REGARDS: string = "regards";
  public static readonly AUTH_CODE_CONTENT_1: string = "auth_code_content_1";
  public static readonly AUTH_CODE_CONTENT_2: string = "auth_code_content_2";
  public static readonly AUTH_CODE_CONTENT_3: string = "auth_code_content_3";
  public static readonly SEND_INVITATION_SUBJECT: string =
    "send_invitation_subject";
  public static readonly SEND_INVITATION_FAILED: string = "send_invitation_failed";
}

export default DEVELOPMENT_KEYS;
