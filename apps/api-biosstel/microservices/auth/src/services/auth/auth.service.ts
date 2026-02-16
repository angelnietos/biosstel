/**
 * Auth Service - Facade that exposes all auth operations.
 * Controllers use this single entry point; each operation is implemented in its own service file.
 */

import { GetUserWithOrganizationAndRolesService } from "./getUserWithOrganizationAndRoles.service";
import { GetUserEmailByIdService } from "./getUserEmailById.service";
import { SetResetPasswordService } from "./setResetPassword.service";
import { UpdatePasswordService } from "./updatePassword.service";
import { UpdateAuthCodeStatusService } from "./updateAuthCodeStatus.service";
import { UpdateAuthCodeEmailSentDateService } from "./updateAuthCodeEmailSentDate.service";
import { ActivateAuthCodeByEncryptedIdService } from "./activateAuthCodeByEncryptedId.service";
import { ActivateAuthCodeService } from "./activateAuthCode.service";

export class AuthService {
  private getUserWithOrganizationAndRolesService: GetUserWithOrganizationAndRolesService;
  private getUserEmailByIdService: GetUserEmailByIdService;
  private setResetPasswordService: SetResetPasswordService;
  private updatePasswordService: UpdatePasswordService;
  private updateAuthCodeStatusService: UpdateAuthCodeStatusService;
  private updateAuthCodeEmailSentDateService: UpdateAuthCodeEmailSentDateService;
  private activateAuthCodeByEncryptedIdService: ActivateAuthCodeByEncryptedIdService;
  private activateAuthCodeService: ActivateAuthCodeService;

  constructor() {
    this.getUserWithOrganizationAndRolesService =
      new GetUserWithOrganizationAndRolesService();
    this.getUserEmailByIdService = new GetUserEmailByIdService();
    this.setResetPasswordService = new SetResetPasswordService();
    this.updatePasswordService = new UpdatePasswordService();
    this.updateAuthCodeStatusService = new UpdateAuthCodeStatusService();
    this.updateAuthCodeEmailSentDateService =
      new UpdateAuthCodeEmailSentDateService();
    this.activateAuthCodeByEncryptedIdService =
      new ActivateAuthCodeByEncryptedIdService();
    this.activateAuthCodeService = new ActivateAuthCodeService();
  }

  async getUserWithOrganizationAndRoles(email: string) {
    return this.getUserWithOrganizationAndRolesService.execute(email);
  }

  async getUserEmailById(userId: string) {
    return this.getUserEmailByIdService.execute(userId);
  }

  async setResetPassword(idUser: string, encryptedUserId: string) {
    return this.setResetPasswordService.execute(idUser, encryptedUserId);
  }

  async updatePassword(
    idUser: string,
    encryptedUserId: string,
    encryptedPassword: string
  ) {
    return this.updatePasswordService.execute(
      idUser,
      encryptedUserId,
      encryptedPassword
    );
  }

  async updateAuthCodeStatus(idUser: string) {
    return this.updateAuthCodeStatusService.execute(idUser);
  }

  async updateAuthCodeEmailSentDate(idUser: string) {
    return this.updateAuthCodeEmailSentDateService.execute(idUser);
  }

  async activateAuthCodeByEncryptedId(encryptedId: string, authCode: number) {
    return this.activateAuthCodeByEncryptedIdService.execute(
      encryptedId,
      authCode
    );
  }

  async activateAuthCode(userId: string, authCode: number) {
    return this.activateAuthCodeService.execute(userId, authCode);
  }
}
