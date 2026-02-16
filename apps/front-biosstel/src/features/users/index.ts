/**
 * Users Feature - Exports
 */

// Shell
export { default as UsersShell } from './shell/UsersShell'

// Data Access
export { useUsers } from './data-access/useUsers'
export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from './data-access/usersApi'
export type {
  User as UserType,
  UsersResponse,
  GetUsersParams,
} from './data-access/usersApi'

// Pages
export { default as UserList } from './pages/components/UserList'
export { default as UsersLayout } from './pages/layouts/UsersLayout'
