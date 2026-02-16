import {
  ExecMainResponseModel,
  Language,
  ResponseModel,
  SHARED_CONSTANTS,
  TokenHandler,
} from "common";
import CONSTANTS from "../../constants";
import { Request, Response } from "express";
import { AuthService } from "../../services/auth/auth.service";

const loginWithAuthCodeAndEncryptedId = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  const authService = new AuthService();
  const authCodeResult = await authService.activateAuthCodeByEncryptedId(
    req.body.encryptedId,
    req.body.authCode
  );

  if (!authCodeResult.success || !authCodeResult.userId) {
    return new ExecMainResponseModel(
      401,
      new ResponseModel(
        false,
        Language.getValue(
          languageCode,
          SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR
        ),
        null,
        Language.getValue(
          languageCode,
          SHARED_CONSTANTS.ERROR_CODES.AUTH_CODE_INVALID
        ),
        CONSTANTS.ENV.API_VERSION
      )
    );
  }

  const userEmail = await authService.getUserEmailById(authCodeResult.userId);
  if (!userEmail) {
    return new ExecMainResponseModel(
      401,
      new ResponseModel(
        false,
        Language.getValue(
          languageCode,
          SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR
        ),
        null,
        Language.getValue(
          languageCode,
          SHARED_CONSTANTS.ERROR_CODES.USER_DOES_NOT_EXIST
        ),
        CONSTANTS.ENV.API_VERSION
      )
    );
  }

  const userWithOrganizationAndRoles =
    await authService.getUserWithOrganizationAndRoles(userEmail);
  if (!userWithOrganizationAndRoles) {
    return new ExecMainResponseModel(
      401,
      new ResponseModel(
        false,
        Language.getValue(
          languageCode,
          SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR
        ),
        null,
        Language.getValue(
          languageCode,
          SHARED_CONSTANTS.ERROR_CODES.USER_DOES_NOT_EXIST
        ),
        CONSTANTS.ENV.API_VERSION
      )
    );
  }

  if (userWithOrganizationAndRoles.status !== "ACTIVE") {
    return new ExecMainResponseModel(
      401,
      new ResponseModel(
        false,
        Language.getValue(
          languageCode,
          SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR
        ),
        null,
        Language.getValue(
          languageCode,
          SHARED_CONSTANTS.ERROR_CODES.USER_NOT_ACTIVATED
        ),
        CONSTANTS.ENV.API_VERSION
      )
    );
  }

  const activeRoles = (userWithOrganizationAndRoles.allRoles || [])
    .filter((role: any) => role.Status === "ACTIVE")
    ?.map((role: any) => role.Name);
  const token = await TokenHandler.generate_token_from_user_id(
    userWithOrganizationAndRoles.idUser,
    activeRoles
  );

  const secureUserData = {
    idUser: userWithOrganizationAndRoles.idUser,
    email: userWithOrganizationAndRoles.email,
    firstName: userWithOrganizationAndRoles.firstName,
    lastName: userWithOrganizationAndRoles.lastName,
    phone: userWithOrganizationAndRoles.phone,
    photo: userWithOrganizationAndRoles.photo,
    status: userWithOrganizationAndRoles.status,
    twoFactorEnabled: userWithOrganizationAndRoles.twoFactorEnabled,
    parentOrganizationId: userWithOrganizationAndRoles.parentOrganizationId,
    createdAt: userWithOrganizationAndRoles.createdAt,
    updatedAt: userWithOrganizationAndRoles.updatedAt,
    securityStamp: userWithOrganizationAndRoles.securityStamp,
    lastPasswordChange: userWithOrganizationAndRoles.lastPasswordChange,
    timeBlocked: userWithOrganizationAndRoles.timeBlocked,
    timeUntilBlocked: userWithOrganizationAndRoles.timeUntilBlocked,
    organization: userWithOrganizationAndRoles.organization,
    rootOrganization: userWithOrganizationAndRoles.rootOrganization,
    primaryRole: userWithOrganizationAndRoles.primaryRole,
    allRoles: userWithOrganizationAndRoles.allRoles,
  };

  const data_return = { userData: secureUserData, token };
  return new ExecMainResponseModel(
    201,
    new ResponseModel(
      true,
      Language.getValue(languageCode, SHARED_CONSTANTS.STRING_CODES.OK),
      data_return,
      null,
      CONSTANTS.ENV.API_VERSION
    )
  );
};

export default loginWithAuthCodeAndEncryptedId;
