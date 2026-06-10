'use client';

import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { getCategories, getIngredients, getRecipes } from '@/lib/queries';
import Loader from './Loader';
import RecipeCard from './RecipeCard';
import LoadMoreButton from './LoadMoreButton';
import FilterControls from './FilterControls';
import styles from '@/styles/MainPage.module.css';
import listStyles from '@/src/components/RecipesList/RecipesList.module.css';
import searchStyles from '@/src/components/SearchBox/SearchBox.module.css';
import buttonStyles from '@/src/components/Button/Button.module.css';

export default function HomeClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const search = params.get('search') || '';
  const category = params.get('category') || '';
  const ingredient = params.get('ingredient') || '';
  const [query, setQuery] = useState(search);
  const [searchError, setSearchError] = useState('');
  const emptyNotificationKey = useRef('');

  const recipeQuery = useInfiniteQuery({
    queryKey: ['recipes', { search, category, ingredient }],
    queryFn: ({ pageParam }) =>
      getRecipes({ search, category, ingredient, page: pageParam }),
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

  const setParams = changes => {
    const next = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, String(value));
      else next.delete(key);
    });
    const queryString = next.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const submitSearch = event => {
    event.preventDefault();
    const value = query.trim();
    if (value.length < 2) {
      const message = value
        ? 'Enter at least 2 characters'
        : 'Enter a search query';
      setSearchError(message);
      toast.error(message);
      return;
    }
    setSearchError('');
    setParams({ search: value });
  };

  const resetFilters = () => {
    setParams({ category: '', ingredient: '' });
  };

  const resetSearchAndFilters = () => {
    setQuery('');
    setSearchError('');
    setParams({ search: '', category: '', ingredient: '' });
  };

  const pages = recipeQuery.data?.pages || [];
  const recipes = pages.flatMap(currentPage => currentPage.data || []);
  const totalItems = pages[0]?.totalItems || 0;

  useEffect(() => {
    setQuery(search);
  }, [search]);

  useEffect(() => {
    const notificationKey = `${search}|${category}|${ingredient}`;
    if (
      !recipeQuery.isFetching &&
      !recipeQuery.isError &&
      recipes.length === 0 &&
      (search || category || ingredient) &&
      emptyNotificationKey.current !== notificationKey
    ) {
      toast.error('No recipes matched your search');
      emptyNotificationKey.current = notificationKey;
    }
    if (recipes.length > 0) emptyNotificationKey.current = '';
  }, [
    category,
    ingredient,
    recipeQuery.isError,
    recipeQuery.isFetching,
    recipes.length,
    search,
  ]);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Plan, Cook, and
              <br />
              Share Your Flavors
            </h1>
            <div className={searchStyles.searchBoxContainer}>
              <form className={searchStyles.form} onSubmit={submitSearch}>
                <input
                  className={`${searchStyles.input} ${
                    searchError ? searchStyles.inputError : ''
                  }`}
                  value={query}
                  onChange={event => {
                    setQuery(event.target.value);
                    setSearchError('');
                  }}
                  placeholder="Search recipes"
                  aria-invalid={Boolean(searchError)}
                  aria-describedby="search-error"
                />
                <button
                  type="submit"
                  className={`${buttonStyles.baseStyle} ${searchStyles.searchBtn}`}
                >
                  Search
                </button>
              </form>
              {searchError && (
                <span id="search-error" className={searchStyles.error}>
                  {searchError}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.recipesSection} ${styles.container}`}>
        <h2 className={styles.recipesTitle}>
          {search ? `Search Results for "${search}"` : 'Recipes'}
        </h2>
        <div className={styles.filterContainer}>
          <FilterControls
            totalItems={totalItems}
            loading={recipeQuery.isFetching}
            category={category}
            ingredient={ingredient}
            categories={categoriesQuery.data || []}
            ingredients={ingredientsQuery.data || []}
            filtersLoading={
              categoriesQuery.isLoading || ingredientsQuery.isLoading
            }
            onCategoryChange={value => setParams({ category: value })}
            onIngredientChange={value => setParams({ ingredient: value })}
            onReset={resetFilters}
          />
        </div>

        {recipeQuery.isLoading && <Loader />}
        {recipeQuery.isError && (
          <div className={styles.error}>
            Failed to load recipes. Please try again.
          </div>
        )}
        {!recipeQuery.isLoading && !recipeQuery.isError && recipes.length === 0 ? (
          <div className="emptyState">
            <h3>No recipes found</h3>
            <p>Try changing your search or filters.</p>
            <button type="button" onClick={resetSearchAndFilters}>
              Clear search and filters
            </button>
          </div>
        ) : (
          <ul className={listStyles.list}>
            {recipes.map(recipe => (
              <li key={recipe._id} className={listStyles.item}>
                <RecipeCard recipe={recipe} />
              </li>
            ))}
          </ul>
        )}

        {recipeQuery.hasNextPage && (
          <LoadMoreButton
            className={styles.loadMoreBtn}
            loading={recipeQuery.isFetchingNextPage}
            onClick={() => recipeQuery.fetchNextPage()}
          />
        )}
      </section>
    </>
  );
}
