'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  getCategories,
  getIngredients,
  getProfileRecipes,
} from '@/lib/queries';
import FilterControls from './filter-controls';
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
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const category = params.get('category') || '';
  const ingredient = params.get('ingredient') || '';

  const query = useInfiniteQuery({
    queryKey: ['profile-recipes', type, { category, ingredient }],
    queryFn: ({ pageParam }) =>
      getProfileRecipes(type, pageParam, 12, { category, ingredient }),
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
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  const ingredientsQuery = useQuery({
    queryKey: ['ingredients'],
    queryFn: getIngredients,
  });

  const setFilters = changes => {
    const next = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    const queryString = next.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const recipes = (query.data?.pages || []).flatMap(
    currentPage => currentPage.data || []
  );
  const totalItems = query.data?.pages?.[0]?.totalItems || 0;
  const isInitialLoading = query.isFetching && !query.data;
  const filtersLoading =
    categoriesQuery.isLoading || ingredientsQuery.isLoading;
  const filtersError = categoriesQuery.isError || ingredientsQuery.isError;

  return (
    <div className="container">
      <section className="section">
        <ProfileNavigation type={type} queryString={params.toString()} />
        <div className={pageStyles.filterContainer}>
          <FilterControls
            totalItems={totalItems}
            loading={isInitialLoading}
            category={category}
            ingredient={ingredient}
            categories={(categoriesQuery.data || []).map(item => item.name)}
            ingredients={ingredientsQuery.data || []}
            filtersLoading={filtersLoading}
            onCategoryChange={value => setFilters({ category: value })}
            onIngredientChange={value => setFilters({ ingredient: value })}
            onReset={() => setFilters({ category: '', ingredient: '' })}
          />
        </div>
        {filtersError && (
          <div className="statusPage" role="alert">
            Some filters could not be loaded.
          </div>
        )}
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
