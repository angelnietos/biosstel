import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import CONSTANTS from "../constants";
import Language from "../language";

const getMailerEmail = (): string =>
  `"API Template" ${
    process.env.MAILER_USER ?? CONSTANTS.DEVELOPMENT_KEYS.MAILER_USER
  }`;

const sendEmail = (
  from: string,
  to: string[],
  bcc: string[],
  subject: string,
  html: string,
  text: string,
  attachments?: Array<{ filename: string; path: string }>
): Promise<{ success: boolean; error: any }> => {
  const host =
    process.env.MAILER_HOST ?? CONSTANTS.DEVELOPMENT_KEYS.MAILER_HOST;
  const isHostGmail = host.includes("gmail");
  const transport = nodemailer.createTransport(
    new SMTPTransport({
      host,
      secure: isHostGmail,
      requireTLS: !isHostGmail,
      port:
        process.env.MAILER_PORT !== undefined
          ? parseInt(process.env.MAILER_PORT, 10)
          : CONSTANTS.DEVELOPMENT_KEYS.MAILER_PORT,
      auth: {
        user:
          process.env.MAILER_USER ?? CONSTANTS.DEVELOPMENT_KEYS.MAILER_USER,
        pass:
          process.env.MAILER_PASS ?? CONSTANTS.DEVELOPMENT_KEYS.MAILER_PASS,
      },
      tls: isHostGmail ? undefined : { rejectUnauthorized: false },
    })
  );
  const message = { from, to, bcc, subject, html, text, attachments };
  return new Promise((resolve) =>
    transport.sendMail(message, (error: any) => {
      resolve({ success: error === null, error });
    })
  );
};

const getForgotPasswordEmailContent = async (
  languageCode: string,
  link: string
) => {
  const html = `
    <p>${Language.getValue(languageCode, CONSTANTS.DEVELOPMENT_KEYS.FORGOT_PASSWORD_CONTENT_1)}</p>
    <p>${Language.getValue(languageCode, CONSTANTS.DEVELOPMENT_KEYS.FORGOT_PASSWORD_CONTENT_2)} <b>${link}</b></p>
    <p>${Language.getValue(languageCode, CONSTANTS.DEVELOPMENT_KEYS.REGARDS)}</p>
  `;
  const plainText = `Password reset link: ${link}`;
  return { html, plainText };
};

const getAuthCodeEmailContent = async (
  languageCode: string,
  authCode: number,
  idAuthCodeEncrypted: string
) => {
  const verifyUrl = `${CONSTANTS.DEVELOPMENT_KEYS.FRONTEND_VERIFY_CODE_URL}?ac=${authCode}&e=${idAuthCodeEncrypted}`;
  const html = `
    <p>${Language.getValue(languageCode, CONSTANTS.DEVELOPMENT_KEYS.AUTH_CODE_CONTENT_1)}</p>
    <p>${Language.getValue(languageCode, CONSTANTS.DEVELOPMENT_KEYS.AUTH_CODE_CONTENT_2)} <b>${authCode}</b></p>
    <p>${Language.getValue(languageCode, CONSTANTS.DEVELOPMENT_KEYS.AUTH_CODE_CONTENT_3)} <a href="${verifyUrl}">${verifyUrl}</a></p>
    <p>${Language.getValue(languageCode, CONSTANTS.DEVELOPMENT_KEYS.REGARDS)}</p>
  `;
  const plainText = `Verification code: ${authCode}`;
  return { html, plainText };
};

const sendAuthCodeEmail = async (
  languageCode: string,
  email: string,
  authCode: number,
  idAuthCodeEncrypted: string
): Promise<{ success: boolean; error: any }> => {
  try {
    const emailContent = await getAuthCodeEmailContent(
      languageCode,
      authCode,
      idAuthCodeEncrypted
    );
    return sendEmail(
      getMailerEmail(),
      [email],
      [],
      Language.getValue(languageCode, CONSTANTS.DEVELOPMENT_KEYS.SEND_INVITATION_SUBJECT),
      emailContent.html,
      emailContent.plainText
    );
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : CONSTANTS.DEVELOPMENT_KEYS.SEND_INVITATION_FAILED,
    };
  }
};

export default {
  getMailerEmail,
  sendEmail,
  getForgotPasswordEmailContent,
  getAuthCodeEmailContent,
  sendAuthCodeEmail,
};
