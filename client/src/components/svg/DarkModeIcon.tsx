import React from 'react';

type DarkModeIconProps = {
  className?: string;
  size?: string;
};

export default function DarkModeIcon({ className, size }: DarkModeIconProps) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-${size || '4'} w-${size || '4'} ${className}`}
      height={size || '1em'}
      width={size || '1em'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
