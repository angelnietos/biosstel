/**
 * @biosstel/dashboard - Objetivos Terminales Page (Figma-like)
 */

'use client';

import { DashboardLayout } from '../../layouts';
import { Link } from '@biosstel/platform';

type AssignmentRow = { label: string; value: number; total: number; ok?: boolean };
type AssignmentCard = {
  title: string;
  totalValue: number;
  totalObjective: number;
  rows: AssignmentRow[];
};

const mockHeader = {
  title: 'Objetivos Terminales',
  range: 'Mes en curso 1 Enero - 27 Enero',
  achieved: 20000,
  objective: 89988,
  pct: 15,
};

const departmentCards: AssignmentCard[] = [
  {
    title: 'Comercial',
    totalValue: 10124,
    totalObjective: 89988,
    rows: [
      { label: 'Centro de trabajo 1', value: 120, total: 500, ok: true },
      { label: 'Centro de trabajo 2', value: 437, total: 500, ok: true },
      { label: 'Centro de trabajo 3', value: 757, total: 800, ok: true },
      { label: 'Centro de trabajo 4', value: 344, total: 500, ok: false },
      { label: 'Centro de trabajo 5', value: 419, total: 500, ok: true },
    ],
  },
  {
    title: 'Departamento 2',
    totalValue: 10124,
    totalObjective: 89988,
    rows: [
      { label: 'Centro de trabajo 1', value: 120, total: 500, ok: true },
      { label: 'Centro de trabajo 2', value: 437, total: 500, ok: true },
      { label: 'Centro de trabajo 3', value: 757, total: 800, ok: true },
      { label: 'Centro de trabajo 4', value: 344, total: 500, ok: false },
      { label: 'Centro de trabajo 5', value: 419, total: 500, ok: true },
    ],
  },
  {
    title: 'Tienda',
    totalValue: 10124,
    totalObjective: 89988,
    rows: [
      { label: 'Centro de trabajo 1', value: 120, total: 500, ok: true },
      { label: 'Centro de trabajo 2', value: 437, total: 500, ok: true },
      { label: 'Centro de trabajo 3', value: 757, total: 800, ok: true },
      { label: 'Centro de trabajo 4', value: 344, total: 500, ok: false },
      { label: 'Centro de trabajo 5', value: 419, total: 500, ok: true },
    ],
  },
];

const peopleCards: AssignmentCard[] = [
  {
    title: 'Comercial',
    totalValue: 10124,
    totalObjective: 89988,
    rows: [
      { label: 'Isabella Torres', value: 12, total: 50, ok: true },
      { label: 'Maria Robledo', value: 37, total: 50, ok: true },
      { label: 'Lucia Martinez', value: 57, total: 80, ok: true },
      { label: 'Sofia González', value: 44, total: 50, ok: false },
      { label: 'Diego Rodríguez', value: 19, total: 50, ok: true },
    ],
  },
  {
    title: 'Telemarketing',
    totalValue: 10124,
    totalObjective: 89988,
    rows: [
      { label: 'Isabella Torres', value: 22, total: 50, ok: true },
      { label: 'Maria Robledo', value: 41, total: 50, ok: true },
      { label: 'Lucia Martinez', value: 92, total: 150, ok: true },
    ],
  },
  {
    title: 'Tienda',
    totalValue: 10124,
    totalObjective: 89988,
    rows: [
      { label: 'Isabella Torres', value: 29, total: 50, ok: true },
      { label: 'Maria Robledo', value: 25, total: 50, ok: true },
      { label: 'Lucia Martinez', value: 8, total: 50, ok: false },
    ],
  },
];

const ProgressBar = ({ achieved, objective }: { achieved: number; objective: number }) => {
  const pct = objective > 0 ? Math.min((achieved / objective) * 100, 100) : 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-mini text-gray-350 mb-2">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-accent-teal" />
          <span>Logrado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-gray-200" />
          <span>Objetivo</span>
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full bg-accent-teal" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const AssignmentPanel = ({ card }: { card: AssignmentCard }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-mini font-semibold text-accent-purple">{card.title}</div>
        <div className="flex items-center gap-2 text-mini text-gray-600">
          <span className="rounded-md border border-gray-200 px-2 py-0.5 bg-white">Todas</span>
          <span className="rounded-md border border-gray-200 px-2 py-0.5 bg-white">Selección</span>
        </div>
      </div>

      <div className="text-mid text-gray-600 mb-3">
        Total&nbsp;&nbsp;
        <span className="font-semibold text-gray-900">{card.totalValue.toLocaleString()}</span>
        <span className="text-gray-350"> / {card.totalObjective.toLocaleString()}</span>
      </div>

      <div className="space-y-2">
        {card.rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-mini">
            <div className="text-gray-600">{r.label}</div>
            <div className="flex items-center gap-2">
              <div className="text-gray-600">
                <span className="font-semibold text-gray-900">{r.value}</span>
                <span className="text-gray-350"> / {r.total}</span>
              </div>
              <span className={r.ok ? 'text-success' : 'text-error'}>{r.ok ? '●' : '●'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Link href="/backOffice" className="text-mini font-semibold text-blue-700">
          Plantilla Objetivos
        </Link>
      </div>
    </div>
  );
};

export const TerminalObjectivesPage = () => {
  return (
    <DashboardLayout>
      <div className="max-w-[1180px]">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/home" className="text-gray-600 text-mid">
                ←
              </Link>
              <h1 className="text-h1 font-bold text-gray-900">{mockHeader.title}</h1>
              <span className="text-mini text-error font-semibold ml-2">Desactivar</span>
            </div>
            <div className="text-mini text-gray-350">{mockHeader.range}</div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-lg bg-gray-900 px-4 py-2 text-mini font-semibold text-white">
              Nuevo objetivo +
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm mb-6">
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1">
              <ProgressBar achieved={mockHeader.achieved} objective={mockHeader.objective} />
            </div>
            <div className="text-right">
              <div className="text-datos font-bold text-gray-900 leading-none">
                {mockHeader.achieved.toLocaleString()}
                <span className="text-h3 font-semibold text-gray-350"> / {mockHeader.objective.toLocaleString()}</span>
              </div>
              <div className="text-mini text-gray-600 mt-2">{mockHeader.pct}%</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-h2 font-semibold text-gray-900 mb-3">Asignaciones departamento</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {departmentCards.map((card) => (
              <AssignmentPanel key={card.title} card={card} />
            ))}
          </div>
        </div>

        <div className="mb-10">
          <div className="text-h2 font-semibold text-gray-900 mb-3">Asignaciones personas</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {peopleCards.map((card) => (
              <AssignmentPanel key={card.title} card={card} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TerminalObjectivesPage;

