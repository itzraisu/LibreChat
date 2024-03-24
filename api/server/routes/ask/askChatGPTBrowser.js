const crypto = require('crypto');
const express = require('express');
const { Constants } = require('librechat-data-provider');
const { saveMessage, getConvoTitle, saveConvo, getConvo } = require('~/models');
const { handleError, sendMessage, createOnProgress, handleText } = require('~/server/utils');
const { setHeaders } = require('~/server/middleware');
const { browserClient } = require('~/app/');
const { logger } = require('~/config');

const router = express.Router();

router.post('/', setHeaders, async (req, res) => {
  try {
    const {
      endpoint,
      text,
      overrideParentMessageId,
      parentMessageId,
      conversationId,
    } = req.body || {};

    if (!endpoint || endpoint !== 'chatGPTBrowser') {
      return handleError(res, { text: 'Illegal request' });
    }

    if (!text || text.length === 0) {
      return handleError(res, { text: 'Prompt empty or too short' });
    }

    const isNewConversation = !conversationId;
    const userMessageId = crypto.randomUUID?.() || crypto.randomBytes(16).toString('hex');
    const userParentMessageId = parentMessageId || Constants.NO_PARENT;
    const conversationIdValue = conversationId || crypto.randomUUID?.() || crypto.randomBytes(16).toString('hex');

    const userMessage = {
      messageId: userMessageId,
      sender: 'User',
      text,
      parentMessageId: userParentMessageId,
      conversationId: conversationIdValue,
      isCreatedByUser: true,
    };

    const endpointOption = {
      model: req.body?.model ?? 'text-davinci-002-render-sha',
      key: req.body?.key ?? null,
    };

    logger.debug('[/ask/chatGPTBrowser]', JSON.stringify({ userMessage, conversationId: conversationIdValue, ...endpointOption }));

    await saveMessage({ ...userMessage, user: req.user.id });
    await saveConvo(req.user.id, {
      ...userMessage,
      ...endpointOption,
      conversationId: conversationIdValue,
      endpoint,
    });

    return await ask({
      isNewConversation,
      userMessage,
      endpointOption,
      conversationId: conversationIdValue,
      overrideParentMessageId,
      req,
      res,
    });
  } catch (error) {
    handleError(res, error);
  }
});

const ask = async ({
  isNewConversation,
  userMessage,
  endpointOption,
  conversationId,
  overrideParentMessageId = null,
  req,
  res,
}) => {
  let { text, parentMessageId: userParentMessageId, messageId: userMessageId } = userMessage;
  const user = req.user.id;
  let responseMessageId = crypto.randomUUID?.() || crypto.randomBytes(16).toString('hex');
  let getPartialMessage = null;

  try {
    let lastSavedTimestamp = 0;
    const { onProgress: progressCallback, getPartialText } = createOnProgress({
      onProgress: ({ text }) => {
        const currentTimestamp = Date.now();
        if (currentTimestamp - lastSavedTimestamp > 500) {
          lastSavedTimestamp = currentTimestamp;
          saveMessage({
            messageId: responseMessageId,
            sender: endpointOption?.jailbreak ? 'Sydney' : 'BingAI',
            conversationId,
            parentMessageId: overrideParentMessageId || userMessageId,
            text: text,
            unfinished: true,
            error: false,
            isCreatedByUser: false,
            user,
          });
        }
      },
    });

    getPartialMessage = getPartialText;
    const abortController = new AbortController();

    const response = await browserClient({
      text,
      parentMessageId: userParentMessageId,
      conversationId,
      ...endpointOption,
      abortController,
      userId: user,
      onProgress: progressCallback.call(null, { res, text }),
      onEventMessage: (eventMessage) => {
        let data = null;
        try {
          data = JSON.parse(eventMessage.data);
        } catch (e) {
          return;
        }

        sendMessage(res, {
          message: { ...userMessage, conversationId: data.conversation_id },
          created: i === 0,
        });

        if (i === 0) {
          i++;
        }
      },
    });

    logger.debug('[/ask/chatGPTBrowser]', JSON.stringify(response));

    const newConversationId = response.conversationId || conversationId;
    const newUserMassageId = response.parentMessageId || userMessageId;
    const newResponseMessageId = response.messageId;

    // STEP1 generate response message
    response.text = response.response || '**ChatGPT refused to answer.**';

    let responseMessage = {
      conversationId: newConversationId,
      messageId: responseMessageId,
      newMessageId: newResponseMessageId,
      parentMessageId: overrideParentMessageId || newUserMassageId,
      text: await handleText(response),
      sender: endpointOption
