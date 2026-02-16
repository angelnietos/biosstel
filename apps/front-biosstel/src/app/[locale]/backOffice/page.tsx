'use client';

import { useTranslations } from 'next-intl';

export default function BackOfficePage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Back Office</h1>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p className="text-gray-600">Panel de administración</p>
      </div>
    </div>
  );
}
