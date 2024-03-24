import React, { useCallback, useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import SelectDropDown, { TDropDownOption } from '~/components/SelectDropDown';
import {
  Input,
  Label,
  Slider,
  InputNumber,
  HoverCard,
  HoverCardTrigger,
} from '~/components';
import OptionHover from './OptionHover';
import { TModelSelectProps, ESide } from '~/common';
import { cn, defaultTextProps, optionText, removeFocusOutlines } from '~/utils/';
import { useLocalize } from '~/hooks';

type TSettingsProps = TModelSelectProps & {
  defaultValues?: {
    model?: string;
    chatGptLabel?: string;
    promptPrefix?: string;
    temperature?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
  };
};

export default function Settings({
  conversation,
  setOption,
  models,
  readonly,
  defaultValues,
}: TSettingsProps) {
  const localize = useLocalize();
  const [model, setModel] = useState(conversation?.model ?? defaultValues?.model);
  const [chatGptLabel, setChatGptLabel] = useState(
    conversation?.chatGptLabel ?? defaultValues?.chatGptLabel,
  );
  const [promptPrefix, setPromptPrefix] = useState(
    conversation?.promptPrefix ?? defaultValues?.promptPrefix,
  );
  const [temperature, setTemperature] = useState(
    conversation?.temperature ?? (defaultValues?.temperature ?? 0.8),
  );
  const [topP, setTopP] = useState(conversation?.top_p ?? (defaultValues?.top_p ?? 1));
  const [freqP, setFreqP] = useState(
    conversation?.frequency_penalty ?? (defaultValues?.frequency_penalty ?? 0),
  );
  const [presP, setPresP] = useState(
    conversation?.presence_penalty ?? (defaultValues?.presence_penalty ?? 0),
  );

  const toolsSelected = conversation?.tools && conversation.tools.length > 0;

  const handleTextareaAutosizeFocus = useCallback(() => {
    if (toolsSelected) {
      setPromptPrefix('');
    }
  }, [toolsSelected]);

  const handleTextareaAutosizeBlur = useCallback(() => {
    if (!toolsSelected && !promptPrefix) {
      setPromptPrefix(defaultValues?.promptPrefix ?? '');
    }
  }, [toolsSelected, promptPrefix, defaultValues]);

  const handleTextareaAutosizeKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' || event.key === 'Escape') {
        event.preventDefault();
      }
    },
    [],
  );

  const handleTextareaAutosizeChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPromptPrefix(event.target.value);
    },
    [],
  );

  const handleInputNumberFocus = useCallback((name: string) => {
    if (toolsSelected) {
      switch (name) {
        case 'temp':
          setTemperature(0.8);
          break;
        case 'topp':
          setTopP
