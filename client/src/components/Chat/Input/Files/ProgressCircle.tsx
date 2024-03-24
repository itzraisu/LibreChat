import React, { CSSProperties } from 'react';

export default function ProgressCircle({
  circumference = 360,
  offset = 0,
  circleCSSProperties = { strokeDashoffset: 0 },
}: {
  circumference?: number;
  offset?: number;
  circleCSSProperties?: CSSProperties;
}) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black/5 text-white"
      role="progressbar"
      aria-valuenow={100 - (offset / circumference) * 100}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className="h-6 w-6"
      >
        <circle
          className="origin-[50%_50%] -rotate-90 stroke-gray-400"
          strokeWidth="10"
          fill="transparent"
          r="55"
          cx="60"
          cy="60"
          strokeLinecap="butt"
        />
        <circle
          className="origin-[50%_50%] -rotate-90 transition-[stroke-dashoffset]"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          fill="transparent"
          r="55"
          cx="60"
          cy="60"
          strokeLinecap="butt"
          transform-origin="50% 50%
