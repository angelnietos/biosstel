/**
 * Activate auth code by encrypted id and code - single responsibility service
 */

import { cryptoHandler } from "common";
import { ActivateAuthCodeService } from "./activateAuthCode.service";

export class ActivateAuthCodeByEncryptedIdService {
  async execute(
    encryptedId: string,
    authCode: number
  ): Promise<{ success: boolean; userId: string | null }> {
    if (!encryptedId || !authCode) {
      return { success: false, userId: null };
    }
    const userId = cryptoHandler.decrypt(encryptedId);
    const activateService = new ActivateAuthCodeService();
    const success = await activateService.execute(userId, authCode);
    return { success, userId: success ? userId : null };
  }
}
