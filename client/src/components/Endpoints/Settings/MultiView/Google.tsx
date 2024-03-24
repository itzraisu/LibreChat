import Settings from '../Google';
import Examples from '../Examples';
import { useSetOptions } from '~/hooks';
import { useRecoilValue } from 'recoil';
import type { Conversation, OptionSettings } from '~/types';
import store from '~/store';

export default function GoogleView({
  conversation,
  models,
  isPreset = false,
}: {
  conversation: Conversation | null;
  models: unknown[];
  isPreset?: boolean;
}) {
  const optionSettings = useRecoilValue<OptionSettings>(store.optionSettings);
  const {
    setOption,
    setExample,
    addExample,
    removeExample,
  } = useSetOptions(isPreset ? conversation : null);

  if (!conversation) {
    return null;
  }

  const { examples = [] } = conversation;
  const { showExamples, isCodeChat } = optionSettings;

  return showExamples && !isCodeChat ? (
    <Examples
      key={conversation.id}
      examples={examples}
      setExample={setExample}
      addExample={addExample}
      removeExample={removeExample}
    />
  ) : (
    <Settings
      conversation={conversation}
      setOption={setOption}
      models={models}
    />
  );
}

