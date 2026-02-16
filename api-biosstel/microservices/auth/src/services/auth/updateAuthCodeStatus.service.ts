/**
 * Update auth code status - single responsibility service
 */

import { Database, IAuthCode } from "common";

const TABLE_AUTH_CODES = process.env.TABLE_AUTH_CODES || "tblAuthCodes";
const DB_SCHEMA = process.env.DB_SCHEMA || "dbo";

export interface AuthCodeStatusResult {
  idAuthCode: string;
  isActive: boolean;
  isExpired: boolean;
  code: number;
  emailSentAt?: Date;
}

export class UpdateAuthCodeStatusService {
  async execute(idUser: string): Promise<AuthCodeStatusResult> {
    let authCodeRecord = await this.getAuthCodeRecordByUserId(idUser);
    let authCodeStatus = this.getAuthCodeStatus(authCodeRecord);

    if (
      authCodeRecord &&
      authCodeRecord.ActivatedAt !== null &&
      new Date(authCodeRecord.ExpiresAt) >= new Date()
    ) {
      return authCodeStatus;
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    if (
      !authCodeRecord ||
      !authCodeRecord.EmailSentAt ||
      authCodeStatus.isExpired
    ) {
      await this.generateAndSaveAuthCode(idUser, authCodeRecord);
      authCodeRecord = await this.getAuthCodeRecordByUserId(idUser) as IAuthCode & { Code?: number };
    }

    return this.getAuthCodeStatus(authCodeRecord);
  }

  private getAuthCodeStatus(authCodeRecord: (IAuthCode & { Code?: number }) | null): AuthCodeStatusResult {
    if (!authCodeRecord) {
      return {
        idAuthCode: "",
        isActive: false,
        isExpired: true,
        code: 0,
        emailSentAt: undefined,
      };
    }
    const exp = new Date(authCodeRecord.ExpiresAt);
    const activated = authCodeRecord.ActivatedAt !== null;
    return {
      idAuthCode: authCodeRecord.Id_AuthCode,
      isActive: activated,
      isExpired: !(activated && exp >= new Date()),
      code: authCodeRecord.Code ?? 0,
      emailSentAt: authCodeRecord.EmailSentAt ?? undefined,
    };
  }

  private async getAuthCodeRecordByUserId(
    userId: string,
    authCode?: number
  ): Promise<any> {
    const sequelize = Database.getConnection();
    let query = `
      SELECT Id_AuthCode, Code, CreatedAt, ExpiresAt, ActivatedAt, EmailSentAt, UserId
      FROM [${DB_SCHEMA}].[${TABLE_AUTH_CODES}]
      WHERE UserId = :userId
    `;
    if (authCode != null) query += ` AND Code = :authCode`;
    const result = await sequelize.query(query, {
      replacements: { userId, authCode },
      type: sequelize.QueryTypes.SELECT,
    });
    return (result as any[])[0] ?? null;
  }

  private async generateAndSaveAuthCode(
    idUser: string,
    authCodeRecord: any
  ): Promise<number> {
    const code = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const sequelize = Database.getConnection();

    if (!authCodeRecord) {
      await sequelize.query(
        `INSERT INTO [${DB_SCHEMA}].[${TABLE_AUTH_CODES}] (UserId, Code, ExpiresAt) VALUES (:userId, :code, :expiresAt)`,
        {
          replacements: { userId: idUser, code, expiresAt },
          type: sequelize.QueryTypes.INSERT,
        }
      );
    } else if (new Date(authCodeRecord.ExpiresAt) < new Date()) {
      await sequelize.query(
        `UPDATE [${DB_SCHEMA}].[${TABLE_AUTH_CODES}] SET Code = :code, ExpiresAt = :expiresAt, ActivatedAt = null, EmailSentAt = null WHERE UserId = :idUser`,
        {
          replacements: { code, expiresAt, idUser: authCodeRecord.UserId },
          type: sequelize.QueryTypes.UPDATE,
        }
      );
    } else {
      return authCodeRecord.Code;
    }
    return code;
  }
}
