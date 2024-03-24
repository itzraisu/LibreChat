import { EModelEndpoint } from 'librechat-data-provider';
import type { TModelSelectProps } from '~/common';
import type { FC } from 'react';

import OpenAI from './OpenAI';
import BingAI from './BingAI';
import Google from './Google';
import Plugins from './Plugins';
import ChatGPT from './ChatGPT';
import Anthropic from './Anthropic';
import PluginsByIndex from './PluginsByIndex';

const options = {
  [EModelEndpoint.openAI]: OpenAI,
  [EModelEndpoint.custom]: OpenAI,
  [EModelEndpoint.azureOpenAI]: OpenAI,
  [EModelEndpoint.bingAI]: BingAI,
  [EModelEndpoint.google]: Google,
  [EModelEndpoint.gptPlugins]: Plugins,
  [EModelEndpoint.anthropic]: Anthropic,
  [EModelEndpoint.chatGPTBrowser]: ChatGPT,
} as const;

type TOptios = typeof options;
type TMultiChatOptions = { [K in keyof TOptios]: TOptios[K] extends FC<TModelSelectProps> ? TOptios[K] : never };

const multiChatOptions: TMultiChatOptions = {
  ...options,
  [EModelEndpoint.gpt
