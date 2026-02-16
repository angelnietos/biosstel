/**
 * Activate auth code by userId and code - single responsibility service
 */

import { Database, cryptoHandler, IAuthCode } from "common";

const TABLE_AUTH_CODES = process.env.TABLE_AUTH_CODES || "tblAuthCodes";
const DB_SCHEMA = process.env.DB_SCHEMA || "dbo";

export class ActivateAuthCodeService {
  async execute(userId: string, authCode: number): Promise<boolean> {
    if (!userId || !authCode) return false;
    const authCodeRecord = await this.getAuthCodeRecordByUserId(userId, authCode);
    return this.activateAuthCodeInternal(authCodeRecord, authCode);
  }

  private async getAuthCodeRecordByUserId(
    userId: string,
    authCode?: number
  ): Promise<IAuthCode | null> {
    const sequelize = Database.getConnection();
    let query = `
      SELECT Id_AuthCode, Code, CreatedAt, ExpiresAt, ActivatedAt, EmailSentAt, UserId
      FROM [${DB_SCHEMA}].[${TABLE_AUTH_CODES}]
      WHERE UserId = :userId
    `;
    if (authCode) query += ` AND Code = :authCode`;
    const result = await sequelize.query(query, {
      replacements: { userId, authCode },
      type: sequelize.QueryTypes.SELECT,
    });
    return (result as any[])[0] ?? null;
  }

  private async activateAuthCodeInternal(
    authCodeRecord: IAuthCode | null,
    authCode: number
  ): Promise<boolean> {
    if (!authCodeRecord) return false;
    const now = new Date();
    if (
      authCodeRecord.Code === authCode &&
      authCodeRecord.ActivatedAt &&
      authCodeRecord.ExpiresAt > now
    ) {
      return true;
    }
    if (new Date(authCodeRecord.ExpiresAt) < now) return false;
    const sequelize = Database.getConnection();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    const activated = await sequelize.query(
      `UPDATE [${DB_SCHEMA}].[${TABLE_AUTH_CODES}] SET ActivatedAt = :activatedAt, ExpiresAt = :expiresAt WHERE UserId = :userId AND Code = :authCode`,
      {
        replacements: {
          activatedAt: new Date(),
          expiresAt,
          userId: authCodeRecord.UserId,
          authCode,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    return Array.isArray(activated) && activated.length > 1 && activated[1] > 0;
  }
}
