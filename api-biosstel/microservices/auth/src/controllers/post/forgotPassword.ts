import { Request, Response } from "express";
import {
  ExecMainResponseModel,
  Language,
  ResponseModel,
  SHARED_CONSTANTS,
  mailer,
  cryptoHandler,
  SHARED_MODELS,
  Database,
} from "common";
import { AuthService } from "../../services/auth/auth.service";
import CONSTANTS from "../../constants";

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const languageCode: string = (req.headers.language as string) || "es";
  let statusCode: number;
  let response: ResponseModel;

  try {
    const execMainResponse: ExecMainResponseModel = await execMain(
      req,
      languageCode
    );
    statusCode = execMainResponse.statusCode;
    response = execMainResponse.response;
  } catch (error) {
    statusCode = 500;
    response = new ResponseModel(
      false,
      Language.getValue(
        languageCode,
        SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR
      ),
      null,
      error,
      CONSTANTS.ENV.API_VERSION
    );
  }
  res
    .status(statusCode)
    .json(response === null ? null : response.toJson())
    .send();
};

const execMain = async (req: Request, languageCode: string) => {
  const { email } = req.body;
  const authService = new AuthService();
  const sequelize = Database.getConnection();
  const User = SHARED_MODELS(sequelize).sequelizeModels.User;
  if (!User) {
    return new ExecMainResponseModel(
      501,
      new ResponseModel(
        false,
        Language.getValue(languageCode, SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR),
        null,
        "User model not configured",
        CONSTANTS.ENV.API_VERSION
      )
    );
  }
  const userData = await User.findOne({ where: { Email: email } });
  const user = userData?.dataValues ?? userData;

  if (!user || !user.Id_User) {
    return errorResponse(
      401,
      languageCode,
      SHARED_CONSTANTS.ERROR_CODES.USER_NOT_FOUND,
      SHARED_CONSTANTS.ERROR_CODES.USER_NOT_FOUND
    );
  }

  const encryptedUserId = cryptoHandler.encrypt(user.Id_User);
  if (!encryptedUserId) {
    return errorResponse(
      401,
      languageCode,
      SHARED_CONSTANTS.ERROR_CODES.ERROR_CREATING_RESET_LINK,
      SHARED_CONSTANTS.ERROR_CODES.ERROR_CREATING_RESET_LINK
    );
  }

  const settedResetPassword = await authService.setResetPassword(
    user.Id_User,
    encryptedUserId
  );
  if (!settedResetPassword) {
    return errorResponse(
      401,
      languageCode,
      SHARED_CONSTANTS.ERROR_CODES.ERROR_CREATING_RESET_LINK,
      SHARED_CONSTANTS.ERROR_CODES.ERROR_CREATING_RESET_LINK
    );
  }

  const resetLink =
    SHARED_CONSTANTS.DEVELOPMENT_KEYS.FRONTEND_URL +
    `/reset-password?e=` +
    encryptedUserId;

  const emailContent = await mailer.getForgotPasswordEmailContent(
    languageCode,
    resetLink
  );
  const mailerResponse = await mailer.sendEmail(
    mailer.getMailerEmail(),
    [email],
    [],
    Language.getValue(
      languageCode,
      SHARED_CONSTANTS.DEVELOPMENT_KEYS.FORGOT_PASSWORD_SUBJECT
    ),
    emailContent.html,
    emailContent.plainText
  );

  if (!mailerResponse.success) {
    return errorResponse(
      500,
      languageCode,
      SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR,
      mailerResponse.error
    );
  }

  return new ExecMainResponseModel(
    200,
    new ResponseModel(
      true,
      Language.getValue(languageCode, SHARED_CONSTANTS.STRING_CODES.OK),
      {
        success: true,
        message: Language.getValue(
          languageCode,
          SHARED_CONSTANTS.STRING_CODES.SUCCESS_EMAIL_SENT_FORGOT_PASSWORD
        ),
      },
      null,
      CONSTANTS.ENV.API_VERSION
    )
  );
};

const errorResponse = (
  httpStatusCode: number,
  languageCode: string,
  message: string,
  error: string
) =>
  new ExecMainResponseModel(
    httpStatusCode,
    new ResponseModel(
      false,
      Language.getValue(languageCode, message),
      null,
      Language.getValue(languageCode, error),
      CONSTANTS.ENV.API_VERSION
    )
  );

export default forgotPassword;
