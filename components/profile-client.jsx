'use client';

import Link from 'next/link';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getProfileRecipes } from '@/lib/queries';
import PrivateGuard from './private-guard';
import Loader from './loader';
import LoadMoreButton from './load-more-button';
import RecipeCard from './recipe-card';
import navStyles from '@/src/components/Profile/ProfileNavigation/profilenavigation.module.css';
import listStyles from '@/src/components/RecipesList/recipeslist.module.css';
import pageStyles from '@/styles/main-page.module.css';

export default function ProfileClient({ type }) {
  return (
    <PrivateGuard>
      <ProfileContent type={type} />
    </PrivateGuard>
  );
}

function ProfileContent({ type }) {
  const query = useInfiniteQuery({
    queryKey: ['profile-recipes', type],
    queryFn: ({ pageParam }) => getProfileRecipes(type, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const loadedItems = pages.reduce(
        (total, currentPage) => total + (currentPage.data?.length || 0),
        0
      );
      return loadedItems < (lastPage.totalItems || 0)
        ? pages.length + 1
        : undefined;
    },
  });
  const recipes = (query.data?.pages || []).flatMap(
    currentPage => currentPage.data || []
  );

  return (
    <div className="container">
      <section className="section">
        <div className={navStyles.wrapper}>
          <h1 className={navStyles.title}>My profile</h1>
          <nav className={navStyles.tabs}>
          <Link
            href="/profile/own"
            className={`${navStyles.tab} ${
              type === 'own' ? navStyles.active : ''
            }`}
          >
            My profile
          </Link>
          <Link
            href="/profile/favorites"
            className={`${navStyles.tab} ${
              type === 'favorites' ? navStyles.active : ''
            }`}
          >
            Saved recipes
          </Link>
          </nav>
        </div>
        {query.isLoading && <Loader />}
        {query.isError && (
          <p className={navStyles.message}>Failed to load your recipes.</p>
        )}
        {!query.isLoading && recipes.length === 0 && (
          <div className="emptyState">
            <h2>No recipes yet</h2>
            <p>
              {type === 'own'
                ? 'Publish your first recipe.'
                : 'Save recipes to see them here.'}
            </p>
          </div>
        )}
        <ul className={listStyles.list}>
          {recipes.map(recipe => (
            <li key={recipe._id} className={listStyles.item}>
              <RecipeCard recipe={recipe} context={type} />
            </li>
          ))}
        </ul>
        {query.hasNextPage && (
          <LoadMoreButton
            className={pageStyles.loadMoreBtn}
            loading={query.isFetchingNextPage}
            onClick={() => query.fetchNextPage()}
          />
        )}
      </section>
    </div>
  );
}
