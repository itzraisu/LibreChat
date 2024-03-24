import React from 'react';

type GeminiIconProps = {
  size?: number;
  className?: string;
};

export default function GeminiIcon({ size = 25, className = '' }: GeminiIconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 18 18"
      preserveAspectRatio="xMidYMid meet"
      stroke="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="url(#_4rif_paint0_radial_897_42)"
        d="M9 18c0-1.245-.24-2.415-.72-3.51a8.934 8.934 0 00-1.912-2.857A8.934 8.934 0 003.51 9.72 8.646 8.646 0 000 9a8.886 8.886 0 003.51-.697 9.247 9.247 0 002.857-1.936A8.934 8.934 0 008.28 3.51C8.76 2.41
