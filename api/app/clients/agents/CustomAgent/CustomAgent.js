const { ZeroShotAgent } = require('langchain/agents');
const { PromptTemplate, renderTemplate } = require('langchain/prompts');
const { gpt3, gpt4 } = require('./instructions');

class CustomAgent extends ZeroShotAgent {
  constructor(input, opts = {}) {
    super(input);
    this.opts = opts;
  }

  _stop() {
    return ['\nObservation:', '\nObservation 1:'];
  }

  static async createPrompt(tools, opts = {}) {
    const { currentDateString, model = 'gpt-3' } = opts;
    const inputVariables = ['input', 'chat_history', 'agent_scratchpad'];

    let prefix, instructions, suffix;
    try {
      if (model === 'gpt-3') {
        ({ prefix, instructions, suffix } = gpt3);
      } else if (model === 'gpt-4') {
        ({ prefix, instructions, suffix } = gpt4);
      } else {
        throw new Error(`Unsupported model: ${model}`);
      }
    } catch (error) {
      console.error(error);
      return;
    }

    const toolStrings = tools
      .filter((tool) => tool.name !== 'self-reflection')
      .map((tool) => `${tool.name}: ${tool.description}`)
      .join('\n');

    const toolNames = tools.map((tool) => tool.name);
    const formatInstructions = renderTemplate(instructions, 'f-string', {
      tool_names: toolNames,
    });

    const template = [
      `Date: ${currentDateString}\n${prefix}`,
      toolStrings,
      formatInstructions,
      suffix,
    ].join('\n\n');

    return new PromptTemplate({
      template,
      inputVariables,
    });
  }
}

module.exports = CustomAgent;
