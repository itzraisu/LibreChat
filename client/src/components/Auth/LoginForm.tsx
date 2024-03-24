import React from 'react';
import { useFormik } from 'formik';
import { useLocalize } from '~/hooks';
import { TLoginUser } from 'librechat-data-provider';
import * as Yup from 'yup';

type TLoginFormProps = {
  onSubmit: (data: TLoginUser) => void;
};

const LoginForm: React.FC<TLoginFormProps> = ({ onSubmit }) => {
  const localize = useLocalize();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(localize('com_auth_email_pattern'))
      .required(localize('com_auth_email_required'))
      .max(120, localize('com_auth_email_max_length')),
    password: Yup.string()
      .min(8, localize('com_auth_password_min_length'))
      .max(128, localize('com_auth_password_max_length'))
      .required(localize('com_auth_password_required')),
  });

  const formik = useFormik<TLoginUser>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (data) => {
      onSubmit(data);
    },
  });

  return (
    <form
      className="mt-6 space-y-6"
      aria-label="Login form"
      method="POST"
      onSubmit={formik.handleSubmit}
    >
      <div className="relative">
        <input
          type="text"
          id="email"
          autoComplete="email"
          aria-label={localize('com_auth_email')}
          {...formik.getFieldProps('email')}
          className={`webkit-dark-styles peer block w-full appearance-none rounded-md border border-black/10 bg-white px-2.5 pb-2.5 pt-5 text-sm text-gray-800 focus:border-green-500 focus:outline-none dark:border-white/20 dark:bg-gray-900 dark:text-white dark:focus:border-green-500 ${
            formik.errors.email && formik.touched.email
              ? 'border-red-500 focus:border-red-500'
              : ''
          }`}
          placeholder=" "
        />
        <label
          htmlFor="email"
          className="pointer-events-none absolute left-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-green-500 dark:text-gray-200"
        >
          {localize('com_auth_email_address')}
        </label>
        {formik.errors.email && formik.touched.email && (
          <span role="alert" className="mt-1 text-sm text-red-500">
            {formik.errors.email}
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          aria-label={localize('com_auth_password')}
          {...formik.getFieldProps('password')}
          className={`webkit-dark-styles peer block w-full appearance-none rounded-md border border-black/10 bg-white px-2.5 pb-2.5 pt-5 text-sm text-gray-800 focus:border-green-500 focus:outline-none dark:border-white/20 dark:bg-gray-900 dark:text-white dark:focus:border-green-500 ${
            formik.errors.password && formik.touched.password
              ? 'border-red-500 focus:border-red-500'
              : ''
          }`}
          placeholder=" "
        />
        <label
          htmlFor="password"
          className="pointer-events-none absolute left-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-green-500 dark:text-gray-200"
        >
          {localize('com_auth_password')}
        </label>
        {formik.errors.password && formik.touched.password && (
          <span role="alert" className="mt-1 text-sm text-red-500">
            {formik.errors.password}
          </span>
        )}
      </div>
      <a
        href="/forgot-password"
        className="text-sm font-medium text-green-500 underline underline-offset-2"
      >
        {localize('com_auth_password_forgot')}
      </a>
      <div className="mt-6">
        <button
          aria-label="Sign in"
          data-testid="login-button"
          type="submit"
          className="w-full transform rounded-md bg-green-500 px-4 py-3 tracking-wide text-white transition-colors duration-200 hover:bg-green-550 focus:bg-green-550 focus:outline-none disabled:cursor-not-allowed
