import React from 'react';
import { Root, Trigger, Content, Portal } from '@radix-ui/react-popover';
import MenuItem from '~/components/Chat/Menus/UI/MenuItem';
import type { Option } from '~/common';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils/';
import { useMultiSearch } from './MultiSearch';

type SelectDropDownProps = {
  id?: string;
  label?: string;
  value: string | null | Option;
  disabled?: boolean;
  onChange: (value: string) => void;
  options: string[] | Option[];
  emptyLabel?: boolean;
  showAbove?: boolean;
  showLabel?: boolean;
  iconSide?: 'left' | 'right';
  renderOption?: (option: string | Option) => React.ReactNode;
};

function SelectDropDownPop({
  id,
  label,
  value,
  disabled,
  onChange,
  options,
  emptyLabel = false,
  showAbove = false,
  showLabel = true,
  iconSide = 'right',
  renderOption,
}: SelectDropDownProps) {
  const localize = useLocalize();
  const transitionProps = { className: 'top-full mt-3' };
  if (showAbove) {
    transitionProps.className = 'bottom-full mb-3';
  }

  let displayedLabel = label;

  if (emptyLabel) {
    displayedLabel = '';
  } else if (!label) {
    displayedLabel = localize('com_ui_model');
  }

  // Determine if we should convert this component into a searchable select.  If we have enough elements, a search
  // input will appear near the top of the menu, allowing correct filtering of different model menu items. This will
  // reset once the component is unmounted (as per a normal search)
  const [filteredOptions, searchRender] = useMultiSearch<string[] | Option[]>(options);
  const hasSearchRender = Boolean(searchRender);
  const displayedOptions = hasSearchRender ? filteredOptions : options;

  return (
    <Root id={id}>
      <div className={'flex items-center justify-center gap-2 '}>
        <div className={'relative w-full'}>
          <Trigger asChild>
            <button
              data-testid="select-dropdown-button"
              className={cn(
                'pointer-cursor relative flex flex-col rounded-md border border-black/10 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-0 focus:ring-offset-0 dark:border-gray-700 dark:bg-gray-800 sm:text-sm',
                'hover:bg-gray-50 radix-state-open:bg-gray-50 dark:hover:bg-gray-700 dark:radix-state-open:bg-gray-700',
                disabled && 'opacity-50 cursor-not-allowed',
              )}
              disabled={disabled}
            >
              {showLabel && (
                <label className="block text-xs text-gray-700 dark:text-gray-500 ">{displayedLabel}</label>
              )}
              <span className="inline-flex w-full ">
                <span
                  className={cn(
                    'flex h-6 items-center gap-1  text-sm text-gray-800 dark:text-white',
                    !showLabel ? 'text-xs' : '',
                    'min-w-[75px] font-normal',
                  )}
                >
                  {/* {!showLabel && !emptyLabel && (
                    <span className="text-xs text-gray-700 dark:text-gray-500">{displayedLabel}:</span>
                  )} */}
                  {typeof value !== 'string' && value ? value?.label ?? '' : value ?? ''}
                </span>
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4  text-gray-400"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  style={showAbove ? { transform: 'scaleY(-1)' } : {}}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>
          </Trigger>
          <Portal>
            <Content
              side="bottom"
              align="start"
              className={cn(
                'mt-2 max-h-[52vh] min-w-full overflow-hidden overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-700 dark:text-white lg:max-h-[52vh]',
                hasSearchRender && 'relative',
              )}
            >
              {searchRender}
              {displayedOptions.map((option) => {
                return (
                  <MenuItem
                    key={option}
                    title={option}
                    value={option}
                    selected={!!(value && value === option)}
                    onClick={() => onChange(option)}
                  >
                    {renderOption?.(option)}
                  </MenuItem>
                );
              })}
            </Content>
          </Portal>
        </div>
      </div>
    </Root>
  );
}

export default SelectDropDownPop;
