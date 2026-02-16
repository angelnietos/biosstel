interface Props {
  type?: string;
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cssProps?: string;
  errorInput?: boolean;
}

export const Input = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  cssProps = "",
  errorInput = false,
}: Props) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${cssProps} ${errorInput ? "border-error" : ""}`}
    />
  );
};
