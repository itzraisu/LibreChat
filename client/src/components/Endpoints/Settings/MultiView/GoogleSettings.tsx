import Settings from '../Google/Settings';
import Examples from '../Examples';
import { useSetIndexOptions } from '~/hooks';
import { useChatContext } from '~/Providers';

export default function GoogleView({ conversation, models, isPreset = false }) {
  const { optionSettings } = useChatContext();
  const {
    setOption,
    setExample,
    addExample,
    removeExample,
  } = useSetIndexOptions(isPreset ? conversation : null);

  if (!conversation) {
    return null;
  }

  const { examples, model } = conversation;
  const isGenerativeModel = /gemini/.test(model?.toLowerCase() || '');
  const isChatModel = !isGenerativeModel && /chat/.test(model?.toLowerCase() || '');
  const isTextModel = !isGenerativeModel && !isChatModel && /code|text/.test(model || '');
  const { showExamples } = optionSettings;

  return showExamples && isChatModel && !isTextModel ? (
    <Examples
      examples={examples || [{ input: { content: '' }, output: { content: '' } }]}
      setExample={setExample}
      addExample={addExample}
      removeExample={removeExample}
    />
  ) : (
    <Settings conversation={conversation} setOption={setOption} models={models} />
  );
}


