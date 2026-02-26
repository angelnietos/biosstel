'use client';

import { useState } from 'react';
import { 
  Card, 
  DepartmentBadge, 
  IconButton, 
  NumberInput,
  CheckIcon,
  PlusGreenIcon,
  MinusRedIcon,
  ActivatedIcon,
  DeactivatedIcon,
  // Text removed
} from '@biosstel/ui';
import {
  type ThemeColor,
  OBJECTIVE_COLOR_MAP,
  formatNumber,
} from '../../../data-access/models';

// Types adapted from junior version
export interface AssignmentRowData {
  id: string; // or number, aligning with shared-types
  name: string;
  achieved: number;
  target: number;
  assigned?: boolean;
}

interface AssignmentRowProps {
  name: string;
  achieved: number;
  target: number;
  assigned?: boolean;
  isEditing?: boolean;
}

const RowToggleButton = ({
  rowActive,
  onClick,
}: {
  rowActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-4 h-4 flex items-center justify-center rounded-full bg-white shadow-sm cursor-pointer shrink-0 border border-gray-100 hover:bg-gray-50"
  >
    {rowActive ? <MinusRedIcon className="w-[7px] h-[7px]" /> : <PlusGreenIcon className="w-[7px] h-[7px]" />}
  </button>
);

const AssignmentRow = ({
  name,
  achieved,
  target,
  assigned = true,
  isEditing = false,
}: AssignmentRowProps) => {
  const [editedTarget, setEditedTarget] = useState(target);
  const [rowActive, setRowActive] = useState(assigned);

  return (
    <div className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm font-medium text-gray-900 truncate flex-1">
        {name}
      </span>
      {rowActive && (
        <span className="flex items-baseline gap-1 shrink-0">
          <span className="text-sm font-semibold text-gray-900">
            {formatNumber(achieved)}
          </span>
          <span className="text-sm font-medium text-gray-400">/</span>
          {isEditing ? (
            <NumberInput
              value={editedTarget}
              onChange={(value) => setEditedTarget(Number(value) || 0)}
              className="text-sm font-semibold text-blue-600 text-right w-16 border-b border-blue-200"
            />
          ) : (
            <span
              className={`text-sm font-semibold ${
                achieved >= target ? 'text-[#185c80]' : 'text-gray-400'
              }`}
            >
              {formatNumber(target)}
            </span>
          )}
        </span>
      )}
      <div className={`shrink-0 ${rowActive ? '' : 'invisible'}`}>
         <CheckIcon className="w-3 h-3 text-[#21b158]" />
      </div>
      {isEditing && (
        <RowToggleButton
          rowActive={rowActive}
          onClick={() => setRowActive((prev) => !prev)}
        />
      )}
    </div>
  );
};

export interface AssignmentCardProps {
  title: string;
  color: ThemeColor;
  rows: AssignmentRowData[];
  totalAchieved?: number;
  totalTarget?: number;
  active?: boolean;
  onToggle?: () => void;
  /** Id de la asignación (para eliminar desde API). */
  assignmentId?: string;
  onRemove?: (assignmentId: string) => void;
  footerLabel?: string;
  onFooterClick?: () => void;
  isEditing?: boolean;
  className?: string; // replacing cssProps
}

export const AssignmentCard = ({
  title,
  color,
  rows,
  totalAchieved,
  totalTarget,
  active = true,
  onToggle,
  footerLabel,
  onFooterClick,
  isEditing = false,
  assignmentId,
  onRemove,
  className = '',
}: AssignmentCardProps) => {
  const [editedTotalTarget, setEditedTotalTarget] = useState(totalTarget ?? 0);
  const colors = OBJECTIVE_COLOR_MAP[color] || OBJECTIVE_COLOR_MAP.blue;
  const showRemove = isEditing && assignmentId && onRemove;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Card className="px-5 py-4 flex flex-col gap-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isEditing && onToggle && (
              <IconButton
                onClick={onToggle}
                className="border border-gray-200 bg-white shadow-sm w-7 h-7"
              >
                 {active ? <ActivatedIcon className="w-4 h-4" /> : <DeactivatedIcon className="w-4 h-4" />}
              </IconButton>
            )}
            <DepartmentBadge
              label={title}
              textClass={colors.title}
              bgClass={colors.titleBg}
            />
          </div>
          {showRemove && (
            <IconButton
              onClick={() => onRemove(assignmentId)}
              className="border border-red-200 bg-white shadow-sm w-7 h-7 hover:bg-red-50"
              title="Eliminar asignación"
            >
              <MinusRedIcon className="w-4 h-4" />
            </IconButton>
          )}
        </div>

        {totalAchieved !== undefined && totalTarget !== undefined && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-gray-900">Total</span>
            <span className="text-xl font-semibold text-gray-900">
              {formatNumber(totalAchieved)}
            </span>
            <span className="text-xl font-semibold text-gray-300">/</span>
            {isEditing ? (
              <NumberInput
                value={editedTotalTarget}
                onChange={(value) => setEditedTotalTarget(Number(value) || 0)}
                className="text-xl font-semibold text-gray-300 text-right w-20 border-b border-gray-200"
              />
            ) : (
              <span className="text-xl font-semibold text-gray-300">
                {formatNumber(totalTarget)}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col max-h-[200px] overflow-y-auto pr-1">
          {rows.map((row) => (
            <AssignmentRow
              key={row.id}
              name={row.name}
              achieved={row.achieved}
              target={row.target}
              assigned={row.assigned}
              isEditing={isEditing}
            />
          ))}
        </div>
      </Card>

      {footerLabel && (
        <button
          type="button"
          onClick={onFooterClick}
          className="text-sm font-medium text-[#185c80] hover:text-[#185c80]/70 transition-colors underline text-left px-5 cursor-pointer w-fit"
        >
          {footerLabel}
        </button>
      )}
    </div>
  );
};
