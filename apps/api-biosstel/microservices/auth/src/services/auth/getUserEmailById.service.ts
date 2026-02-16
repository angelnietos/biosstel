/**
 * Get user email by user ID - single responsibility service
 */

import { Database } from "common";

const TABLE_USERS = process.env.TABLE_USERS || "tblUsers";
const DB_SCHEMA = process.env.DB_SCHEMA || "dbo";

export class GetUserEmailByIdService {
  async execute(userId: string): Promise<string | null> {
    try {
      const sequelize = Database.getConnection();
      const userResult = await sequelize.query(
        `SELECT Email FROM [${DB_SCHEMA}].[${TABLE_USERS}] WHERE Id_User = :userId`,
        {
          replacements: { userId },
          type: sequelize.QueryTypes.SELECT,
          logging: false,
        }
      );
      const result = userResult as any[];
      if (result.length === 0) return null;
      return result[0].Email;
    } catch (error) {
      console.error("GetUserEmailByIdService:", error);
      return null;
    }
  }
}
