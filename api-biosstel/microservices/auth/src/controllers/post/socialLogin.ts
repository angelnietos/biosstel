/**
 * Social login - template: implement with your User model and signIn field
 */

import { Request, Response } from "express";
import {
  ExecMainResponseModel,
  Language,
  ResponseModel,
  SHARED_CONSTANTS,
  SHARED_MODELS,
  TokenHandler,
  password_handler,
  Database,
} from "common";
import CONSTANTS from "../../constants";

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
  try {
    const sequelize = Database.getConnection();
    const models = SHARED_MODELS(sequelize).sequelizeModels;
    const User = models.User;
    if (!User) {
      return new ExecMainResponseModel(
        501,
        new ResponseModel(
          false,
          Language.getValue(
            languageCode,
            SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR
          ),
          null,
          "User model not configured",
          CONSTANTS.ENV.API_VERSION
        )
      );
    }
    const user = await User.findOne({
      where: { Email: req.body.email },
    });
    const userData = user?.dataValues ?? user;
    if (!userData) {
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
            SHARED_CONSTANTS.ERROR_CODES.USER_NOT_FOUND
          ),
          CONSTANTS.ENV.API_VERSION
        )
      );
    }

    if (userData.Status !== "ACTIVE") {
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
            SHARED_CONSTANTS.ERROR_CODES.USER_NOT_ACTIVE
          ),
          CONSTANTS.ENV.API_VERSION
        )
      );
    }

    const token = await TokenHandler.generate_token_from_user_id(
      userData.Id_User
    );
    const data_return = { userData: userData, token };
    return new ExecMainResponseModel(
      200,
      new ResponseModel(
        true,
        Language.getValue(languageCode, SHARED_CONSTANTS.STRING_CODES.OK),
        data_return,
        null,
        CONSTANTS.ENV.API_VERSION
      )
    );
  } catch (e) {
    console.error(e);
    return new ExecMainResponseModel(
      500,
      new ResponseModel(
        false,
        Language.getValue(
          languageCode,
          SHARED_CONSTANTS.ERROR_CODES.GENERIC_ERROR
        ),
        e,
        Language.getValue(
          languageCode,
          SHARED_CONSTANTS.ERROR_CODES.SERVER_ERROR
        ),
        CONSTANTS.ENV.API_VERSION
      )
    );
  }
};

export default login;
