npm install react-icons


import React from 'react';
import { HiSwitchHorizontal } from 'react-icons/hi';

export default function SwitchIcon({ size = 24, className }) {
  return <HiSwitchHorizontal className={className} size={size} />;
}
