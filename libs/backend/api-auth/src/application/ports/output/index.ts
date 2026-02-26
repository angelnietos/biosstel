/**
 * Output Ports: lo que el módulo auth necesita del exterior.
 * - ITokenService: emitir/validar tokens (implementado por JwtService/adapter)
 * - IUserRepository: validar credenciales (viene de @biosstel/api-usuarios)
 */
export * from './ITokenService';
