'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { getCategories, getIngredients, getRecipes } from '@/lib/queries';
import Loader from './loader';
import RecipesList from './recipes-list';
import SearchBox from './search-box';
import LoadMoreButton from './load-more-button';
import FilterControls from './filter-controls';
import styles from '@/styles/main-page.module.css';
import mobileHero from '@/src/assets/img/mob_hero_1x-min.png';
import tabletHero from '@/src/assets/img/tab_hero_1x-min.png';
import desktopHero from '@/src/assets/img/pc_hero_1x-min.png';

export default function HomeClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const search = params.get('search') || '';
  const category = params.get('category') || '';
  const ingredient = params.get('ingredient') || '';
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

  const resetFilters = () => {
    setParams({ category: '', ingredient: '' });
  };

  const resetSearchAndFilters = () => {
    setParams({ search: '', category: '', ingredient: '' });
  };

  const pages = recipeQuery.data?.pages || [];
  const recipes = pages.flatMap(currentPage => currentPage.data || []);
  const totalItems = pages[0]?.totalItems || 0;
  const filtersError = categoriesQuery.isError || ingredientsQuery.isError;
  const isRecipesLoading =
    recipeQuery.isFetching && !recipeQuery.isFetchingNextPage;

  useEffect(() => {
    const notificationKey = `${search}|${category}|${ingredient}`;
    if (
      !recipeQuery.isFetching &&
      !recipeQuery.isError &&
      recipes.length === 0 &&
      search &&
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
        <Image
          src={mobileHero}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`${styles.heroImage} ${styles.mobileHero}`}
        />
        <Image
          src={tabletHero}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`${styles.heroImage} ${styles.tabletHero}`}
        />
        <Image
          src={desktopHero}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`${styles.heroImage} ${styles.desktopHero}`}
        />
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Plan, Cook, and
              <br />
              Share Your Flavors
            </h1>
            <SearchBox
              search={search}
              loading={isRecipesLoading}
              onSearch={value => setParams({ search: value })}
            />
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
            loading={isRecipesLoading}
            category={category}
            ingredient={ingredient}
            categories={(categoriesQuery.data || []).map(item => item.name)}
            ingredients={ingredientsQuery.data || []}
            filtersLoading={
              categoriesQuery.isLoading || ingredientsQuery.isLoading
            }
            onCategoryChange={value => setParams({ category: value })}
            onIngredientChange={value => setParams({ ingredient: value })}
            onReset={resetFilters}
          />
        </div>
        {filtersError && (
          <div className={styles.error} role="alert">
            Some filters could not be loaded. Recipe browsing is still
            available.
          </div>
        )}

        {isRecipesLoading && <Loader />}
        {recipeQuery.isError && (
          <div className={styles.error} role="alert">
            Failed to load recipes. Please try again.
          </div>
        )}
        {!isRecipesLoading &&
        !recipeQuery.isError &&
        recipes.length === 0 ? (
          <div className="emptyState">
            <h3>No recipes found</h3>
            <p>Try changing your search or filters.</p>
            <button type="button" onClick={resetSearchAndFilters}>
              Clear search and filters
            </button>
          </div>
        ) : null}
        {!isRecipesLoading && !recipeQuery.isError && recipes.length > 0 && (
          <RecipesList recipes={recipes} />
        )}

        {!isRecipesLoading && recipeQuery.hasNextPage && (
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
