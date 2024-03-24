import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { IconProps } from './types';
import { cn } from '~/utils/';

const MessagesSquare = forwardRef<SVGSVGElement, IconProps>(({ className, ...props }, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={classNames(className, 'lucide lucide-messages-square')}
      ref={ref}
      {...props}
    >
      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
    </svg>
  );
});

MessagesSquare.displayName = 'MessagesSquare';

export default MessagesSquare;
