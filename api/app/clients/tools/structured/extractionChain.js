import { zodToJsonSchema } from 'zod-to-json-schema';
import { PromptTemplate } from 'langchain/prompts';
import { JsonKeyOutputFunctionsParser } from 'langchain/output_parsers';
import { LLMChain } from 'langchain/chains';
import { OpenAIFunctions } from 'langchain/schema';

function getExtractionFunctions(schema: any) {
  if (!schema || typeof schema !== 'object') {
    throw new Error('Invalid schema input');
  }

  return [
    {
      name: 'information_extraction',
      description: 'Extracts the relevant information from the passage.',
      parameters: {
        type: 'object',
        properties: {
          info: {
            type: 'array',
            items: schema,
          },
        },
        required: ['info'],
      },
    },
  ];
}

const _EXTRACTION_TEMPLATE = `Extract and save the relevant entities mentioned in the following passage together with their properties.

Passage:
{input}
`;

function createExtractionChain<T>(schema: any, llm, options: { prompt?: PromptTemplate } = {}) {
  if (!Array.isArray(schema)) {
    throw new Error('Required "functions" property is not an array');
  }

  const functions = getExtractionFunctions(schema[0]);
  const outputParser = new JsonKeyOutputFunctionsParser({ attrName: 'info' });

  return new LLMChain({
    llm,
    prompt: options.prompt || PromptTemplate.fromTemplate(_EXTRACTION_TEMPLATE),
    llmKwargs: { functions },
    outputParser,
    tags: ['openai_functions', 'extraction'],
  });
}

function createExtractionChainFromZod<T>(schema: any, llm) {
  return createExtractionChain<OpenAIFunctions>(zodToJsonSchema(schema), llm);
}

module.exports = {
  createExtractionChain,
  createExtractionChainFromZod,
};
