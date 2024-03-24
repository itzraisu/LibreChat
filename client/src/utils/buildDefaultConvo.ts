import { parseConvo } from 'librechat-data-provider';
import getLocalStorageItems from './getLocalStorageItems';
import type { TConversation, EModelEndpoint } from 'librechat-data-provider';

type BuildDefaultConvoProps = {
  conversation: TConversation;
  endpoint?: EModelEndpoint;
  models: string[];
  lastConversationSetup?: TConversation | undefined;
};

const buildDefaultConvo = ({
  conversation,
  endpoint,
  models,
  lastConversationSetup,
}: BuildDefaultConvoProps): TConversation => {
  const { lastSelectedModel, lastSelectedTools, lastBingSettings } = getLocalStorageItems();
  const { jailbreak, toneStyle } = lastBingSettings || {};
  const endpointType = (lastConversationSetup?.endpointType || conversation?.endpointType) as EModelEndpoint;

  if (!endpoint) {
    return {
      ...conversation,
      endpointType,
      endpoint,
    };
  }

  const possibleModels = models.includes(lastConversationSetup?.model || lastSelectedModel?.[endpoint] || '')
    ? [lastConversationSetup?.model || lastSelectedModel?.[endpoint], ...models]
    : models;

  const secondaryModel =
    endpoint === 'gptPlugins'
      ? lastConversationSetup?.agentOptions?.model || lastSelectedModel?.secondaryModel
      : null;

  const secondaryModels = secondaryModel && models.includes(secondaryModel)
    ? [secondaryModel, ...models]
    : models;

  const convo = parseConvo({
    endpoint,
    endpointType,
    conversation: lastConversationSetup,
    possibleValues: {
      models: possibleModels,
      secondaryModels,
    },
  });

  const defaultConvo = {
    ...conversation,
    ...convo,
    endpointType,
    endpoint,
    tools: lastSelectedTools ?? conversation.tools,
    jailbreak: jailbreak ?? conversation.jailbreak,
    toneStyle: toneStyle ?? conversation.toneStyle,
  };

  return defaultConvo;
};

export default buildDefaultConvo;
