import { OpenAI } from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';
import {
  ImageDetail,
  EModelEndpoint,
  resolveHeaders,
  ImageDetailCost,
  getResponseSender,
  validateVisionModel,
  mapModelToAzureConfig,
} from 'librechat-data-provider';
import { encoding_for_model } from 'tiktoken';
import { extractBaseURL, constructAzureURL, getModelMaxTokens } from '~/utils';
import { truncateText, formatMessage, createContextHandlers, CUT_OFF_PROMPT } from './prompts';
import { encodeAndFormat } from '~/server/services/Files/images/encode';
import { handleOpenAIErrors } from './tools/util';
import { spendTokens } from '~/models/spendTokens';
import { createLLM, RunManager } from './llm';
import { ChatGPTClient } from './ChatGPTClient';
import { isEnabled } from '~/server/utils';
import { summaryBuffer } from './memory';
import { tokenSplit } from './document';
import { BaseClient } from './BaseClient';
import { AbortController } from 'abort-controller';

const tokenizersCache = {};
let tokenizerCallsCount = 0;

class OpenAIClient extends BaseClient {
  constructor(apiKey: string, options: any) {
    super(apiKey, options);
    this.ChatGPTClient = new ChatGPTClient();
    this.buildPrompt = this.ChatGPTClient.buildPrompt.bind(this);
    this.getCompletion = this.ChatGPTClient.getCompletion.bind(this);
    this.contextStrategy = options.contextStrategy
      ? options.contextStrategy.toLowerCase()
      : 'discard';
    this.shouldSummarize = this.contextStrategy === 'summarize';
    this.azure = options.azure || false;
    this.setupOptions(options);
    this.metadata = {};
  }

  setupOptions(options: any) {
    // ... (same as before)
  }

  // ... (rest of the methods with the mentioned improvements)
}

module.exports = OpenAIClient;
