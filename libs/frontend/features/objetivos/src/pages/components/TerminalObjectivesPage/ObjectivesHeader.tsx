import { Card, LegendDot, ProgressBar } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import type { TerminalObjectivesHeader } from '@biosstel/shared-types';

type ObjectivesHeaderProps = {
  header?: TerminalObjectivesHeader | null;
  className?: string;
  isLoading?: boolean;
};

export const ObjectivesHeader = ({ header, className }: ObjectivesHeaderProps) => {
  return (
    <Card className={`p-5 shadow-sm ${className ?? ''}`}>
      <Stack gap={4}>
        <Stack direction="row" gap={4} align="center">
          <LegendDot color="#185c80" label="Logrado" />
          <LegendDot color="var(--color-gray-300)" label="Objetivo" />
        </Stack>
        <Stack direction="row" justify="between" align="end" gap={4}>
          <Stack direction="row" gap={2} align="baseline">
            <span className="text-[32px] font-semibold leading-[1] text-gray-900">
              {(header?.achieved ?? 0).toLocaleString()}
            </span>
            <span className="text-[32px] font-semibold leading-[1] text-gray-300">
              / {(header?.objective ?? 0).toLocaleString()}
            </span>
          </Stack>
          <span className="text-lg font-semibold text-[#185c80]">
            {header?.objective ? Math.min(Math.round((header.achieved ?? 0) / header.objective * 100), 100) : 0}%
          </span>
        </Stack>
        <div className="w-full" style={{ minHeight: 8 }}>
          <ProgressBar
            value={header?.objective ? (header.achieved ?? 0) / header.objective * 100 : 0}
            max={100}
            variant="default"
            className="w-full"
          />
        </div>
      </Stack>
    </Card>
  );
};
