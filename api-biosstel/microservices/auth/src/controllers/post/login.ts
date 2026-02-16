import {
  ExecMainResponseModel,
  Language,
  ResponseModel,
  SHARED_CONSTANTS,
  TokenHandler,
  mailer,
  password_handler,
  cryptoHandler,
} from "common";
import CONSTANTS from "../../constants";
import { Request, Response } from "express";
import { AuthService } from "../../services/auth/auth.service";

const login = async (req: Request, res: Response): Promise<void> => {
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
      Language.getValue(languageCode, SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR),
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
  const userWithOrganizationAndRoles =
    await authService.getUserWithOrganizationAndRoles(req.body.email);

  if (!userWithOrganizationAndRoles) {
    return new ExecMainResponseModel(
      401,
      new ResponseModel(
        false,
        Language.getValue(languageCode, SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR),
        null,
        Language.getValue(languageCode, SHARED_CONSTANTS.ERROR_CODES.USER_DOES_NOT_EXIST),
        CONSTANTS.ENV.API_VERSION
      )
    );
  }

  if (userWithOrganizationAndRoles.status !== "ACTIVE") {
    return new ExecMainResponseModel(
      401,
      new ResponseModel(
        false,
        Language.getValue(languageCode, SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR),
        null,
        Language.getValue(languageCode, SHARED_CONSTANTS.ERROR_CODES.USER_NOT_ACTIVATED),
        CONSTANTS.ENV.API_VERSION
      )
    );
  }

  if (userWithOrganizationAndRoles?.organizationStatus === "DELETED") {
    return new ExecMainResponseModel(
      401,
      new ResponseModel(
        false,
        Language.getValue(languageCode, SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR),
        null,
        Language.getValue(languageCode, SHARED_CONSTANTS.ERROR_CODES.ORGANIZATION_DELETED),
        CONSTANTS.ENV.API_VERSION
      )
    );
  }

  const authCodeStatus = await authService.updateAuthCodeStatus(
    userWithOrganizationAndRoles.idUser
  );

  if (!authCodeStatus.isActive || authCodeStatus.isExpired) {
    if (
      !authCodeStatus.emailSentAt ||
      authCodeStatus.emailSentAt < new Date(Date.now() - 1000 * 60 * 60 * 24)
    ) {
      const idAuthCodeEncrypted = cryptoHandler.encrypt(authCodeStatus.idAuthCode);
      const emailSent = await mailer.sendAuthCodeEmail(
        languageCode,
        userWithOrganizationAndRoles.email,
        authCodeStatus.code,
        idAuthCodeEncrypted
      );
      if (emailSent.success) {
        await authService.updateAuthCodeEmailSentDate(
          userWithOrganizationAndRoles.idUser
        );
      }
      return new ExecMainResponseModel(
        401,
        new ResponseModel(
          false,
          Language.getValue(languageCode, SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR),
          null,
          Language.getValue(
            languageCode,
            authCodeStatus.isExpired
              ? SHARED_CONSTANTS.ERROR_CODES.AUTH_CODE_EXPIRED
              : SHARED_CONSTANTS.ERROR_CODES.AUTH_CODE_NOT_ACTIVE
          ),
          CONSTANTS.ENV.API_VERSION
        )
      );
    }
    return new ExecMainResponseModel(
      401,
      new ResponseModel(
        false,
        Language.getValue(languageCode, SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR),
        null,
        Language.getValue(languageCode, SHARED_CONSTANTS.ERROR_CODES.AUTH_CODE_ALREADY_SENT),
        CONSTANTS.ENV.API_VERSION
      )
    );
  }

  const encripted_password =
    await password_handler.encrypt_password_from_secret(req.body.password);
  if (encripted_password !== userWithOrganizationAndRoles.password) {
    return new ExecMainResponseModel(
      401,
      new ResponseModel(
        false,
        Language.getValue(languageCode, SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR),
        null,
        Language.getValue(languageCode, SHARED_CONSTANTS.ERROR_CODES.INCORRECT_PASSWORD),
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
    language: userWithOrganizationAndRoles.language,
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

export default login;
