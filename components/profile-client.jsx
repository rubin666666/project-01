'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getProfileRecipes } from '@/lib/queries';
import PrivateGuard from './private-guard';
import Loader from './loader';
import LoadMoreButton from './load-more-button';
import ProfileNavigation from './profile-navigation';
import RecipesList from './recipes-list';
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
  const isInitialLoading = query.isFetching && !query.data;

  return (
    <div className="container">
      <section className="section">
        <ProfileNavigation type={type} />
        {isInitialLoading && <Loader />}
        {query.isError && (
          <div className="statusPage" role="alert">
            <h2>Failed to load your recipes</h2>
            <button type="button" onClick={() => query.refetch()}>
              Try again
            </button>
          </div>
        )}
        {!isInitialLoading && !query.isError && recipes.length === 0 && (
          <div className="emptyState">
            <h2>No recipes yet</h2>
            <p>
              {type === 'own'
                ? 'Publish your first recipe.'
                : 'Save recipes to see them here.'}
            </p>
          </div>
        )}
        {!isInitialLoading && !query.isError && recipes.length > 0 && (
          <RecipesList recipes={recipes} context={type} />
        )}
        {!isInitialLoading && query.hasNextPage && (
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
