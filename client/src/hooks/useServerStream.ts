import { useEffect } from 'react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import {
  /* @ts-ignore */
  SSE,
  createPayload,
  tMessageSchema,
  tConversationSchema,
} from 'librechat-data-provider';
import { useGetUserBalance, useGetStartupConfig } from 'librechat-data-provider/react-query';
import useConversations from './useConversations';
import { useAuthContext } from './AuthContext';

import store from '~/store';

type TResData = {
  plugin: TResPlugin;
  final?: boolean;
  initial?: boolean;
  requestMessage: TMessage;
  responseMessage: TMessage;
  conversation: TConversation;
};

export default function useServerStream(submission: TSubmission | null) {
  const setMessages = useSetRecoilState(store.messages);
  const setIsSubmitting = useSetRecoilState(store.isSubmitting);
  const setConversation = useSetRecoilState(store.conversation);
  const resetLatestMessage = useResetRecoilState(store.latestMessage);
  const { token, isAuthenticated } = useAuthContext();

  const { data: startupConfig } = useGetStartupConfig();
  const { refreshConversations } = useConversations();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.checkBalance,
  });

  const messageHandler = (data: string, submission: TSubmission) => {
    const {
      messages,
      message,
      plugin,
      plugins,
      initialResponse,
      isRegenerate = false,
    } = submission;

    if (isRegenerate) {
      setMessages([
        ...messages,
        {
          ...initialResponse,
          text: data,
          parentMessageId: message?.overrideParentMessageId ?? null,
          messageId: message?.overrideParentMessageId + '_',
          plugin: plugin ?? null,
          plugins: plugins ?? [],
          submitting: true,
          // unfinished: true
        },
      ]);
    } else {
      setMessages([
        ...messages,
        message,
        {
          ...initialResponse,
          text: data,
          parentMessageId: message?.messageId,
          messageId: message?.messageId + '_',
          plugin: plugin ?? null,
          plugins: plugins ?? [],
          submitting: true,
          // unfinished: true
        },
      ]);
    }
  };

  const cancelHandler = (data: TResData, submission: TSubmission) => {
    const { requestMessage, responseMessage, conversation } = data;
    const { messages, isRegenerate = false } = submission;

    // update the messages
    if (isRegenerate) {
      setMessages([...messages, responseMessage]);
    } else {
      setMessages([...messages, requestMessage, responseMessage]);
    }
    setIsSubmitting(false);

    // refresh title
    if (requestMessage.parentMessageId == '00000000-0000-0000-0000-000000000000') {
      setTimeout(() => {
        refreshConversations();
      }, 2000);

      // in case it takes too long.
      setTimeout(() => {
        refreshConversations();
      }, 5000);
    }

    setConversation((prevState) => ({
      ...prevState,
      ...conversation,
    }));
  };

  const createdHandler = (data: TResData, submission: TSubmission) => {
    const { messages, message, initialResponse, isRegenerate = false } = submission;

    if (isRegenerate) {
      setMessages([
        ...messages,
        {
          ...initialResponse,
          parentMessageId: message?.overrideParentMessageId ?? null,
          messageId: message?.overrideParentMessageId + '_',
          submitting: true,
        },
      ]);
    } else {
      setMessages([
        ...messages,
        message,
        {
          ...initialResponse,
          parentMessageId: message?.messageId,
          messageId: message?.messageId + '_',
          submitting: true,
        },
      ]);
    }

    const { conversationId } = message;
    setConversation((prevState) =>
      tConversationSchema.parse({
        ...prevState,
        conversationId,
      }),
    );
    resetLatestMessage();
  };

  const finalHandler = (data: TResData, submission: TSubmission) => {
    const { requestMessage, responseMessage, conversation } = data;
    const { messages, isRegenerate = false } = submission;

    // update the messages
    if (isRegenerate) {
      setMessages([...messages, responseMessage]);
    } else {
      setMessages([...messages, requestMessage, responseMessage]);
    }
    setIsSubmitting(false);

    // refresh title
    if (requestMessage.parentMessageId == '00000000-0000-0000-0000-000000000000') {
      setTimeout(() => {
        refreshConversations();
      }, 2000);

      // in case it takes too long.
      setTimeout(() => {
        refreshConversations();
      }, 5000);
    }

    setConversation((prevState) => ({
      ...prevState,
      ...conversation,
    }));
  };

  const error
