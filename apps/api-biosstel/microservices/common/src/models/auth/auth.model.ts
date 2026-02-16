export interface IAuthCode {
  Id_AuthCode: string;
  Code: number;
  CreatedAt: Date;
  ExpiresAt: Date;
  ActivatedAt: Date | null;
  EmailSentAt: Date | null;
  UserId: string;
}
