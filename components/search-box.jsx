'use client';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import { searchSchema } from '@/src/utils/validation-schemas';
import Loader from './loader';
import searchStyles from '@/src/components/SearchBox/searchbox.module.css';
import buttonStyles from '@/src/components/Button/button.module.css';

export default function SearchBox({ search, loading, onSearch }) {
  return (
    <div className={searchStyles.searchBoxContainer}>
      <Formik
        enableReinitialize
        initialValues={{ search }}
        validationSchema={searchSchema}
        onSubmit={({ search: value }, { setSubmitting }) => {
          onSearch(value.trim());
          setSubmitting(false);
        }}
      >
        {({ errors, isSubmitting, touched }) => (
          <Form className={searchStyles.form}>
            <Field
              className={`${searchStyles.input} ${
                touched.search && errors.search ? searchStyles.inputError : ''
              }`}
              name="search"
              placeholder="Search recipes"
              aria-label="Search recipes by title"
            />
            <button
              type="submit"
              className={`${buttonStyles.baseStyle} ${searchStyles.searchBtn}`}
              disabled={loading || isSubmitting}
            >
              {loading ? <Loader compact /> : 'Search'}
            </button>
            <ErrorMessage
              name="search"
              component="span"
              className={searchStyles.error}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}
