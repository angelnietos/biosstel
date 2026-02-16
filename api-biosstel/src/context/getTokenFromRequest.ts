import { Request } from "express";

const getTokenFromRequest = (req: Request) => {
  const startsWith = "Bearer ";
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.substring(startsWith.length);
  }
  return authHeader;
};
export default getTokenFromRequest;
