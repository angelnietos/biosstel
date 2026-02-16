import { check, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { Language, ResponseModel, SHARED_CONSTANTS } from "common";
import CONSTANTS from "../constants";

class FieldsValidator {
  public static validate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const languageCode: string = (req.headers.language as string) || "es";
    const result: any = validationResult(req);
    if (result.isEmpty()) return next();
    const message = Language.getValue(languageCode, result.errors[0].msg);
    return res
      .status(400)
      .json(
        new ResponseModel(
          false,
          message,
          null,
          result.errors[0],
          CONSTANTS.ENV.API_VERSION
        ).toJson()
      );
  };

  public static validateStringNotEmpty = (field: string) => {
    return [
      check(field, SHARED_CONSTANTS.ERROR_CODES.REQUIRED_FIELDS_ERROR)
        .not()
        .isEmpty(),
      check(field, SHARED_CONSTANTS.ERROR_CODES.REQUIRED_FIELDS_ERROR).isString(),
    ];
  };
}

export default FieldsValidator;
