import React from 'react';

export default function DistrictGauge({ score, severity, color }) {
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score || 0));
  
  // Circumference for r=54 circle -> ~339.29
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  // We make it a 240 degree gauge arc
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - (arcLength * clampedScore) / 100;

  return (
    <div className="relative flex flex-col items-center justify-center p-2">
      <div className="relative h-44 w-44 flex items-center justify-center">
        <svg className="h-full w-full -rotate-120 transform" viewBox="0 0 120 120">
          {/* Background Track Arc */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth="10"
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            strokeLinecap="round"
          />

          {/* Active Risk Score Arc */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color || '#ef4444'}
            strokeWidth="11"
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0px 0px 8px ${color}80)`
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">Risk Score</span>
          <span 
            className="text-5xl font-extrabold tracking-tight font-heading my-0.5 text-glow-red transition-all duration-300"
            style={{ color: color }}
          >
            {clampedScore}
          </span>
          <span className="text-xs font-semibold text-slate-400">/ 100</span>
        </div>
      </div>

      {/* Threshold indicator markers */}
      <div className="w-full flex items-center justify-between px-6 text-[10px] font-medium text-slate-400 -mt-2">
        <span className="text-emerald-400">0 (Safe)</span>
        <span className="text-yellow-400">60 (Watch)</span>
        <span className="text-orange-400">75 (Warn)</span>
        <span className="text-red-400 font-bold">85+ (Evacuate)</span>
      </div>
    </div>
  );
}
