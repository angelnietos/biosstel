/**
 * @biosstel/auth - Domain Layer: User Entity
 * 
 * Pure TypeScript entity - NO React, NO Next, NO fetch
 * Portable to Node, React Native, or any other framework
 */

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthUser extends User {
  roles: Role[];
  organization?: Organization;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
}
