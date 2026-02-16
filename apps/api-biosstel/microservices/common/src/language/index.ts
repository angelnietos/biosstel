const en: Record<string, string> = {
  generic_error: "An error occurred",
  ok: "OK",
  user_does_not_exist: "User does not exist",
  user_not_activated: "User not activated",
  organization_deleted: "Organization deleted",
  auth_code_expired: "Auth code expired",
  auth_code_not_active: "Auth code not active",
  auth_code_already_sent: "Auth code already sent",
  auth_code_invalid: "Invalid auth code",
  incorrect_password: "Incorrect password",
  required_fields_error: "Required fields missing",
  error_token_verify: "Token verification failed",
  user_not_found: "User not found",
  error_creating_reset_link: "Error creating reset link",
  passwords_dont_match: "Passwords do not match",
  error_modifying_password: "Error modifying password",
  error_password_requiriments: "Password does not meet requirements",
  error_encrypting_password: "Error encrypting password",
  error_decrypting_id: "Error decrypting id",
  success_email_sent_forgot_password: "Password reset email sent",
  forgot_password_subject: "Password reset",
  forgot_password_content_1: "You requested a password reset.",
  forgot_password_content_2: "Use this link to reset your password:",
  regards: "Regards",
  auth_code_content_1: "Your verification code is:",
  auth_code_content_2: "Code:",
  auth_code_content_3: "Or use this link:",
  send_invitation_subject: "Verification code",
};

const es: Record<string, string> = {
  generic_error: "Ha ocurrido un error",
  ok: "OK",
  user_does_not_exist: "El usuario no existe",
  user_not_activated: "Usuario no activado",
  organization_deleted: "Organización eliminada",
  auth_code_expired: "Código de verificación expirado",
  auth_code_not_active: "Código de verificación no activo",
  auth_code_already_sent: "Código ya enviado recientemente",
  auth_code_invalid: "Código de verificación inválido",
  incorrect_password: "Contraseña incorrecta",
  required_fields_error: "Campos requeridos faltantes",
  error_token_verify: "Error al verificar token",
  user_not_found: "Usuario no encontrado",
  error_creating_reset_link: "Error al crear enlace de restablecimiento",
  passwords_dont_match: "Las contraseñas no coinciden",
  error_modifying_password: "Error al modificar contraseña",
  error_password_requiriments: "La contraseña no cumple los requisitos",
  error_encrypting_password: "Error al encriptar contraseña",
  error_decrypting_id: "Error al desencriptar id",
  success_email_sent_forgot_password: "Email de restablecimiento enviado",
  forgot_password_subject: "Restablecer contraseña",
  forgot_password_content_1: "Solicitaste restablecer tu contraseña.",
  forgot_password_content_2: "Usa este enlace para restablecerla:",
  regards: "Saludos",
  auth_code_content_1: "Tu código de verificación es:",
  auth_code_content_2: "Código:",
  auth_code_content_3: "O usa este enlace:",
  send_invitation_subject: "Código de verificación",
};

class Language {
  public static readonly EN = "en";
  public static readonly ES = "es";

  public static getValue = (language: string, key: string): string => {
    const dict = language === Language.EN ? en : es;
    return dict[key] ?? en.generic_error;
  };
}

export default Language;
