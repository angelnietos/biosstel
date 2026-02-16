/**
 * Template: Implement SHARED_MODELS with your Sequelize models (User, Organization, Role, etc.)
 * and register associations. Auth microservice expects User, Organization, Role,
 * UserRole, OrganizationRole, UserOrganization.
 */
import { Sequelize } from "sequelize";

let sharedModelsInstance: any = null;

const SHARED_MODELS = (sequelize?: Sequelize) => {
  if (sharedModelsInstance) return sharedModelsInstance;
  if (!sequelize) {
    throw new Error(
      "You must provide a Sequelize instance on first call to SHARED_MODELS"
    );
  }
  // TODO: Initialize your models here, e.g.:
  // const User = initUserModel(sequelize);
  // const Organization = initOrganizationModel(sequelize);
  // ... init associations
  sharedModelsInstance = {
    sequelizeModels: {
      User: null,
      Organization: null,
      Role: null,
      UserRole: null,
      OrganizationRole: null,
      UserOrganization: null,
    },
  };
  return sharedModelsInstance;
};

export default SHARED_MODELS;
