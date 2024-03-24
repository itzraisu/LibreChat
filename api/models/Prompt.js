const mongoose = require('mongoose');
const { logger } = require('~/config');

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
  },
  { timestamps: true },
);

const Prompt = mongoose.models.Prompt || mongoose.model('Prompt', promptSchema);

module.exports = {
  savePrompt: ({ title, prompt }) => {
    const promptDoc = new Prompt({ title, prompt });
    return promptDoc.save()
      .then(() => ({ title, prompt }))
      .catch((error) => {
        logger.error('Error saving prompt', error);
        return { prompt: `Error saving prompt: ${error.message}` };
      });
  },
  getPrompts: (filter) => {
    if (!filter || typeof filter !== 'object') {
      return Promise.reject(new Error('Invalid filter parameter'));
    }
    return Prompt.find(filter).lean()
      .then((prompts) => prompts)
      .catch((error) => {
        logger.error('Error getting prompts', error);
        return { prompt: `Error getting prompts: ${error.message}` };
      });
  },
  deletePrompts: (filter) => {
    if (!filter || typeof filter !== 'object') {
      return Promise.reject(new Error('Invalid filter parameter'));
    }
    return Prompt.deleteMany(filter)
      .then((result) => result)
      .catch((error
