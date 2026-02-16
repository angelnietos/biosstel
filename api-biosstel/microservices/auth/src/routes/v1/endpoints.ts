import Router from "express";
import controller from "../../controllers";
import AuthMiddlewares from "../../middlewares/auth_middlewares";

const router = Router();

router.post("/login", AuthMiddlewares.login, controller.login);
router.post("/login-with-auth-code", controller.loginWithAuthCode);
router.post(
  "/login-with-auth-code-and-encrypted-id",
  controller.loginWithAuthCodeAndEncryptedId
);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);
router.post("/validate_token", controller.validateToken);
router.post("/refreshToken", controller.refreshToken);
router.post("/social_login", controller.socialLogin);

export default router;
