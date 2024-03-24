import {
  atom,
  atomFamily,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import type { TMessage, TPreset, TConversation, TSubmission } from 'librechat-data-provider';
import type { TOptionSettings, ExtendedFile } from '~/common';
import type {
  Getter,
  SetterOrUpdater,
  RecoilState,
  RecoilValue,
  RecoilValueOptions,
} from 'recoil';

// ... (other atoms and types)

const useCreateConversationAtom = (key: string | number): {
  conversation: RecoilValue<TConversation | null>;
  setConversation: SetterOrUpdater<RecoilState<TConversation | null>>;
} => {
  const [keys, setKeys] = useRecoilState(conversationKeysAtom);
  const setConversation = useSetRecoilState(conversationByIndex(key));
  const conversation = useRecoilValue(conversationByIndex(key));

  useEffect(() => {
    if (!keys.includes(key)) {
      setKeys((prevKeys) => [...prevKeys, key]);
    }
  }, [key, keys, setKeys]);

  return { conversation, setConversation };
};

export default {
  conversationByIndex,
  filesByIndex,
  presetByIndex,
  submissionByIndex,
  textByIndex,
  showStopButtonByIndex,
  abortScrollFamily,
  isSubmittingFamily,
  optionSettingsFamily,
  showAgentSettingsFamily,
  showBingToneSettingFamily,
  showPopoverFamily,
  latestMessageFamily,
  allConversationsSelector,
  useCreateConversationAtom,
};

const getAllConversations: Getter<(string | number)[]> = ({ get }) => {
  const keys = get(conversationKeysAtom);
  return keys.map((key) => get(conversationByIndex(key)));
};

const getAllConversationsConversationId: Getter<string[]> = ({ get }) => {
  const conversations = getAllConversations({ get });
  return conversations.map((convo) => convo?.conversationId || '');
};

const allConversationsSelector: RecoilValue<string[]> = selector({
  key: 'allConversationsSelector',
  get: getAllConversationsConversationId,
});
