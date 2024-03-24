import { EModelEndpoint } from 'librechat-data-provider';
import UnknownIcon from '~/components/Chat/Menus/Endpoints/UnknownIcon';
import {
  Plugin,
  GPTIcon,
  UserIcon,
  PaLMIcon,
  CodeyIcon,
  GeminiIcon,
  AssistantIcon,
  AnthropicIcon,
  AzureMinimalIcon,
  CustomMinimalIcon,
} from '~/components/svg';
import { useAuthContext } from '~/hooks/AuthContext';
import useAvatar from '~/hooks/Messages/useAvatar';
import { IconProps } from '~/common';
import { cn } from '~/utils';

const endpointIcons = {
  [EModelEndpoint.assistants]: {
    icon: AssistanceIcon,
    name: 'Assistants',
  },
  [EModelEndpoint.azureOpenAI]: {
    icon: AzureMinimalIcon,
    bg: 'linear-gradient(0.375turn, #61bde2, #4389d0)',
    name: 'ChatGPT',
  },
  [EModelEndpoint.openAI]: {
    icon: GPTIcon,
    bg:
      typeof model === 'string' && model.toLowerCase().includes('gpt-4')
        ? '#AB68FF'
        : '#19C37D',
    name: 'ChatGPT',
  },
  [EModelEndpoint.gptPlugins]: {
    icon: Plugin,
    bg: `rgba(69, 89, 164, ${button ? 0.75 : 1})`,
    name: 'Plugins',
  },
  [EModelEndpoint.google]: {
    icon: (model) => {
      if (model?.toLowerCase()?.includes('code')) return CodeyIcon;
      if (model?.toLowerCase()?.includes('gemini')) return GeminiIcon;
      return PaLMIcon;
    },
    name: (model) =>
      model?.toLowerCase()?.includes('code')
        ? 'Codey'
        : model?.toLowerCase()?.includes('gemini')
          ? 'Gemini'
          : 'PaLM2',
  },
  [EModelEndpoint.anthropic]: {
    icon: AnthropicIcon,
    bg: '#d09a74',
    name: 'Claude',
  },
  [EModelEndpoint.bingAI]: {
    icon: (jailbreak) =>
      jailbreak ? BingAIJailbreakIcon : BingAISydneyIcon,
    name: (jailbreak) =>
      jailbreak ? 'Sydney' : 'BingAI',
  },
  [EModelEndpoint.chatGPTBrowser]: {
    icon: GPTIcon,
    bg:
      typeof model === 'string' && model.toLowerCase().includes('gpt-4')
        ? '#AB68FF'
        : `rgba(0, 163, 255, ${button ? 0.75 : 1})`,
    name: 'ChatGPT',
  },
  [EModelEndpoint.custom]: {
    icon: CustomMinimalIcon,
    name: 'Custom',
  },
  null: { icon: GPTIcon, bg: 'grey', name: 'N/A' },
  default: {
    icon: UnknownIcon,
    name: (endpoint) => endpoint ?? '',
  },
};

const Icon: React.FC<IconProps> = (props) => {
  const { user } = useAuthContext();
  const {
    size = 30,
    isCreatedByUser,
    button,
    model = '',
    endpoint,
    error,
    jailbreak,
    assistantName,
  } = props;

  const avatarSrc = useAvatar(user);

  const EndpointIcon = endpointIcons[endpoint]?.icon || endpointIcons.default.icon;
  const icon =
    isCreatedByUser && !user?.avatar && !user?.username ? (
      <UserIcon size={size} />
    ) : (
      <EndpointIcon
        size={size}
        model={model}
        jailbreak={jailbreak}
        assistantName={assistantName}
      />
    );

  const bg = endpointIcons[endpoint]?.bg;
  const name = endpointIcons[endpoint]?.name || endpointIcons.default.name(endpoint);

  if (isCreatedByUser) {
    const username = user?.name || 'User';

    return (
      <div
        title={username}
        style={{
          width: size,
          height: size,
        }}
        className={cn('relative flex items-center justify-center', props.className ?? '')}
      >
        {!user?.avatar && !user?.username ? (
          <div
            style={{
              backgroundColor: 'rgb(121, 137, 255)',
              width: '20px',
              height: '20px',
              boxShadow: 'rgba(240, 246, 252, 0.1) 0px 0px 0px 1px',
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-sm p-1 text-white"
          >
            <UserIcon />
          </div>
        ) : (
          <img className="rounded-full" src={user?.avatar || avatarSrc} alt="avatar" />
        )}
      </div>
    );
  }

  return (
    <div
      title={name}
      style={{
        background: bg || 'transparent',
        width: size,
        height: size,
      }}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-sm p-1 text-white',
        props.className || '',
      )}
    >
      {icon}
      {error && (
        <span className="absolute right-0 top-[20px] -mr-2 flex h-3 w-3 items-center justify
