'use client';

import { Heading } from '@biosstel/ui';
import { ReactNode } from 'react';

interface Props {
  title: string;
  headerRight?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const AssignmentSection = ({ title, headerRight, children, className = '' }: Props) => (
  <section className={`flex flex-col gap-3 ${className}`}>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Heading level={2} className="text-[18px] font-semibold text-gray-900">{title}</Heading>
      {headerRight}
    </div>
    {children}
  </section>
);
