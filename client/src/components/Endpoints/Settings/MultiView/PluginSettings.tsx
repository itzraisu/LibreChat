import { Settings, AgentSettings } from '../Plugins';
import { useSetIndexOptions } from '~/hooks';
import { useChatContext } from '~/Providers';

export default function PluginsView({ conversation = {}, models = [], isPreset = false }) {
  const { showAgentSettings } = useChatContext();
  const { setOption, setAgentOption } = useSetIndexOptions(isPreset ? conversation : null);

  if (!conversation) {
    return null;
  }

  return (
    showAgentSettings ? (
      <AgentSettings
        conversation={conversation}
        setOption={setAgentOption}
        models={models}
      />
    ) : (
      <Settings
        conversation={conversation}
        setOption={setOption}
        models={models}
      />
    )
  );
}

