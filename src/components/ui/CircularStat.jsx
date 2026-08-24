import React from "react";

/**
 * Small ring/donut stat (pure CSS conic-gradient, no chart lib needed).
 * `percentage` and `value` should always be passed with real numbers —
 * callers are expected to fall back to 0 when the backend has no data,
 * rather than this component inventing anything.
 */
const CircularStat = ({ percentage = 0, color = "#22c55e", label, value }) => {
  const safePct = Math.min(100, Math.max(0, Number(percentage) || 0));
  const deg = safePct * 3.6;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(${color} ${deg}deg, #eef0f3 ${deg}deg)`,
        }}
      >
        <div className="absolute w-11 h-11 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center">
          <span className="text-xs sm:text-sm font-bold text-gray-800">
            {safePct}%
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-[11px] sm:text-xs text-gray-500">{label}</span>
      </div>
      <span className="text-xs sm:text-sm font-semibold text-gray-700">
        {value}
      </span>
    </div>
  );
};

export default CircularStat;
