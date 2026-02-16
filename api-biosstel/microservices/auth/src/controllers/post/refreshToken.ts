import { Request, Response } from "express";
import {
  Language,
  ResponseModel,
  SHARED_CONSTANTS,
  TokenHandler,
} from "common";
import CONSTANTS from "../../constants";

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const languageCode: string = (req.headers.language as string) || "es";
  let statusCode: number;
  let response: ResponseModel;

  try {
    const res_data = await TokenHandler.generate_token_from_user_id(
      req.body.id
    );
    statusCode = 200;
    response = new ResponseModel(
      true,
      SHARED_CONSTANTS.STRINGS.TOKEN_GENERATED,
      res_data,
      null,
      CONSTANTS.ENV.API_VERSION
    );
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
  res.status(statusCode).json(response.toJson()).send();
};

export default refreshToken;
