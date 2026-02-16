import FieldsValidator from "./fields_validators";
import { DefaultRequestMiddlewares } from "common";

class AuthMiddlewares {
  public static login = [
    DefaultRequestMiddlewares.setLanguageCode,
    ...FieldsValidator.validateStringNotEmpty("email"),
    ...FieldsValidator.validateStringNotEmpty("password"),
    FieldsValidator.validate,
  ];
}

export default AuthMiddlewares;
