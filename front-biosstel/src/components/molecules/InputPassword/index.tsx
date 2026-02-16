"use client";

import { useState } from "react";
import { Input } from "@/components/atoms/Input";
import { EyeIcon } from "@/components/atoms/icons/EyeIcon";
import { EyeOffIcon } from "@/components/atoms/icons/EyeOffIcon";

interface Props {
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cssProps?: string;
  containerCssProps?: string;
  errorInput?: boolean;
}

export const InputPassword = ({
  name,
  placeholder,
  value,
  onChange,
  cssProps = "",
  containerCssProps = "",
  errorInput = false,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative ${containerCssProps}`}>
      <Input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        cssProps={`pr-10 ${cssProps}`}
        errorInput={errorInput}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
      >
        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
};
