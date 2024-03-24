const { Constants } = require('librechat-data-provider');
const { HumanMessage, AIMessage, SystemMessage } = require('langchain/schema');
const { formatMessage, formatLangChainMessages, formatFromLangChain } = require('./formatMessages');

describe('formatMessage', () => {
  // Test cases remain the same

  // Adding a test case for invalid input
  it('returns null for invalid input', () => {
    const input = {};
    const result = formatMessage(input);
    expect(result).toBeNull();
  });
});

describe('formatLangChainMessages', () => {
  // Test cases remain the same

  // Adding a test case for invalid input
  it('returns an empty array for invalid input', () => {
    const messages = {};
    const formatOptions = {};
    const result = formatLangChainMessages(messages, formatOptions);
    expect(result).toHaveLength(0);
  });
});

describe('formatFromLangChain', () => {
  // Test cases remain the same

  // Adding test cases for different input scenarios
  it('should handle messages with no kwargs', () => {
    const message = {};
    const expected = {};
    expect(formatFromLangChain(message)).toEqual(expected);
  });

  it('should handle messages with no content in kwargs', () => {
    const message = {
      kwargs: {
        name: 'dan',
      },
    };

    const expected = {
      name: 'dan',
    };

    expect(formatFromLangChain(message)).toEqual(expected);
  });
});
