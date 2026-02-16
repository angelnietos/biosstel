import { Request, Response } from "express";
import {
  getTokenFromHeader,
  Language,
  ResponseModel,
  SHARED_CONSTANTS,
  TokenHandler,
} from "common";
import CONSTANTS from "../../constants";

const validateToken = async (req: Request, res: Response): Promise<void> => {
  const languageCode: string = (req.headers.language as string) || "es";
  let statusCode: number;
  let response: ResponseModel;

  try {
    const bearerToken = getTokenFromHeader(req);
    const token_verify = await TokenHandler.verifyToken(bearerToken);
    statusCode = token_verify.status;
    if (token_verify.status !== 200) {
      response = new ResponseModel(
        false,
        Language.getValue(
          languageCode,
          SHARED_CONSTANTS.ERROR_CODES.TOKEN_VERIFICATION
        ),
        null,
        token_verify,
        CONSTANTS.ENV.API_VERSION
      );
    } else {
      response = new ResponseModel(
        true,
        SHARED_CONSTANTS.STRINGS.TOKEN_SUCCESS,
        token_verify,
        null,
        CONSTANTS.ENV.API_VERSION
      );
    }
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

export default validateToken;
