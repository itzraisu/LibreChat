import { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { EModelEndpoint, endpointSettings } from 'librechat-data-provider';
import type { TModelSelectProps } from '~/common';
import { ESide } from '~/common';
import {
  SelectDropDown,
  Input,
  Label,
  Slider,
  InputNumber,
  HoverCard,
  HoverCardTrigger,
} from '~/components/ui';
import OptionHover from './OptionHover';
import { cn, defaultTextProps, optionText, removeFocusOutlines } from '~/utils/';
import { useLocalize } from '~/hooks';

export default function Settings({
  conversation,
  setOption,
  models,
  readonly,
}: TModelSelectProps) {
  const localize = useLocalize();
  const google = endpointSettings[EModelEndpoint.google];
  const [model, setModelInternal] = useState<string>(conversation?.model ?? '');
  const {
    modelLabel,
    promptPrefix,
    temperature,
    topP,
    topK,
    maxOutputTokens,
  } = conversation ?? {};

  const isGeminiPro = model?.toLowerCase()?.includes('gemini-pro');

  const maxOutputTokensMax = isGeminiPro
    ? google.maxOutputTokens.maxGeminiPro
    : google.maxOutputTokens.max;
  const maxOutputTokensDefault = isGeminiPro
    ? google.maxOutputTokens.defaultGeminiPro
    : google.maxOutputTokens.default;

  useEffect(() => {
    if (model) {
      setOption('maxOutputTokens')(Math.min(Number(maxOutputTokens) ?? 0, maxOutputTokensMax));
    }
  }, [model]);

  useEffect(() => {
    setModelInternal(conversation?.model ?? '');
  }, [conversation?.model]);

  const isGenerativeModel = model?.toLowerCase()?.includes('gemini');
  const isChatModel = !isGenerativeModel && model?.toLowerCase()?.includes('chat');
  const isTextModel = !isGenerativeModel && !isChatModel && /code|text/.test(model ?? '');

  const setModel = (value: string) => {
    setModelInternal(value);
    setOption('model')(value);
  };

  const setModelLabelInternal = (value: string | null) => {
    setOption('modelLabel')(value);
  };

  const setPromptPrefixInternal = (value: string | null) => {
    setOption('promptPrefix')(value);
  };

  const setTemperatureInternal = (value: number | null) => {
    setOption('temperature')(value ?? google.temperature.default);
  };

  const setTopPInternal = (value: number | null) => {
    setOption('topP')(value ?? google.topP.default);
  };

  const setTopKInternal = (value: number | null) => {
    setOption('topK')(value ?? google.topK.default);
  };

  const setMaxOutputTokensInternal = (value: number | null) => {
    setOption('maxOutputTokens')(value ?? maxOutputTokensDefault);
  };

  if (!conversation) {
    return null;
  }

  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="col-span-5 flex flex-col items-center justify-start gap-6 sm:col-span-3">
        <div className="grid w-full items-center gap-2">
          <SelectDropDown
            value={model}
            setValue={setModel}
            availableValues={models}
            disabled={readonly}
            className={cn(defaultTextProps, 'flex w-full resize-none', removeFocusOutlines)}
            containerClassName="flex w-full resize-none"
          />
        </div>
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="modelLabel" className="text-left text-sm font-medium">
            {localize('com_endpoint_custom_name')}{' '}
            <small className="opacity-40">({localize('com_endpoint_default_blank')})</small>
          </Label>
          <Input
            id="modelLabel"
            disabled={readonly}
            value={modelLabel || ''}
            onChange={(e) => setModelLabelInternal(e.target.value ?? null)}
            placeholder={localize('com_endpoint_google_custom_name_placeholder')}
            className={cn(
              defaultTextProps,
              'flex h-10 max-h-10 w-full resize-none px-3 py-2',
              removeFocusOutlines,
            )}
          />
        </div>
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="promptPrefix" className="text-left text-sm font-medium">
            {localize('com_endpoint_prompt_prefix')}{' '}
            <small className="opacity-40">({localize('com_endpoint_default_blank')})</small>
          </Label>
          <TextareaAutosize
            id="promptPrefix"
            disabled={readonly}
            value={promptPrefix || ''}
            onChange={(e) => setPromptPrefixInternal(e.target.value ?? null)}
            placeholder={localize('com_endpoint_prompt_prefix_placeholder')}
            className={cn(
              defaultTextProps,
              'flex max-h-[138px] min-h-[100px] w-full resize-none px-3 py-2 ',
            )}
          />
        </div>
      </div>
      <div className="col-span-5 flex flex-col items-center justify-start gap-6 px-3 sm:col-span-2">
        <HoverCard openDelay={300}>
          <HoverCardTrigger className="grid w-full items-center
