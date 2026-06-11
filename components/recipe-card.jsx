'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { GoClock } from 'react-icons/go';
import toast from 'react-hot-toast';
import SaveIcon from '@/src/assets/icons/save-icon.svg';
import DeleteIcon from '@/src/assets/icons/delete-trash-icon.svg';
import NoPhoto from '@/src/assets/img/no_photo.jpg';
import { api, getErrorMessage } from '@/lib/api';
import { getAllFavoriteRecipes } from '@/lib/queries';
import { useAuthStore } from '@/store/auth';
import AuthModal from './auth-modal';
import Modal from './modal';
import styles from '@/src/components/RecipeCard/recipecard.module.css';
import saveStyles from '@/src/components/SaveRecipeButton/saverecipebutton.module.css';
import deleteStyles from '@/src/components/DeleteRecipeButton/deleterecipebutton.module.css';
import linkStyles from '@/src/components/RecipeLink/recipelink.module.css';

export default function RecipeCard({ recipe, context = 'public' }) {
  const queryClient = useQueryClient();
  const [authOpen, setAuthOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  const favoritesQuery = useQuery({
    queryKey: ['favorite-recipes'],
    queryFn: getAllFavoriteRecipes,
    enabled: isLoggedIn && context === 'public',
  });
  const favorites = favoritesQuery.data || [];
  const isFavorite =
    context === 'favorites' ||
    favorites.some(item => item._id === recipe._id);

  const favoriteMutation = useMutation({
    mutationFn: action =>
      action === 'remove'
        ? api.delete(`/api/recipes/${recipe._id}/favorite`)
        : api.post(`/api/recipes/${recipe._id}/favorite`),
    onSuccess: (_, action) => {
      queryClient.setQueryData(['favorite-recipes'], current => {
        const recipes = current || [];
        return action === 'remove'
          ? recipes.filter(item => item._id !== recipe._id)
          : [...recipes, recipe];
      });
      if (action === 'remove') {
        queryClient.setQueryData(
          ['profile-recipes', 'favorites'],
          current => removeRecipeFromPages(current, recipe._id)
        );
        queryClient.invalidateQueries({
          queryKey: ['profile-recipes', 'favorites'],
        });
      }
      queryClient.invalidateQueries({ queryKey: ['favorite-recipes'] });
      toast.success(action === 'remove' ? 'Recipe removed' : 'Recipe saved');
    },
    onError: error => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/api/recipes/${recipe._id}`),
    onSuccess: () => {
      setDeleteOpen(false);
      queryClient.setQueryData(['profile-recipes', 'own'], current =>
        removeRecipeFromPages(current, recipe._id)
      );
      queryClient.invalidateQueries({
        queryKey: ['profile-recipes', 'own'],
      });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast.success('Recipe deleted');
    },
    onError: error => toast.error(getErrorMessage(error)),
  });

  const toggleFavorite = () => {
    if (!isLoggedIn) {
      setAuthOpen(true);
      return;
    }
    favoriteMutation.mutate(isFavorite ? 'remove' : 'add');
  };

  return (
    <>
      <article className={styles.item}>
        <Image
          src={recipe.thumb || recipe.photo || NoPhoto}
          alt={recipe.title}
          width={337}
          height={230}
          sizes="(min-width: 1440px) 264px, (min-width: 768px) 315px, 337px"
          className={styles.image}
        />
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{recipe.title}</h3>
          <div className={styles.timeCont}>
            <GoClock size={15} />
            <span className={styles.timeTitle}>{recipe.time} min</span>
          </div>
        </div>
        <div className={styles.descriptionContainer}>
          <p className={styles.description}>{recipe.description}</p>
          <p className={styles.calories}>
            {recipe.calories ? `~${recipe.calories} cals` : '-'}
          </p>
        </div>
        <div className={styles.buttonContainer}>
          <Link href={`/recipes/${recipe._id}`} className={linkStyles.button}>
            Learn more
          </Link>
          {context === 'own' ? (
            <button
              type="button"
              className={deleteStyles.deleteBtn}
              onClick={() => setDeleteOpen(true)}
              aria-label="Delete recipe"
            >
              <DeleteIcon />
            </button>
          ) : (
            <button
              type="button"
              className={`${saveStyles.iconBtn} ${
                isFavorite ? saveStyles.saved : ''
              }`}
              onClick={toggleFavorite}
              disabled={favoriteMutation.isPending}
              aria-busy={favoriteMutation.isPending}
              aria-label={isFavorite ? 'Remove from saved' : 'Save recipe'}
            >
              {favoriteMutation.isPending ? (
                <span className={saveStyles.spinner} aria-hidden="true" />
              ) : (
                <SaveIcon className={saveStyles.icon} />
              )}
            </button>
          )}
        </div>
      </article>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <Modal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete recipe?"
        message="This action cannot be undone."
        actions={[
          {
            text: deleteMutation.isPending ? 'Deleting...' : 'Delete',
            onClick: () => deleteMutation.mutate(),
            disabled: deleteMutation.isPending,
          },
          {
            text: 'Cancel',
            type: 'secondary',
            onClick: () => setDeleteOpen(false),
          },
        ]}
      />
    </>
  );
}

function removeRecipeFromPages(current, recipeId) {
  if (!current?.pages) return current;

  return {
    ...current,
    pages: current.pages.map(page => ({
      ...page,
      data: (page.data || []).filter(item => item._id !== recipeId),
      totalItems: Math.max((page.totalItems || 0) - 1, 0),
    })),
  };
}
