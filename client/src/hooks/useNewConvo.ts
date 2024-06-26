import { useCallback, useMemo } from 'react';
import {
  useGetEndpointsQuery,
  useListAssistantsQuery,
  useDeleteFilesMutation,
} from 'librechat-data-provider';
import { useSetStorage, useOriginNavigate } from './useSetStorage';
import {
  TConversation,
  TSubmission,
  TPreset,
  TModelsConfig,
  TEndpointsConfig,
} from 'librechat-data-provider';
import {
  buildDefaultConvo,
  getDefaultEndpoint,
  getEndpointField,
  updateLastSelectedModel,
} from '~/utils';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import store from '~/store';

type UseNewConvoType = {
  switchToConversation: (
    conversation: TConversation,
    preset?: Partial<TPreset> | null,
    modelsData?: TModelsConfig,
    buildDefault?: boolean,
    keepLatestMessage?: boolean,
  ) => Promise<void>;
  newConversation: (
    params?: {
      template?: Partial<TConversation>;
      preset?: Partial<TPreset>;
      modelsData?: TModelsConfig;
      buildDefault?: boolean;
      keepLatestMessage?: boolean;
    },
  ) => Promise<void>;
};

export const useNewConvo = (index = 0): UseNewConvoType => {
  const setStorage = useSetStorage();
  const navigate = useOriginNavigate();
  const defaultPreset = useRecoilValue(store.defaultPreset);
  const { setConversation } = store.useCreateConversationAtom(index);
  const [files, setFiles] = useRecoilState(store.filesByIndex(index));
  const setSubmission = useSetRecoilState<TSubmission | null>(store.submissionByIndex(index));
  const resetLatestMessage = useResetRecoilState(store.latestMessageFamily(index));
  const { data: endpointsConfig = {} as TEndpointsConfig } = useGetEndpointsQuery();

  const { data: assistants = [] } = useListAssistantsQuery(defaultOrderQuery, {
    select: (res) =>
      res.data.map(({ id, name, metadata, model }) => ({ id, name, metadata, model })),
  });

  const { mutateAsync: deleteFilesMutateAsync } = useDeleteFilesMutation(
    {
      onSuccess: () => {
        console.log('Files deleted');
      },
      onError: (error) => {
        console.log('Error deleting files:', error);
      },
    },
  );

  const switchToConversation = useRecoilCallback(
    ({ snapshot }) =>
      async (
        conversation: TConversation,
        preset: Partial<TPreset> | null = null,
        modelsData?: TModelsConfig,
        buildDefault?: boolean,
        keepLatestMessage?: boolean,
      ) => {
        const modelsConfig = modelsData ?? snapshot.getLoadable(store.modelsConfig).contents;
        const { endpoint = null } = conversation;
        const buildDefaultConversation = endpoint === null || buildDefault;
        const activePreset =
          defaultPreset &&
          !preset &&
          (defaultPreset.endpoint === endpoint || !endpoint) &&
          buildDefaultConversation
            ? defaultPreset
            : preset;

        if (buildDefaultConversation) {
          const defaultEndpoint = getDefaultEndpoint({
            convoSetup: activePreset ?? conversation,
            endpointsConfig,
          });

          const endpointType = getEndpointField(endpointsConfig, defaultEndpoint, 'type');
          if (!conversation.endpointType && endpointType) {
            conversation.endpointType = endpointType;
          } else if (conversation.endpointType && !endpointType) {
            conversation.endpointType = undefined;
          }

          const isAssistantEndpoint = defaultEndpoint === EModelEndpoint.assistants;

          if (!conversation.assistant_id && isAssistantEndpoint) {
            conversation.assistant_id =
              localStorage.getItem(`assistant_id__${index}`) ?? assistants[0]?.id;
          }

          if (
            conversation.assistant_id &&
            isAssistantEndpoint &&
            conversation.conversationId === 'new'
          ) {
            const assistant = assistants.find(
              (assistant) => assistant.id === conversation.assistant_id,
            );
            conversation.model = assistant?.model;
            updateLastSelectedModel({
              endpoint: EModelEndpoint.assistants,
              model: conversation.model,
            });
          }

          if (conversation.assistant_id && !isAssistantEndpoint) {
            conversation.assistant_id = undefined;
          }

          const models = modelsConfig?.[defaultEndpoint] ?? [];
          conversation = buildDefaultConvo({
            conversation,
            lastConversationSetup: activePreset as TConversation,
            endpoint: defaultEndpoint,
            models,
          });
        }

        await setStorage(conversation);
        setConversation(conversation);
        setSubmission({} as TSubmission);
        if (!keepLatestMessage) {
          resetLatestMessage();
        }

        if (
          conversation.conversationId === 'new' &&
          !modelsData &&
          conversation.endpoint
        ) {
          const appTitle = localStorage.getItem('appTitle');
          if (appTitle) {
            document.title = appTitle;
          }
          navigate('new');
        }
      },
    [endpointsConfig, defaultPreset, assistants],
  );

  const newConversation = useCallback(
    async ({
      template = {},
      preset,
      modelsData,
      buildDefault = true,
     
