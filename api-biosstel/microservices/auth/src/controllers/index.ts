import login from "./post/login";
import loginWithAuthCode from "./post/loginWithAuthCode";
import loginWithAuthCodeAndEncryptedId from "./post/loginWithAuthCodeAndEncryptedId";
import forgotPassword from "./post/forgotPassword";
import resetPassword from "./post/resetPassword";
import validateToken from "./post/validateToken";
import refreshToken from "./post/refreshToken";
import socialLogin from "./post/socialLogin";

export default {
  login,
  loginWithAuthCode,
  loginWithAuthCodeAndEncryptedId,
  forgotPassword,
  resetPassword,
  validateToken,
  refreshToken,
  socialLogin,
};
