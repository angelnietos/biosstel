/**
 * @biosstel/ui - Error Form Message Component
 * Pure UI component with no business logic
 */

export interface ErrorFormMsgProps {
  errorMsg?: string;
  className?: string;
}

export const ErrorFormMsg = ({ errorMsg, className = '' }: ErrorFormMsgProps) => {
  if (!errorMsg) return null;
  return <p className={`text-mini text-error ${className}`}>{errorMsg}</p>;
};

export default ErrorFormMsg;
