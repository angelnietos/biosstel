/**
 * Get user with organization and roles - single responsibility service.
 * Template: Implement with your SHARED_MODELS (User, Organization, Role, etc.)
 */

import { Database, SHARED_MODELS } from "common";

export class GetUserWithOrganizationAndRolesService {
  async execute(email: string): Promise<any> {
    try {
      const sequelize = Database.getConnection();
      const models = SHARED_MODELS(sequelize).sequelizeModels;
      const { User, Organization, Role, UserRole, OrganizationRole, UserOrganization } = models;

      if (!User) {
        console.warn("GetUserWithOrganizationAndRolesService: User model not configured. Implement SHARED_MODELS in common.");
        return null;
      }

      const user = await User.findOne({
        where: { Email: email },
        include: [
          {
            model: Organization,
            as: "Organization",
            required: false,
            include: [
              { model: Organization, as: "ParentOrganization", required: false },
              { model: Organization, as: "RootOrganization", required: false },
            ],
          },
        ],
      });

      if (!user) return null;

      const mainOrganization = (user as any).Organization;
      let organizationData: any = null;
      let rootOrganization: any = null;

      if (mainOrganization) {
        const effectiveOrg =
          mainOrganization.ParentOrganization &&
          (!mainOrganization.BusinessName || !mainOrganization.Logo)
            ? mainOrganization.ParentOrganization
            : mainOrganization;
        organizationData = {
          id: mainOrganization.Id_Organization,
          name:
            effectiveOrg.BusinessName ||
            `Organization-${String(mainOrganization.Id_Organization).slice(0, 8)}`,
          logo: effectiveOrg.Logo,
          parentId: mainOrganization.ParentOrganizationId,
          rootId: mainOrganization.ParentOrganizationIdRoot,
        };
        if (mainOrganization.RootOrganization) {
          rootOrganization = {
            Id_Organization: mainOrganization.RootOrganization.Id_Organization,
            Name:
              mainOrganization.RootOrganization.BusinessName ||
              `Organization-${String(mainOrganization.RootOrganization.Id_Organization).slice(0, 8)}`,
            Logo: mainOrganization.RootOrganization.Logo,
          };
        } else {
          rootOrganization = {
            Id_Organization: mainOrganization.Id_Organization,
            Name: organizationData.name,
            Logo: organizationData.logo,
          };
        }
      }

      let primaryOrgRoles: any[] = [];
      if (mainOrganization && OrganizationRole) {
        primaryOrgRoles = await OrganizationRole.findAll({
          where: {
            OrganizationId: mainOrganization.Id_Organization,
            IsActive: true,
          },
          include: [
            {
              model: Role,
              as: "role",
              where: { Status: "ACTIVE" },
              required: true,
            },
          ],
          order: [["role", "Name", "ASC"]],
        });
      }

      const directRoles = UserRole
        ? await UserRole.findAll({
            where: { idUser: (user as any).Id_User },
            include: [
              {
                model: Role,
                as: "Roles",
                where: { Status: "ACTIVE" },
                required: true,
              },
            ],
            order: [["Roles", "Name", "ASC"]],
          })
        : [];

      const formattedDirectRoles = directRoles.map((ur: any) => ({
        Id_Role: ur.Roles?.Id_Role,
        Name: ur.Roles?.Name,
        Description: ur.Roles?.Description,
        Status: ur.Roles?.Status,
        CreatedAt: ur.Roles?.CreatedAt,
        UpdatedAt: ur.Roles?.UpdatedAt,
        Source: "DIRECT",
      }));

      const additionalUserOrgs = UserOrganization
        ? await UserOrganization.findAll({
            where: { UserId: (user as any).Id_User, IsActive: true },
            include: [
              {
                model: Organization,
                as: "Organization",
                required: true,
                include: [
                  {
                    model: OrganizationRole,
                    as: "organizationRoles",
                    where: { IsActive: true },
                    required: false,
                    include: [
                      {
                        model: Role,
                        as: "role",
                        where: { Status: "ACTIVE" },
                        required: true,
                      },
                    ],
                  },
                ],
              },
            ],
          })
        : [];

      const additionalOrgRoles = additionalUserOrgs.flatMap((uo: any) =>
        (uo.Organization?.organizationRoles || []).map((or: any) => ({
          Id_Role: or.role?.Id_Role,
          Name: or.role?.Name,
          Description: or.role?.Description,
          Status: or.role?.Status,
          CreatedAt: or.role?.CreatedAt,
          UpdatedAt: or.role?.UpdatedAt,
          Source: "ADDITIONAL_ORGANIZATIONAL",
          OrganizationId: uo.Organization?.Id_Organization,
          OrganizationName: uo.Organization?.BusinessName,
        }))
      );

      const primaryOrgRolesFormatted = primaryOrgRoles.map((or: any) => ({
        Id_Role: or.role?.Id_Role,
        Name: or.role?.Name,
        Description: or.role?.Description,
        Status: or.role?.Status,
        CreatedAt: or.role?.CreatedAt,
        UpdatedAt: or.role?.UpdatedAt,
        Source: "PRIMARY_ORGANIZATIONAL",
      }));

      const allRoles = [
        ...primaryOrgRolesFormatted,
        ...additionalOrgRoles,
        ...formattedDirectRoles,
      ];

      let primaryRole = null;
      if (primaryOrgRoles.length > 0) {
        primaryRole = {
          Id_Role: primaryOrgRoles[0].role?.Id_Role,
          Name: primaryOrgRoles[0].role?.Name,
          Description: primaryOrgRoles[0].role?.Description,
          Status: primaryOrgRoles[0].role?.Status,
          CreatedAt: primaryOrgRoles[0].role?.CreatedAt,
          UpdatedAt: primaryOrgRoles[0].role?.UpdatedAt,
          Source: "PRIMARY_ORGANIZATIONAL",
        };
      } else if (formattedDirectRoles.length > 0) {
        primaryRole = formattedDirectRoles[0];
      }

      return {
        idUser: (user as any).Id_User,
        email: (user as any).Email,
        firstName: (user as any).FirstName,
        lastName: (user as any).LastName,
        language: (user as any).Language,
        password: (user as any).Password,
        phone: (user as any).Phone,
        photo: (user as any).Photo,
        status: (user as any).Status,
        twoFactorEnabled: (user as any).TwoFactorEnabled,
        parentOrganizationId: (user as any).ParentOrganizationId,
        createdAt: (user as any).CreatedAt,
        updatedAt: (user as any).UpdatedAt,
        securityStamp: (user as any).SecurityStamp,
        lastPasswordChange: (user as any).LastPasswordChange,
        timeBlocked: (user as any).TimeBlocked,
        timeUntilBlocked: (user as any).TimeUntillBlocked,
        organization: organizationData,
        rootOrganization: rootOrganization,
        primaryRole,
        allRoles,
        organizationStatus: mainOrganization?.Status ?? null,
      };
    } catch (error: any) {
      console.error("GetUserWithOrganizationAndRolesService:", error);
      return null;
    }
  }
}
