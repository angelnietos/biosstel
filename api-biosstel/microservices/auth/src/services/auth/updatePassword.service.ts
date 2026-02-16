/**
 * Update user password - single responsibility service
 */

import { Database } from "common";

const TABLE_USERS = process.env.TABLE_USERS || "tblUsers";
const DB_SCHEMA = process.env.DB_SCHEMA || "dbo";

export class UpdatePasswordService {
  async execute(
    idUser: string,
    encryptedUserId: string,
    encryptedPassword: string
  ): Promise<boolean> {
    const sequelize = Database.getConnection();
    const changedRows = await sequelize.query(
      `UPDATE [${DB_SCHEMA}].[${TABLE_USERS}] SET Password = :encryptedPassword, ResetPassword = null WHERE Id_User = :idUser AND ResetPassword = :encryptedUserId`,
      {
        replacements: { encryptedPassword, idUser, encryptedUserId },
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    return (
      Array.isArray(changedRows) && changedRows.length > 1 && changedRows[1] > 0
    );
  }
}
