'use client';

import Image from 'next/image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import SaveIcon from '@/src/assets/icons/save-icon.svg';
import SavedIcon from '@/src/assets/icons/save-favorite.svg';
import { api, getErrorMessage } from '@/lib/api';
import { getAllFavoriteRecipes, getRecipe } from '@/lib/queries';
import { useAuthStore } from '@/store/auth';
import AuthModal from './auth-modal';
import Loader from './loader';
import RecipeNotFound from './recipe-not-found';
import styles from '@/src/components/RecipeDetails/recipedetails.module.css';
import saveStyles from '@/src/components/SaveRecipeButton/saverecipebutton.module.css';

function getInstructionSteps(instructions) {
  if (!instructions) return [];

  const lines = instructions
    .split(/\r?\n/)
    .map(line => line.replace(/^\s*\d+[.)]\s*/, '').trim())
    .filter(Boolean);

  if (lines.length > 1) return lines;

  return instructions
    .split(/(?<=[.!?])\s+/)
    .map(step => step.trim())
    .filter(Boolean);
}

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
    mutationFn: action =>
      action === 'remove'
        ? api.delete(`/api/recipes/${id}/favorite`)
        : api.post(`/api/recipes/${id}/favorite`),
    onSuccess: (_, action) => {
      queryClient.setQueryData(['favorite-recipes'], current => {
        const favorites = current || [];
        return action === 'remove'
          ? favorites.filter(item => item._id !== id)
          : [...favorites, recipeQuery.data];
      });
      queryClient.invalidateQueries({ queryKey: ['profile-recipes'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-recipes'] });
      toast.success(action === 'remove' ? 'Recipe removed' : 'Recipe saved');
    },
    onError: error => toast.error(getErrorMessage(error)),
  });

  if (recipeQuery.isLoading) return <Loader fullPage />;
  if (recipeQuery.isError) {
    if (recipeQuery.error?.response?.status === 404) return <RecipeNotFound />;
    return (
      <div className="statusPage" role="alert">
        <h1>Unable to load recipe</h1>
        <p>{getErrorMessage(recipeQuery.error)}</p>
        <button type="button" onClick={() => recipeQuery.refetch()}>
          Try again
        </button>
      </div>
    );
  }

  const recipe = recipeQuery.data;
  const instructionSteps = getInstructionSteps(recipe.instructions);
  const favoriteLoading =
    isLoggedIn && (favoritesQuery.isLoading || favoriteMutation.isPending);

  return (
    <div className={styles.recipeContainer}>
      <div className={styles.topSection}>
        <h1 className={styles.title}>{recipe.title}</h1>
        <div className={styles.imgContainer}>
          <Image
            src={recipe.thumb || recipe.photo || '/pg10.png'}
            alt={recipe.title}
            width={704}
            height={624}
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
            <ol className={styles.stepsList}>
              {instructionSteps.map((step, index) => (
                <li className={styles.stepText} key={`${index}-${step}`}>
                  {step}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>
              <h2>General information</h2>
            </div>
            <p>
              <b>Category:</b> {recipe.category?.name || recipe.category}
            </p>
            <p>
              <b>Cooking time:</b> {recipe.time} minutes
            </p>
            <p>
              <b>Calorie content:</b> {recipe.calories || '-'}
            </p>
          </div>

          <button
            type="button"
            className={`${saveStyles.button} ${
              isFavorite ? saveStyles.saved : ''
            }`}
            disabled={favoriteLoading}
            aria-busy={favoriteLoading}
            aria-label={isFavorite ? 'Unsave recipe' : 'Save recipe'}
            onClick={() =>
              isLoggedIn
                ? favoriteMutation.mutate(isFavorite ? 'remove' : 'add')
                : setAuthOpen(true)
            }
          >
            {favoriteLoading ? (
              <>
                <span className={saveStyles.spinner} aria-hidden="true" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <span>{isFavorite ? 'Unsave' : 'Save'}</span>
                {isFavorite ? (
                  <SavedIcon className={saveStyles.icon} />
                ) : (
                  <SaveIcon className={saveStyles.icon} />
                )}
              </>
            )}
          </button>
        </aside>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
