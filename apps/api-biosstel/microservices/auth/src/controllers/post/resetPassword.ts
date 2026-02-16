import { Request, Response } from "express";
import {
  ExecMainResponseModel,
  Language,
  ResponseModel,
  SHARED_CONSTANTS,
  cryptoHandler,
  password_handler,
} from "common";
import { AuthService } from "../../services/auth/auth.service";
import CONSTANTS from "../../constants";

const resetPassword = async (req: Request, res: Response): Promise<void> => {
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
  const { encryptedId, newPassword, repeatedPassword } = req.body;
  const authService = new AuthService();

  if (newPassword !== repeatedPassword) {
    return errorResponse(
      401,
      languageCode,
      SHARED_CONSTANTS.ERROR_CODES.PASSWORDS_DONT_MATCH,
      SHARED_CONSTANTS.ERROR_CODES.PASSWORDS_DONT_MATCH
    );
  }

  const validation = password_handler.validatePassword(newPassword);
  if (!validation.isValid) {
    return errorResponse(
      401,
      languageCode,
      SHARED_CONSTANTS.ERROR_CODES.ERROR_MODIFYING_PASSWORD,
      SHARED_CONSTANTS.ERROR_CODES.ERROR_PASSWORD_REQUIRIMENTS,
      validation.requirements
    );
  }

  const encriptedPassword = await password_handler.encrypt_password_from_secret(
    newPassword
  );
  if (!encriptedPassword || typeof encriptedPassword !== "string") {
    return errorResponse(
      401,
      languageCode,
      SHARED_CONSTANTS.ERROR_CODES.ERROR_MODIFYING_PASSWORD,
      SHARED_CONSTANTS.ERROR_CODES.ERROR_ENCRYPTING_PASSWORD
    );
  }

  let userId = "";
  try {
    userId = cryptoHandler.decrypt(encryptedId);
  } catch (error: any) {
    return errorResponse(
      401,
      languageCode,
      SHARED_CONSTANTS.ERROR_CODES.ERROR_MODIFYING_PASSWORD,
      SHARED_CONSTANTS.ERROR_CODES.ERROR_DECRYPTING_ID,
      error?.message
    );
  }

  if (!userId) {
    return errorResponse(
      401,
      languageCode,
      SHARED_CONSTANTS.ERROR_CODES.ERROR_MODIFYING_PASSWORD,
      SHARED_CONSTANTS.ERROR_CODES.ERROR_DECRYPTING_ID
    );
  }

  const updated = await authService.updatePassword(
    userId,
    encryptedId,
    encriptedPassword
  );
  if (!updated) {
    return errorResponse(
      401,
      languageCode,
      SHARED_CONSTANTS.ERROR_CODES.ERROR_MODIFYING_PASSWORD,
      SHARED_CONSTANTS.ERROR_CODES.ERROR_MODIFYING_PASSWORD
    );
  }

  return new ExecMainResponseModel(
    200,
    new ResponseModel(
      true,
      Language.getValue(languageCode, SHARED_CONSTANTS.STRING_CODES.OK),
      { success: true, message: "Password reset successfully" },
      null,
      CONSTANTS.ENV.API_VERSION
    )
  );
};

const errorResponse = (
  httpStatusCode: number,
  languageCode: string,
  message: string,
  error: string,
  data: any = null
) =>
  new ExecMainResponseModel(
    httpStatusCode,
    new ResponseModel(
      false,
      Language.getValue(languageCode, message),
      data,
      Language.getValue(languageCode, error),
      CONSTANTS.ENV.API_VERSION
    )
  );

export default resetPassword;
