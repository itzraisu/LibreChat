const Keyv = require('keyv');
const { KeyvFile } = require('keyv-file');
const { logger } = require('~/config');

const createConversation = async (conversationId, userMessage, responseMessage, endpointOption) => {
  const conversationsCache = new Keyv({
    store: new KeyvFile({ filename: './data/cache.json' }),
    namespace: 'chatgpt', // should be 'bing' for bing/sydney
  });

  const getRole = (endpoint, options) => {
    if (endpoint === 'openAI') {
      return options?.chatGptLabel || 'ChatGPT';
    } else if (endpoint === 'bingAI') {
      return options?.jailbreak ? 'Sydney' : 'BingAI';
    }
  };

  const conversation = await conversationsCache.get(conversationId);

  if (!conversation) {
    return conversationsCache.set(conversationId, {
      messages: [
        createMessage('User', userMessage),
        createMessage(getRole(endpointOption.endpoint, endpointOption), responseMessage),
      ],
      createdAt: Date.now(),
    });
  }

  conversation.messages.push(
    createMessage('User', userMessage),
    createMessage(getRole(endpointOption.endpoint, endpointOption), responseMessage)
  );

  await conversationsCache.set(conversationId, conversation);
};

const createMessage = (role, message) => ({
  id: message.messageId,
  parentMessageId: message.parentMessageId,
  role,
  message: message.text,
});

const addToCache = async ({ endpoint, endpointOption, userMessage, responseMessage }) => {
  try {
    await createConversation(
      userMessage.conversationId,
      userMessage,
      responseMessage,
      endpointOption
    );
  } catch (error) {
    logger.error('[addToCache] Error adding conversation to cache', error);
  }
};

module.exports = addToCache;
