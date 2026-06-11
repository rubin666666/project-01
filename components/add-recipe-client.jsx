'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { api, getErrorMessage } from '@/lib/api';
import { getCategories, getIngredients } from '@/lib/queries';
import { addRecipeSchema } from '@/src/utils/validation-schemas';
import PrivateGuard from './private-guard';
import styles from '@/src/components/AddRecipeForm/addrecipeform.module.css';
import ingredientStyles from '@/src/components/RecipeAddIngredient/recipeaddingredient.module.css';

export default function AddRecipeClient() {
  return (
    <PrivateGuard>
      <RecipeForm />
    </PrivateGuard>
  );
}

function RecipeForm() {
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [ingredientId, setIngredientId] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  const ingredientsQuery = useQuery({
    queryKey: ['ingredients'],
    queryFn: getIngredients,
  });
  const createMutation = useMutation({
    mutationFn: formData =>
      api.post('/api/recipes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
  });

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const initialValues = {
    title: '',
    description: '',
    time: '',
    calories: '',
    category: '',
    instructions: '',
    photo: null,
    measure: '',
  };

  const submit = async (values, helpers) => {
    if (ingredientsList.length === 0) {
      toast.error('Add at least one ingredient');
      helpers.setSubmitting(false);
      return;
    }
    const formData = new FormData();
    ['title', 'description', 'time', 'category', 'instructions'].forEach(key =>
      formData.append(key, values[key])
    );
    if (values.calories) formData.append('calories', values.calories);
    if (values.photo) formData.append('photo', values.photo);
    formData.append(
      'ingredients',
      JSON.stringify(
        ingredientsList.map(item => ({
          id: item.id,
          measure: item.measure,
        }))
      )
    );

    try {
      const response = await createMutation.mutateAsync(formData);
      const recipe = response.data.data;
      toast.success('Recipe created successfully');
      router.push(`/recipes/${recipe._id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
      helpers.setSubmitting(false);
    }
  };

  const ingredients = ingredientsQuery.data || [];
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={addRecipeSchema}
      onSubmit={submit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className={styles.formContainer}>
          <div className={styles.boxUploadPhoto}>
            <div className={styles.boxUploadInput}>
              <label className={clsx(styles.title, styles.titleInputImage)}>
                Upload Photo
                <input
                  className={styles.inputImage}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={event => {
                    const file = event.currentTarget.files?.[0] || null;
                    setFieldValue('photo', file);
                    if (preview) URL.revokeObjectURL(preview);
                    setPreview(file ? URL.createObjectURL(file) : null);
                  }}
                />
              </label>
              <div
                className={styles.previewImage}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <Image
                  src={preview || '/pg10.png'}
                  alt="Recipe preview"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <ErrorMessage name="photo" component="div" className={styles.error} />
            </div>

            <div className={styles.generalInformation}>
              <h2 className={clsx(styles.title, styles.titleGeneral)}>
                General Information
              </h2>
              <FormField styles={styles} name="title" label="Recipe Title" />
              <FormField
                styles={styles}
                name="description"
                label="Recipe Description"
                as="textarea"
              />
              <FormField
                styles={styles}
                name="time"
                label="Cooking time in minutes"
                type="number"
              />
              <div className={styles.containerFood}>
                <FormField
                  styles={styles}
                  name="calories"
                  label="Calories"
                  type="number"
                />
                <label className={styles.titleText}>
                  Category
                  <Field className={styles.category} as="select" name="category">
                    <option value="">Category</option>
                    {(categoriesQuery.data || []).map(category => (
                      <option
                        key={category._id || category.name || category}
                        value={category.name || category}
                      >
                        {category.name || category}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className={styles.error}
                  />
                </label>
              </div>
            </div>
          </div>

          <h2 className={clsx(styles.title, styles.titleIngredients)}>
            Ingredients
          </h2>
          <div className={styles.nameAmount}>
            <label className={styles.titleText}>
              Name
              <select
                className={styles.ingredientName}
                value={ingredientId}
                onChange={event => setIngredientId(event.target.value)}
                disabled={ingredientsQuery.isLoading}
              >
                <option value="">Select an ingredient</option>
                {ingredients.map(item => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <div className={styles.amountWrapper}>
              <FormField styles={styles} name="measure" label="Amount" />
              <button
                className={styles.buttonAdd}
                type="button"
                onClick={() => {
                  const selected = ingredients.find(
                    item => item._id === ingredientId
                  );
                  const selectedId = selected?._id;
                  if (!selectedId || !values.measure.trim()) {
                    toast.error('Select an ingredient and enter an amount');
                    return;
                  }
                  if (ingredientsList.some(item => item.id === selectedId)) {
                    toast.error('This ingredient is already added');
                    return;
                  }
                  setIngredientsList(list => [
                    ...list,
                    {
                      id: selectedId,
                      name: selected.name,
                      measure: values.measure.trim(),
                    },
                  ]);
                  setIngredientId('');
                  setFieldValue('measure', '');
                }}
              >
                Add new Ingredient
              </button>
            </div>
          </div>

          {ingredientsList.length > 0 && (
            <div className={ingredientStyles.container}>
              <div className={ingredientStyles.boxName}>
                <h3 className={ingredientStyles.name}>Name:</h3>
                <h3 className={ingredientStyles.amount}>Amount:</h3>
              </div>
              {ingredientsList.map((item, index) => (
                <div className={ingredientStyles.boxIngredient} key={item.id}>
                  <span className={ingredientStyles.ingredientName}>
                    {item.name}
                  </span>
                  <span className={ingredientStyles.ingredientcount}>
                    {item.measure}
                  </span>
                  <button
                    type="button"
                    className={ingredientStyles.button}
                    onClick={() =>
                      setIngredientsList(list =>
                        list.filter((_, itemIndex) => itemIndex !== index)
                      )
                    }
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <h2 className={clsx(styles.title, styles.titleInstructions)}>
            Instructions
          </h2>
          <FormField
            styles={styles}
            name="instructions"
            label=""
            as="textarea"
          />
          <div className={styles.buttonSubmitbox}>
            <button
              className={styles.buttonSubmit}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Recipe'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

function FormField({ styles, name, label, type = 'text', as }) {
  return (
    <label className={styles.titleText}>
      {label}
      <Field
        className={clsx(styles.input, styles[name])}
        name={name}
        type={type}
        as={as}
      />
      <ErrorMessage name={name} component="div" className={styles.error} />
    </label>
  );
}
