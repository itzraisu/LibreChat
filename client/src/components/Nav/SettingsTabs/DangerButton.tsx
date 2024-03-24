import { forwardRef } from 'react';
import { DialogButton, DialogButtonProps } from '~/components/ui';
import { Spinner } from '~/components/svg';
import { cn } from '~/utils';
import type { TDangerButtonProps } from '~/common';
import { useLocalize } from '~/hooks';

type TDialogButtonWithMutationProps = DialogButtonProps & {
  mutation?: { isLoading: boolean };
};

const DialogButtonWithMutation = (props: TDialogButtonWithMutationProps) => {
  const { mutation, children, ...dialogButtonProps } = props;
  return <DialogButton {...dialogButtonProps}>{mutation && mutation.isLoading ? <Spinner /> : children}</DialogButton>;
};

const DangerButton = forwardRef((props: TDangerButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  const {
    id,
    onClick,
    mutation,
    disabled,
    confirmClear,
    infoTextCode,
    actionTextCode,
    className = '',
    showText = true,
    dataTestIdInitial,
    dataTestIdConfirm,
    confirmActionTextCode = 'com_ui_confirm_action',
    showConfirm = true,
    confirmLoading = false,
  } = props;
  const localize = useLocalize();

  return (
    <div className="flex items-center justify-between" data-testid={`danger-button-${id}`}>
      {showText && <div id={`info-text-${id}`} data-testid={dataTestIdInitial}> {localize(infoTextCode)} </div>}
      <DialogButtonWithMutation
        id={id}
        ref={ref}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          ' btn btn-danger relative border-none bg-red-700 text-white hover:bg-red-800 dark:hover:bg-red-80
