import { AuthAPI } from "../../dataSources";

interface DataSources {
  authAPI: AuthAPI;
}

const resolvers = {
  Query: {},
  Mutation: {
    login: async (
      _root: any,
      args: { email: string; password: string },
      { dataSources }: { dataSources: DataSources }
    ) => dataSources.authAPI.login(args),
    loginWithAuthCode: async (
      _root: any,
      args: { userId: string; authCode: number },
      { dataSources }: { dataSources: DataSources }
    ) => dataSources.authAPI.loginWithAuthCode(args),
    loginWithAuthCodeAndEncryptedId: async (
      _root: any,
      args: { encryptedId: string; authCode: number },
      { dataSources }: { dataSources: DataSources }
    ) => dataSources.authAPI.loginWithAuthCodeAndEncryptedId(args),
    forgotPassword: async (
      _root: any,
      { email }: { email: string },
      { dataSources }: { dataSources: DataSources }
    ) => dataSources.authAPI.forgotPassword(email),
    resetPassword: async (
      _root: any,
      { encryptedId, newPassword, repeatedPassword }: { encryptedId: string; newPassword: string; repeatedPassword: string },
      { dataSources }: { dataSources: DataSources }
    ) => dataSources.authAPI.resetPassword(encryptedId, newPassword, repeatedPassword),
    validateToken: async (
      _root: any,
      args: { id: string },
      { dataSources }: { dataSources: DataSources }
    ) => dataSources.authAPI.validateToken(args),
    refreshToken: async (
      _root: any,
      args: { id: string },
      { dataSources }: { dataSources: DataSources }
    ) => dataSources.authAPI.refreshToken(args),
    socialLogin: async (
      _root: any,
      args: { email: string; sub: string },
      { dataSources }: { dataSources: DataSources }
    ) => dataSources.authAPI.socialLogin(args),
  },
};

export default resolvers;
