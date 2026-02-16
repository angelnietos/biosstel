/**
 * Set reset password token for user - single responsibility service
 */

import { Database } from "common";

const TABLE_USERS = process.env.TABLE_USERS || "tblUsers";
const DB_SCHEMA = process.env.DB_SCHEMA || "dbo";

export class SetResetPasswordService {
  async execute(idUser: string, encryptedUserId: string): Promise<boolean> {
    const sequelize = Database.getConnection();
    const changedRows = await sequelize.query(
      `UPDATE [${DB_SCHEMA}].[${TABLE_USERS}] SET ResetPassword = :encryptedUserId WHERE Id_User = :idUser`,
      {
        replacements: { idUser, encryptedUserId },
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    return (
      Array.isArray(changedRows) && changedRows.length > 1 && changedRows[1] > 0
    );
  }
}
