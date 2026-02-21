'use client';

import { Card } from '@biosstel/ui';
import { Link } from '@biosstel/platform';

export interface BackOfficeLandingPaths {
  home: string;
  backofficeRevision: string;
  users: string;
  alertas: string;
}

export interface BackOfficeLandingProps {
  paths: BackOfficeLandingPaths;
}

export function BackOfficeLanding({ paths }: BackOfficeLandingProps) {
  return (
    <div className="max-w-[1180px]">
      <h1 className="text-h1 font-bold text-gray-900 mb-4">Back Office</h1>
      <Card className="rounded-2xl px-6 py-5">
        <p className="text-mid text-gray-600 mb-4">
          Panel de administración y revisión de operaciones.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={paths.home} className="text-sm text-blue-600 hover:underline">Inicio</Link>
          <Link href={paths.backofficeRevision} className="text-sm text-blue-600 hover:underline">Revisión Back Office</Link>
          <Link href={paths.users} className="text-sm text-blue-600 hover:underline">Usuarios</Link>
          <Link href={paths.alertas} className="text-sm text-blue-600 hover:underline">Alertas</Link>
        </div>
      </Card>
    </div>
  );
}
