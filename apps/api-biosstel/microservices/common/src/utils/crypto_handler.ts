import crypto from "crypto";
import CONSTANTS from "../constants";

const encrypt = (
  text: string,
  secretKey: string = CONSTANTS.ENV.JWT_SECRET
): string => {
  try {
    const algorithm = "aes-256-gcm";
    const iv = crypto.randomBytes(16);
    const key = crypto.createHash("sha256").update(secretKey).digest();
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();
    return iv.toString("hex") + ":" + encrypted + ":" + authTag.toString("hex");
  } catch (error) {
    throw new Error(
      `Error encrypting data: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

const decrypt = (
  encryptedText: string,
  secretKey: string = CONSTANTS.ENV.JWT_SECRET
): string => {
  try {
    const algorithm = "aes-256-gcm";
    const textParts = encryptedText.split(":");
    if (textParts.length < 3) {
      throw new Error("Invalid encrypted format. Expected: iv:encrypted:authTag");
    }
    const iv = Buffer.from(textParts[0], "hex");
    const encrypted = textParts[1];
    const authTag = Buffer.from(textParts[2], "hex");
    const key = crypto.createHash("sha256").update(secretKey).digest();
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    throw new Error(
      `Error decrypting data: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export default { encrypt, decrypt };
