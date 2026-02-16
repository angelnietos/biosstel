import CONSTANTS from "../constants/index";
import crypto from "crypto";

const validatePassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,}$/;
  return {
    isValid: passwordRegex.test(password),
    requirements: {
      hasLowerCase: /[a-z]/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      hasMinLength: password.length >= 10,
    },
  };
};

const encrypt_password_from_secret = async (password: string) => {
  if (!password) {
    return undefined;
  }
  try {
    const secretString = CONSTANTS.ENV.JWT_SECRET as string;
    const hash = crypto
      .pbkdf2Sync(password, secretString, 10000, 64, "sha512")
      .toString("hex");
    return hash;
  } catch (e) {
    return undefined;
  }
};

export default {
  validatePassword,
  encrypt_password_from_secret,
};
