export { default as Login } from './Login';
export { default as Registration } from './Registration';
export { default as ResetPassword } from './ResetPassword';
export { default as ApiErrorWatcher } from './ApiErrorWatcher';
export { default as RequestPasswordReset } from './RequestPasswordReset';

// A better version using a single export statement
export {
  default as Login,
  default as Registration,
  default as ResetPassword,
  default as ApiErrorWatcher,
  default as RequestPasswordReset,
} from {
  Login: import('./Login'),
  Registration: import('./Registration'),
  ResetPassword: import('./ResetPassword'),
  ApiErrorWatcher: import('./ApiErrorWatcher'),
  RequestPasswordReset: import('./RequestPasswordReset'),
};
