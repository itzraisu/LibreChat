const { PromptTemplate } = require('langchain/prompts');

/**
 * Summary prompt template.
 * @type {PromptTemplate}
 */
const SUMMARY_PROMPT = new PromptTemplate({
  inputVariables: ['summary', 'new_lines'],
  template: `Summarize the conversation by integrating new lines into the current summary.

Example:
Current summary:
The human inquires about the AI's view on artificial intelligence. The AI believes it's beneficial.

New lines:
Human: Why is it beneficial?
AI: It helps humans achieve their potential.

New summary:
The human inquires about the AI's view on artificial intelligence. The AI believes it's beneficial because it helps humans achieve their potential.

Current summary:
{summary}

New lines:
{new_lines}

New summary:`,
});

/**
 * Cut-off summary prompt template.
 * @type {PromptTemplate}
 */
const CUT_OFF_PROMPT = new PromptTemplate({
  inputVariables: ['new_lines'],
  template: `The following text is cut-off:

{new_lines}

Summarize the content as best as you can, noting that it was cut-off.

Summary: `,
});

module.exports = {
  SUMMARY_PROMPT,
  CUT_OFF_PROMPT,
};
