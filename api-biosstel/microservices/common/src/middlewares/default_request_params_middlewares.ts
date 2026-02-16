import { NextFunction, Request, Response } from "express";
import Language from "../language/index";

class DefaultRequestMiddlewares {
  public static setLanguageCode = (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    let language: string | undefined =
      (req.headers.language as string) ||
      (req.params.language as string) ||
      (req.query.language as string);
    if (language === Language.EN || language === Language.ES) {
      req.headers.language = language;
    } else {
      req.headers.language = Language.ES;
    }
    next();
  };
}

export default DefaultRequestMiddlewares;
