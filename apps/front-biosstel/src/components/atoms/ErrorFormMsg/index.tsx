interface Props {
  errorMsg?: string;
}

export const ErrorFormMsg = ({ errorMsg }: Props) => {
  if (!errorMsg) return null;
  return <p className="text-mini text-error">{errorMsg}</p>;
};
