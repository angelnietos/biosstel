'use client';

import { Card, Heading } from '@biosstel/ui';
import { ObjectiveProgress } from '../TerminalObjectivesPage/ObjectiveProgress';
import type { ThemeColor } from '../../../data-access/models';
import { Link } from '@biosstel/platform';

interface Props {
  name: string;
  achieved: number;
  target: number;
  color: ThemeColor;
  isPending?: boolean;
  href: string;
}

export const FamilyObjectiveCard = ({
  name,
  achieved,
  target,
  color,
  isPending = false,
  href,
}: Props) => {
  return (
    <Link href={href}>
      <Card className="h-full overflow-hidden px-6 py-5 flex flex-col gap-3 cursor-pointer hover:shadow-md transition-all group border border-gray-100 hover:border-gray-200">
        <div className="flex items-center justify-between gap-2">
          <Heading level={3} className="text-[18px] font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
            {name}
          </Heading>
          {isPending && (
            <span className="shrink-0 rounded border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-[10px] font-semibold text-yellow-700 shadow-sm uppercase tracking-wider">
              Pendiente config.
            </span>
          )}
        </div>
        <ObjectiveProgress
          achieved={achieved}
          target={target}
          color={color}
        />
      </Card>
    </Link>
  );
};
