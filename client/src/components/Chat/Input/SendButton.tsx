import React, { forwardRef } from 'react';
import { useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '~/components/ui';
import { SendIcon } from '~/components/svg';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

type SubmitButtonProps = {
  disabled: boolean;
  'data-testid'?: string;
};

const SubmitButton = React.memo(
  forwardRef<HTMLButtonElement, SubmitButtonProps>(({ disabled, 'data-testid': dataTestId }, ref) => {
    const localize = useLocalize();
    return (
      <TooltipProvider delayDuration={250}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              ref={ref}
              disabled={disabled}
              className={cn(
                'absolute bottom-1.5 right-2 rounded border p-0.5 transition-colors enabled:bg-black disabled:bg-black disabled:text-gray-400 disabled:opacity-10 dark:border-white dark:bg-white dark:disabled:bg-white md:bottom-3 md:right-3',
              )}
              data-testid={dataTestId}
              type="submit"
            >
              <span className="" data-state="closed">
                <SendIcon size={24} />
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={10} title={localize('com_nav_send_message')}>
            {localize('com_nav_send_message')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }),
);

type SendButtonProps = {
  control: Control<{ text: string }>;
};

const SendButton = React.memo(
  forwardRef<HTMLButtonElement, SendButtonProps>(({ control }, ref) => {
    const data = useWatch({ control });
    return <SubmitButton ref={ref} disabled={!data?.text} data-testid="send-button" />;
  }),
);

export default SendButton
