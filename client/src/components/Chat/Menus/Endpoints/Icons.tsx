import { EModelEndpoint } from 'librechat-data-provider';
import {
  MinimalPlugin,
  GPTIcon,
  AnthropicIcon,
  AzureMinimalIcon,
  BingAIMinimalIcon,
  GoogleMinimalIcon,
  CustomMinimalIcon,
  AssistantIcon,
  LightningIcon,
  Sparkles,
} from '~/components/svg';
import UnknownIcon from './UnknownIcon';
import { cn } from '~/utils';

export const icons = {
  [EModelEndpoint.azureOpenAI]: AzureMinimalIcon,
  [EModelEndpoint.openAI]: GPTIcon,
  [EModelEndpoint.gptPlugins]: MinimalPlugin,
  [EModelEndpoint.anthropic]: AnthropicIcon,
  [EModelEndpoint.chatGPTBrowser]: LightningIcon,
  [EModelEndpoint.google]: GoogleMinimalIcon,
  [EModelEndpoint.bingAI]: BingAIMinimalIcon,
  [EModelEndpoint.custom]: CustomMinimalIcon,
  [EModelEndpoint.assistants]: ({
    className,
    assistantName,
    avatar,
    size = 16,
  }: {
    className?: string;
    assistantName?: string;
    avatar?: string;
    size?: number;
  }) => {
    if (ass
