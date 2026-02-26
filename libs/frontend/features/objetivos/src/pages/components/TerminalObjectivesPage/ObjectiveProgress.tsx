'use client';

import { useState, useEffect } from 'react';
import { LegendDot, NumberInput } from '@biosstel/ui';
import {
  type ThemeColor,
  OBJECTIVE_COLOR_MAP,
  formatNumber,
} from '../../../data-access/models';

interface Props {
  achieved: number;
  target: number;
  color?: ThemeColor;
  centered?: boolean;
  isEditing?: boolean;
  /** Controlado: valor editado desde el padre (para Guardar configuración) */
  editedTarget?: number;
  onEditedTargetChange?: (value: number) => void;
}

export const ObjectiveProgress = ({
  achieved,
  target,
  color = 'blue',
  centered = false,
  isEditing = false,
  editedTarget: controlledTarget,
  onEditedTargetChange,
}: Props) => {
  const [internalTarget, setInternalTarget] = useState(target);
  useEffect(() => {
    setInternalTarget(target);
  }, [target]);
  const isControlled = controlledTarget !== undefined && onEditedTargetChange !== undefined;
  const editedTarget = isControlled ? controlledTarget : internalTarget;
  const setEditedTarget = isControlled ? onEditedTargetChange : setInternalTarget;
  const { text, bg } = OBJECTIVE_COLOR_MAP[color] || OBJECTIVE_COLOR_MAP.blue;

  const displayTarget = isEditing ? editedTarget : target;
  const ratio = displayTarget > 0 ? achieved / displayTarget : 0;
  const percentage = Math.round(ratio * 100);
  const progressWidth = Math.min(ratio * 100, 100);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className={`flex items-center gap-6${centered ? ' justify-center' : ''}`}>
        <LegendDot
          label="Logrado"
          colorClass={bg}
          textClass="text-muted"
          filled
          cssProps="scale-110"
        />
        <LegendDot
          label="Objetivo"
          colorClass={text}
          textClass="text-muted"
          cssProps="scale-110"
        />
      </div>

      <div
        className={`flex flex-wrap items-baseline gap-x-6 gap-y-2 ${centered ? 'justify-center' : 'justify-between'} mt-1`}
      >
        <div className="flex items-baseline gap-2 leading-none min-w-0">
          <span className="text-[34px] font-bold text-gray-900 tracking-tight">
            {achieved > 0 ? formatNumber(achieved) : '—'}
          </span>
          <span className={`text-[34px] font-medium ${text} opacity-80`}> / </span>
          {isEditing ? (
            <NumberInput
              value={editedTarget}
              onChange={(val) => setEditedTarget(val)}
              className={`text-[34px] font-bold text-gray-300 w-32 border-b border-gray-200 focus:border-blue-500 outline-none p-0 bg-transparent`}
            />
          ) : (
            <span className="text-[34px] font-bold text-[#D1D5DB]">
              {formatNumber(displayTarget)}
            </span>
          )}
        </div>

        <div className={`flex items-center gap-2 ${text} font-bold text-[18px] tracking-tight`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" className="opacity-0" /> {/* Just the ring for now */}
            {percentage >= 100 && (
              <path d="M9 12l2 2 4-4" />
            )}
          </svg>
          {percentage}%
        </div>
      </div>

      <div className="h-[7px] w-full rounded-full bg-[#F3F4F6] overflow-hidden mt-1">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-in-out ${bg} shadow-sm`}
          style={{ width: `${progressWidth}%` }}
        />
      </div>
    </div>
  );

};
