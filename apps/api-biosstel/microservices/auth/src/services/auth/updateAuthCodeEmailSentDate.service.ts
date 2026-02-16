/**
 * Update auth code email sent date - single responsibility service
 */

import { Database } from "common";

const TABLE_AUTH_CODES = process.env.TABLE_AUTH_CODES || "tblAuthCodes";
const DB_SCHEMA = process.env.DB_SCHEMA || "dbo";

export class UpdateAuthCodeEmailSentDateService {
  async execute(idUser: string): Promise<boolean> {
    const sequelize = Database.getConnection();
    const changedRows = await sequelize.query(
      `UPDATE [${DB_SCHEMA}].[${TABLE_AUTH_CODES}] SET EmailSentAt = :emailSentAt WHERE UserId = :idUser`,
      {
        replacements: { emailSentAt: new Date(), idUser },
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    return (
      Array.isArray(changedRows) && changedRows.length > 1 && changedRows[1] > 0
    );
  }
}
