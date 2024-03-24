const { instructions, imageInstructions, errorInstructions } = require('../prompts');

function getActions(actions = [], functionsAgent = false) {
  if (!actions.length || !actions[0]?.action) return '';

  const actionLogs = actions.map((step, index) => {
    const action = step.action || {};
    const log = functionsAgent
      ? `Action: ${action.tool || ''}\nInput: ${JSON.stringify(action.toolInput) || ''}\nObservation: ${step.observation}`
      : step.log;

    return `${log}\n`;
  });

  return `Internal thoughts & actions taken:\n"${actionLogs.join('')}"`;
}

function buildErrorInput({ message, errorMessage, actions, functionsAgent }) {
  const errorPart = errorMessage.includes('Could not parse LLM output:')
    ? `A formatting error occurred with your response to the human's last message. You didn't follow the formatting instructions. Remember to ${instructions}`
    : `You encountered an error while replying to the human's last message. Attempt to answer again or admit an answer cannot be given.\nError: ${errorMessage}`;

  return `${errorPart}\n${getActions(actions, functionsAgent)}Human's last message: ${message}`;
}

function buildPromptPrefix({ result, message, functionsAgent }) {
  if (!result?.output || result.output.includes('N/A') || result.output === undefined) {
    return null;
  }

  const internalActions = result?.intermediateSteps?.length > 0 ? getActions(result.intermediateSteps, functionsAgent) : 'Internal Actions Taken: None';
  const toolBasedInstructions = internalActions.toLowerCase().includes('image') ? imageInstructions : '';
  const errorMessage = result.errorMessage ? `${errorInstructions} ${result.errorMessage}\n` : '';
  const preliminaryAnswer = result.output?.length > 0 ? `Preliminary Answer: "${result.output.trim()}"` : '';

  const prefix = preliminaryAnswer
    ? 'review and improve the answer you generated using plugins in response to the User Message below. The user hasn\'t seen your answer or thoughts yet.'
    : 'respond to the User Message below based on your preliminary thoughts & actions.';

  return `As a helpful AI Assistant, ${prefix}${errorMessage}\n${internalActions}\n${preliminaryAnswer}\nReply conversationally to the User based on your preliminary answer, internal actions, thoughts, and observations, making improvements wherever possible, but do not modify URLs.\nIf there is an incomplete thought or action, you are expected to complete it in your response now.\nYou must cite sources if you are using any web links. ${toolBasedInstructions}\nOnly respond with your conversational reply to the following User Message:\n"${message}"`;
}

module.exports = {
  buildErrorInput,
  buildPromptPrefix,
};
