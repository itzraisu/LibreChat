const { z } = require('zod');

const allowedCharactersRegex = new RegExp(
  '^[' +
    'a-zA-Z0-9_.@#$%&*()' + // Basic Latin characters and symbols
    '\\p{Script=Latin}' + // Latin script characters
    '\\p{Script=Common}' + // Characters common across scripts
    '\\p{Script=Cyrillic}' + // Cyrillic script for Russian, etc.
    '\\p{Script=Devanagari}' + // Devanagari script for Hindi, etc.
    '\\p{Script=Han}' + // Han script for Chinese characters, etc.
    '\\p{Script=Arabic}' + // Arabic script
    '\\p{Script=Hiragana}' + // Hiragana script for Japanese
    '\\p{Script=Katakana}' + // Katakana script for Japanese
    '\\p{Script=Hangul}' + // Hangul script for Korean
    ']+$', // End of string
  'u', // Use Unicode mode
);

const injectionPatternsRegex = /('|--|\$ne|\$gt|\$lt|\$or|\{|\}|\*|;|<|>|\/|=)/;

const usernameSchema = z
  .string()
  .min(2)
  .max(80)
  .regex(allowedCharactersRegex, 'Invalid characters in username')
  .refine((value) => !injectionPatternsRegex.test(value), {
    message: 'Potential injection attack detected',
  });

const passwordSchema = z
  .string()
  .min(8)
  .max(128)
  .regex(/^\S*$/, 'Password cannot contain only spaces')
  .superRefine((value, ctx) => {
    if (value !== ctx.input.confirm_password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
      });
    }
  });

const emailSchema = z.string().email('Invalid email format');

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const registerSchema = z.object({
  name: z.string().min(3).max(80),
  username: z.union([z.literal(''), usernameSchema]).optional().nullable(),
  email: emailSchema,
  password: passwordSchema,
  confirm_password: passwordSchema,
});

module.exports = {
  loginSchema,
  registerSchema,
};
