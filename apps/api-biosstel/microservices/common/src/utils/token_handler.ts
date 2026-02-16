import CONSTANTS from "../constants/index";
import jwt, { JwtPayload } from "jsonwebtoken";

const generate_token_from_user_id = (id: string, roles?: string[]) => {
  const payload = { sub: id, roles: roles || [] };
  if (!payload.sub) {
    return { status: 500, message: "undefined id" };
  }
  const secret = CONSTANTS.ENV.JWT_SECRET as string;
  try {
    const token = jwt.sign(payload, secret, { expiresIn: "2D" });
    return token;
  } catch (err) {
    return { status: 500, message: String(err) };
  }
};

const verifyToken = async (
  token: string
): Promise<{ status: number; message: string | JwtPayload }> => {
  const secret = CONSTANTS.ENV.JWT_SECRET;
  try {
    const decoded = jwt.verify(token, secret, {});
    return { status: 200, message: decoded };
  } catch (e) {
    return { status: 500, message: String(e) };
  }
};

export default {
  generate_token_from_user_id,
  verifyToken,
};
