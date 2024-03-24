import React from 'react';
import { HoverCardPortal, HoverCardContent } from '~/components/ui';
import { ESide } from '~/common';
import { useLocalize } from '~/hooks';

type TOptionHoverProps = {
  endpoint: string;
  type: string;
  side: ESide;
};

const openAI = {
  max: 'com_endpoint_openai_max',
  temp: 'com_endpoint_openai_temp',
  topp: 'com_endpoint_openai_topp',
  freq: 'com_endpoint_openai_freq',
  pres: 'com_endpoint_openai_pres',
  resend: 'com_endpoint_openai_resend_files',
  detail: 'com_endpoint_openai_detail',
} as const;

const types = {
  anthropic: {
    temp: 'com_endpoint_anthropic_temp',
    topp: 'com_endpoint_anthropic_topp',
    topk: 'com_endpoint_anthropic_topk',
    maxoutputtokens: 'com_endpoint_anthropic_maxoutputtokens',
    resend: openAI.resend,
  },
  google: {
    temp: 'com_endpoint_google_temp',
    topp: 'com_endpoint_google_topp',
    topk: 'com_endpoint_google_topk',
    maxoutputtokens: 'com_endpoint_google_maxoutputtokens',
  },
  openAI,
  azureOpenAI: openAI,
  gptPlugins: {
    func: 'com_endpoint_func_hover',
    skip: 'com_endpoint_skip_hover',
    ...openAI,
  },
} as const;

function isKeyInObject<T extends object, K extends keyof T>(obj: T, key: K): key is K {
  return key in obj;
}

function OptionHover({ endpoint, type, side }: TOptionHoverProps) {
  const localize = useLocalize();
  if (!isKeyInObject(types, endpoint)) {
    return null;
  }
  const typeObj = types
