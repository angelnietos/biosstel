/**
 * @biosstel/ui-layout - Form
 * Semantic form wrapper. Forwards onSubmit and children. No styling.
 */

import { ReactNode, FormEventHandler } from 'react';

export interface FormProps {
  children: ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  className?: string;
}

export const Form = ({ children, onSubmit, className = '' }: FormProps) => {
  return (
    <form onSubmit={onSubmit} className={className.trim() || undefined}>
      {children}
    </form>
  );
};

export default Form;
