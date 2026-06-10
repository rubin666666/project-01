'use client';

import Image from 'next/image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, getErrorMessage } from '@/lib/api';
import { getAllFavoriteRecipes, getRecipe } from '@/lib/queries';
import { useAuthStore } from '@/store/auth';
import AuthModal from './AuthModal';
import Loader from './Loader';
import RecipeNotFound from './RecipeNotFound';
import styles from '@/src/components/RecipeDetails/RecipeDetails.module.css';
import saveStyles from '@/src/components/SaveRecipeButton/SaveRecipeButton.module.css';
import SaveIcon from '@/src/assets/icons/SaveIcon.svg';

export default function RecipeDetailsClient({ id }) {
  const queryClient = useQueryClient();
  const [authOpen, setAuthOpen] = useState(false);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const recipeQuery = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipe(id),
  });
  const favoritesQuery = useQuery({
    queryKey: ['favorite-recipes'],
    queryFn: getAllFavoriteRecipes,
    enabled: isLoggedIn,
  });
  const isFavorite = (favoritesQuery.data || []).some(
    item => item._id === id
  );
  const favoriteMutation = useMutation({
    mutationFn: () =>
      isFavorite
        ? api.delete(`/api/recipes/${id}/favorite`)
        : api.post(`/api/recipes/${id}/favorite`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-recipes'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-recipes'] });
      toast.success(isFavorite ? 'Recipe removed' : 'Recipe saved');
    },
    onError: error => toast.error(getErrorMessage(error)),
  });

  if (recipeQuery.isLoading) return <Loader fullPage />;
  if (recipeQuery.isError) return <RecipeNotFound />;

  const recipe = recipeQuery.data;
  return (
    <div className={styles.recipeContainer}>
      <div className={styles.topSection}>
        <h1 className={styles.title}>{recipe.title}</h1>
        <div className={styles.imgContainer} style={{ position: 'relative' }}>
          <Image
            src={recipe.thumb || recipe.photo || '/pg10.png'}
            alt={recipe.title}
            fill
            priority
            sizes="(min-width: 768px) 60vw, 100vw"
            className={styles.image}
          />
        </div>
      </div>
      <div className={styles.layoutWrapper}>
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>About recipe</h2>
            <p>{recipe.description}</p>
          </section>
          <section className={styles.section}>
            <h2>Ingredients:</h2>
            <ul>
              {recipe.ingredients?.map(({ id: ingredient, measure }, index) => (
                <li key={ingredient?._id || ingredient || index}>
                  {ingredient?.name || ingredient} - {measure}
                </li>
              ))}
            </ul>
          </section>
          <section className={styles.section}>
            <h2 className={styles.stepsTitle}>Preparation Steps:</h2>
            <p className={styles.stepText}>{recipe.instructions}</p>
          </section>
        </div>
        <aside className={styles.sidebar}>
          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>
              <h2>General information</h2>
            </div>
            <p><b>Category:</b> {recipe.category?.name || recipe.category}</p>
            <p><b>Cooking time:</b> {recipe.time} minutes</p>
            <p><b>Calorie content:</b> {recipe.calories || '—'}</p>
          </div>
          <button
            type="button"
            className={`${saveStyles.button} ${
              isFavorite ? saveStyles.saved : ''
            }`}
            disabled={favoriteMutation.isPending}
            aria-busy={favoriteMutation.isPending}
            onClick={() =>
              isLoggedIn ? favoriteMutation.mutate() : setAuthOpen(true)
            }
          >
            {favoriteMutation.isPending ? (
              <>
                <span className={saveStyles.spinner} aria-hidden="true" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <span>{isFavorite ? 'Unsave' : 'Save'}</span>
                <SaveIcon className={saveStyles.icon} />
              </>
            )}
          </button>
        </aside>
      </div>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
