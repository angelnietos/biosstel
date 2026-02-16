/**
 * @biosstel/dashboard - Objective Card Component
 * 
 * Card displaying objective progress with achieved vs target values.
 */

'use client';

export interface ObjectiveCardProps {
  title: string;
  achieved: number;
  objective: number;
  unit?: string;
}

export const ObjectiveCard = ({ title, achieved, objective, unit = '' }: ObjectiveCardProps) => {
  const percentage = objective > 0 ? Math.min((achieved / objective) * 100, 100) : 0;
  const isExceeded = achieved > objective;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {achieved.toLocaleString()}
            </span>
            {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Objetivo</div>
            <div className="text-lg font-semibold text-gray-700">
              {objective.toLocaleString()} {unit}
            </div>
          </div>
        </div>

        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isExceeded
                ? 'bg-green-500'
                : percentage >= 75
                ? 'bg-blue-500'
                : percentage >= 50
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="text-sm font-medium text-gray-700">
          {percentage.toFixed(0)}% {isExceeded && '(Objetivo superado)'}
        </div>
      </div>
    </div>
  );
};

export default ObjectiveCard;
