/**
 * @biosstel/ui - ClockArc
 * Semi-circular gauge for time tracking (fichajes). Variants: gray, green, red.
 * Progress 0–100 moves the knob along the arc. Uses CSS vars: --color-arc-gray, --color-arc-green, --color-arc-red.
 */

'use client';

export interface ClockArcProps {
  variant?: 'gray' | 'green' | 'red';
  progress?: number;
}

function cubicBezier(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

function getKnobPosition(progress: number) {
  const p = Math.max(0, Math.min(100, progress));
  if (p <= 48) {
    const t = p / 48;
    return {
      x: cubicBezier(t, 7, 7, 47.29, 97),
      y: cubicBezier(t, 84, 39.82, 4, 4),
    };
  }
  if (p <= 52) {
    const t = (p - 48) / 4;
    return { x: 97 + t * 12, y: 4 };
  }
  const t = (p - 52) / 48;
  return {
    x: cubicBezier(t, 109, 158.71, 199, 199),
    y: cubicBezier(t, 4, 4, 39.82, 84),
  };
}

const VARIANT_COLOR = {
  gray: 'var(--color-arc-gray, #dedede)',
  green: 'var(--color-arc-green, #21b158)',
  red: 'var(--color-arc-red, #c71d3a)',
};

export function ClockArc({ variant = 'gray', progress = 0 }: ClockArcProps) {
  const color = VARIANT_COLOR[variant];
  const knob = getKnobPosition(progress);

  return (
    <div className="relative w-[206px] h-[92px]">
      <svg
        viewBox="-3 -5 214 102"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d="M 7 84 C 7 39.82 47.29 4 97 4"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 199 84 C 199 39.82 158.71 4 109 4"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx={knob.x} cy={knob.y} r="6" fill="white" stroke={color} strokeWidth="4" />
      </svg>
      {/* Clock icon in center (inline SVG, no Image) */}
      <svg
        width="30"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    </div>
  );
}

export default ClockArc;
