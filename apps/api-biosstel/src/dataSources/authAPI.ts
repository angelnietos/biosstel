/**
 * AuthAPI - REST DataSource for auth microservice
 */

import { RESTDataSource, AugmentedRequest } from "@apollo/datasource-rest";
import CONSTANTS from "../constants";
import type { KeyValueCache } from "@apollo/utils.keyvaluecache";
import { handleMicroserviceError } from "../utils/errorHandler";

class AuthAPI extends RESTDataSource {
  override baseURL = CONSTANTS.SERVICES.MS_AUTH_API_BASE_URL;
  private token: string;

  constructor(options: { token: string; cache: KeyValueCache }) {
    super(options);
    this.token = options.token;
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    request.headers["authorization"] = this.token;
  }

  async login(loginData: { email: string; password: string }) {
    const API_VERSION = "api/v1";
    const path = `${API_VERSION}/${CONSTANTS.SERVICES.MS_AUTH_SUBDOMAIN}/${CONSTANTS.ENDPOINTS.AUTH.LOGIN}`;
    try {
      return await this.post(path, { body: loginData });
    } catch (error: any) {
      return handleMicroserviceError(error, "AuthAPI", "login");
    }
  }

  async loginWithAuthCode(loginData: { userId: string; authCode: number }) {
    const API_VERSION = "api/v1";
    const path = `${API_VERSION}/${CONSTANTS.SERVICES.MS_AUTH_SUBDOMAIN}/${CONSTANTS.ENDPOINTS.AUTH.LOGIN_WITH_AUTH_CODE}`;
    try {
      return await this.post(path, { body: loginData });
    } catch (error: any) {
      return handleMicroserviceError(error, "AuthAPI", "loginWithAuthCode");
    }
  }

  async loginWithAuthCodeAndEncryptedId(loginData: { encryptedId: string; authCode: number }) {
    const API_VERSION = "api/v1";
    const path = `${API_VERSION}/${CONSTANTS.SERVICES.MS_AUTH_SUBDOMAIN}/${CONSTANTS.ENDPOINTS.AUTH.LOGIN_WITH_AUTH_CODE_AND_ENCRYPTED_ID}`;
    try {
      return await this.post(path, { body: loginData });
    } catch (error: any) {
      return handleMicroserviceError(error, "AuthAPI", "loginWithAuthCodeAndEncryptedId");
    }
  }

  async forgotPassword(email: string) {
    const API_VERSION = "api/v1";
    const path = `${API_VERSION}/${CONSTANTS.SERVICES.MS_AUTH_SUBDOMAIN}/${CONSTANTS.ENDPOINTS.AUTH.FORGOT_PASSWORD}`;
    try {
      return await this.post(path, { body: { email } });
    } catch (error: any) {
      return handleMicroserviceError(error, "AuthAPI", "forgotPassword");
    }
  }

  async resetPassword(
    encryptedId: string,
    newPassword: string,
    repeatedPassword: string
  ) {
    const API_VERSION = "api/v1";
    const path = `${API_VERSION}/${CONSTANTS.SERVICES.MS_AUTH_SUBDOMAIN}/${CONSTANTS.ENDPOINTS.AUTH.RESET_PASSWORD}`;
    try {
      return await this.post(path, {
        body: { encryptedId, newPassword, repeatedPassword },
      });
    } catch (error: any) {
      return handleMicroserviceError(error, "AuthAPI", "resetPassword");
    }
  }

  async validateToken(data: { id: string }) {
    const API_VERSION = "api/v1";
    const path = `${API_VERSION}/${CONSTANTS.SERVICES.MS_AUTH_SUBDOMAIN}/${CONSTANTS.ENDPOINTS.AUTH.VALIDATE_TOKEN}`;
    try {
      return await this.post(path, { body: { id: data.id } });
    } catch (error: any) {
      return handleMicroserviceError(error, "AuthAPI", "validateToken");
    }
  }

  async refreshToken(data: { id: string }) {
    const API_VERSION = "api/v1";
    const path = `${API_VERSION}/${CONSTANTS.SERVICES.MS_AUTH_SUBDOMAIN}/${CONSTANTS.ENDPOINTS.AUTH.REFRESH_TOKEN}`;
    try {
      return await this.post(path, { body: { id: data.id } });
    } catch (error: any) {
      return handleMicroserviceError(error, "AuthAPI", "refreshToken");
    }
  }

  async socialLogin(data: { email: string; sub: string }) {
    const API_VERSION = "api/v1";
    const path = `${API_VERSION}/${CONSTANTS.SERVICES.MS_AUTH_SUBDOMAIN}/${CONSTANTS.ENDPOINTS.AUTH.SOCIAL_LOGIN}`;
    try {
      return await this.post(path, { body: { email: data.email, sub: data.sub } });
    } catch (error: any) {
      return handleMicroserviceError(error, "AuthAPI", "socialLogin");
    }
  }
}

export default AuthAPI;
