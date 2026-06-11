'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api, getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { loginSchema, registerSchema } from '@/src/utils/validation-schemas';
import Loader from './loader';
import EyeIcon from '@/src/assets/castom-icons/eye.svg';
import EyeClosedIcon from '@/src/assets/castom-icons/eye-clossed.svg';
import loginStyles from '@/src/components/Auth/LoginForm/loginform.module.css';
import registerStyles from '@/src/components/Auth/RegisterForm/registerform.module.css';

export default function AuthForm({ mode }) {
  const isRegister = mode === 'register';
  const styles = isRegister ? registerStyles : loginStyles;
  const router = useRouter();
  const setSession = useAuthStore(state => state.setSession);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isLoggedIn) router.replace('/');
  }, [isLoggedIn, router]);

  if (isLoggedIn) return null;

  const submit = async (values, helpers) => {
    try {
      let response;
      if (isRegister) {
        response = await api.post('/api/auth/register', {
          name: values.name,
          email: values.email,
          password: values.password,
        });
      } else {
        response = await api.post('/api/auth/login', {
          email: values.email,
          password: values.password,
        });
      }
      const data = response.data.data;
      setSession({ user: data.user, token: data.accessToken });
      toast.success(isRegister ? 'Registration successful' : 'Login successful');
      router.replace('/');
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{isRegister ? 'Register' : 'Login'}</h1>
      {isRegister && (
        <p className={styles.subtitle}>
          Join our community, save favorite recipes, and share your creations.
        </p>
      )}
      <Formik
        initialValues={
          isRegister
            ? {
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                terms: false,
              }
            : { email: '', password: '' }
        }
        validationSchema={isRegister ? registerSchema : loginSchema}
        onSubmit={submit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className={styles.form}>
            {isRegister && (
              <FieldBlock
                styles={styles}
                name="name"
                label="Enter your name"
                placeholder="Max"
                error={touched.name && errors.name}
              />
            )}
            <FieldBlock
              styles={styles}
              name="email"
              type="email"
              label="Enter your email address"
              placeholder="email@gmail.com"
              error={touched.email && errors.email}
            />
            <div className={styles.inputGroup}>
              <label htmlFor={`${mode}-password`} className={styles.label}>
                {isRegister ? 'Create a strong password' : 'Enter your password'}
              </label>
              <div className={styles.inputWrapper}>
                <Field
                  id={`${mode}-password`}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${
                    touched.password && errors.password ? styles.inputError : ''
                  }`}
                  placeholder="*********"
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(value => !value)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className={styles.error}
              />
            </div>
            {isRegister && (
              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Repeat your password
                </label>
                <div className={styles.inputWrapper}>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    className={`${styles.input} ${
                      touched.confirmPassword && errors.confirmPassword
                        ? styles.inputError
                        : ''
                    }`}
                    placeholder="*********"
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowConfirm(value => !value)}
                    aria-label="Toggle password confirmation visibility"
                  >
                    {showConfirm ? <EyeClosedIcon /> : <EyeIcon />}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className={styles.error}
                />
              </div>
            )}
            {isRegister && (
              <>
                <label className={styles.checkboxLabel}>
                  <Field type="checkbox" name="terms" />I agree to the Terms of
                  Service and Privacy Policy
                </label>
                <ErrorMessage
                  name="terms"
                  component="div"
                  className={styles.error}
                />
              </>
            )}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader compact />
                  <span>Please wait...</span>
                </>
              ) : isRegister ? (
                'Register'
              ) : (
                'Log in'
              )}
            </button>
          </Form>
        )}
      </Formik>
      <p className={styles.bottomText}>
        {isRegister ? 'Already have an account? ' : "Don't have an account? "}
        <Link
          href={isRegister ? '/auth/login' : '/auth/register'}
          className={isRegister ? styles.loginLink : styles.registerLink}
        >
          {isRegister ? 'Log in' : 'Register'}
        </Link>
      </p>
    </div>
  );
}

function FieldBlock({ styles, name, label, type = 'text', placeholder, error }) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        placeholder={placeholder}
      />
      <ErrorMessage name={name} component="div" className={styles.error} />
    </div>
  );
}
