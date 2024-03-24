const messageFunctions = {
  useAvatar: () => import('./useAvatar').then(module => module.default),
  useProgress: () => import('./useProgress').then(module => module.default),
  useMessageHelpers: () => import('./useMessageHelpers').then(module => module.default),
  useMessageScrolling: () => import('./useMessageScrolling').then(module => module.default),
};

export default messageFunctions;


import messageFunctions from './messageFunctions';

const { useAvatar, useProgress, useMessageHelpers, useMessageScrolling } = messageFunctions;


import { useAvatar, useProgress } from './messageFunctions';
