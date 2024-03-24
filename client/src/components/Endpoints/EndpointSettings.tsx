import { useRecoilValue } from 'recoil';
import { SettingsViews } from 'librechat-data-provider';
import type { TSettingsProps } from '~/common';
import { getSettings } from './Settings';
import { cn } from '~/utils';
import store, { ModelsConfig, CurrentSettingsView } from '~/store';

export default function Settings({
  conversation,
  setOption,
  isPreset = false,
  className = '',
  isMultiChat = false,
}: TSettingsProps & { isMultiChat?: boolean }) {
  const modelsConfig = useRecoilValue<ModelsConfig>(store.modelsConfig);
  const currentSettingsView = useRecoilValue<CurrentSettingsView>(store.currentSettingsView);

  if (!conversation?.endpoint || currentSettingsView !== SettingsViews.default) {
    return null;
  }

  const { settings, multiViewSettings } = await getSettings(isMultiChat);
  const { endpoint: _endpoint, endpointType } = conversation;
  const endpoint = endpointType ?? _endpoint;
  const models = modelsConfig?.[_endpoint] ?? [];
  const OptionComponent = settings[endpoint];

  if (OptionComponent) {
    return (
      <div
        key={endpoint}
        className={cn('hide-scrollbar h-[500px] overflow-y-auto md:mb-2 md:h-[350px]', className)}
      >
        <OptionComponent
          conversation={conversation}
          setOption={setOption}
          models={models}
          isPreset={isPreset}
        />
      </div>
    );
  }

  const MultiViewComponent = multiViewSettings[endpoint];

  if (!MultiViewComponent) {
    return null;
  }

  return (
    <div
      key={endpoint}
      className={cn('hide-scrollbar h-[500px] overflow-y-auto md:mb-2 md:h-[350px]', className)}
    >
      <MultiViewComponent conversation={conversation} models={models} isPreset={isPreset} />
    </div>
  );
}
