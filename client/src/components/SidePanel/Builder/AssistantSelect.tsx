import { Plus } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import {
  defaultAssistantFormValues,
  defaultOrderQuery,
  FileSources,
} from 'librechat-data-provider';
import type { UseFormReset } from 'react-hook-form';
import type { UseMutationResult } from '@tanstack/react-query';
import type { Assistant, AssistantCreateParams } from 'librechat-data-provider';
import type { AssistantForm, Actions, TAssistantOption, ExtendedFile } from '~/common';
import SelectDropDown from '~/components/ui/SelectDropDown';
import { useListAssistantsQuery } from '~/data-provider';
import { useFileMapContext } from '~/Providers';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils/';

const keys = new Set(['name', 'id', 'description', 'instructions', 'model']);

export default function AssistantSelect({
  reset,
  value,
  selectedAssistant,
  setCurrentAssistantId,
  createMutation,
}: {
  reset: UseFormReset<AssistantForm>;
  value: TAssistantOption;
  selectedAssistant: string | null;
  setCurrentAssistantId: React.Dispatch<React.SetStateAction<string | undefined>>;
  createMutation: UseMutationResult<Assistant, Error, AssistantCreateParams>;
}) {
  const localize = useLocalize();
  const fileMap = useFileMapContext();
  const lastSelectedAssistant = useRef<string | null>(null);

  const { data: assistants, isLoading } = useListAssistantsQuery(defaultOrderQuery, {
    select: (res) =>
      res.data.map((_assistant) => {
        const assistant = {
          ..._assistant,
          label: _assistant?.name ?? '',
          value: _assistant.id,
          files: _assistant?.file_ids ? ([] as Array<[string, ExtendedFile]>) : undefined,
        };

        if (assistant.files && _assistant.file_ids) {
          _assistant.file_ids.forEach((file_id) => {
            const file = fileMap?.[file_id];
            if (file) {
              assistant.files?.push([
                file_id,
                {
                  file_id: file.file_id,
                  type: file.type,
                  filepath: file.filepath,
                  filename: file.filename,
                  width: file.width,
                  height: file.height,
                  size: file.bytes,
                  preview: file.filepath,
                  progress: 1,
                  source: FileSources.openai,
                },
              ]);
            }
          });
        }
        return assistant;
      }),
  });

  const onSelect = useCallback(
    (value: string) => {
      const assistant = assistants?.find((assistant) => assistant.id === value);

      createMutation.reset();
      if (!assistant) {
        setCurrentAssistantId(undefined);
        return reset(defaultAssistantFormValues);
      }

      const update = {
        ...assistant,
        label: assistant?.name ?? '',
        value: assistant?.id ?? '',
      };

      const actions: Actions = {
        code_interpreter: false,
        retrieval: false,
      };

      assistant?.tools
        ?.filter((tool) => tool.type !== 'function')
        ?.map((tool) => tool.type)
        .forEach((tool) => {
          actions[tool] = true;
        });

      const functions =
        assistant?.tools
          ?.filter((tool) => tool.type === 'function')
          ?.map((tool) => tool.function?.name ?? '') ?? [];

      const formValues: Partial<AssistantForm & Actions> = {
        functions,
        ...actions,
        assistant: update,
        model: update.model,
      };

      Object.entries(assistant).forEach(([name, value]) => {
        if (typeof value === 'number') {
          return;
        } else if (typeof value === 'object') {
          return;
        }
        if (keys.has(name)) {
          formValues[name] = value;
        }
      });

      reset(formValues);
      setCurrentAssistantId(assistant?.id);
    },
    [assistants, reset, setCurrentAssistantId, createMutation],
  );

  useEffect(() => {
    if (selectedAssistant === lastSelectedAssistant.current) {
      return;
    }

    if (selectedAssistant && assistants) {
      lastSelectedAssistant.current = selectedAssistant;
      onSelect(selectedAssistant);
    }
  }, [selectedAssistant, assistants, onSelect]);

  const createAssistant = localize('com_ui_create') + ' ' + localize('com_ui_assistant');

  const options = isLoading
    ? [
        {
          label: 'Loading...',
          value: '',
        },
      ]
    : assistants;

  return (
    <SelectDropDown
      value={!value ? createAssistant : value}
      setValue={onSelect}
      availableValues={options}
      iconSide="left"
      showAbove={false}
      showLabel={false}
      emptyTitle={true}
      containerClassName="flex-grow"
      optionsClass="hover:bg-gray-20/50 dark:border-gray-700"
      optionsListClass="rounded-lg shadow-lg dark:bg-gray-850 dark:border-gray-700 dark:last:border"
      currentValueClass={cn(
        'text-md font-semibold text-gray-900 dark:text-white',
        value === '' ? 'text-gray-500' : '',
      )}
      className={cn(
        'mt-1 rounded
