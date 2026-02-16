"use client";
import { store } from "../../store/store";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const Providers = ({ children }: Props) => {
  return <>{children}</>;
};
