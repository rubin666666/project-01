'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProfileRecipes } from '@/lib/queries';
import PrivateGuard from './PrivateGuard';
import Loader from './Loader';
import Pagination from './Pagination';
import RecipeCard from './RecipeCard';
import navStyles from '@/src/components/Profile/ProfileNavigation/ProfileNavigation.module.css';
import listStyles from '@/src/components/RecipesList/RecipesList.module.css';

export default function ProfileClient({ type }) {
  return (
    <PrivateGuard>
      <ProfileContent type={type} />
    </PrivateGuard>
  );
}

function ProfileContent({ type }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const query = useQuery({
    queryKey: ['profile-recipes', type, page],
    queryFn: () => getProfileRecipes(type, page),
  });
  const data = query.data;
  const recipes = data?.data || [];
  const totalPages = Math.ceil((data?.totalItems || 0) / 12);

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
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={nextPage =>
              router.push(`/profile/${type}?page=${nextPage}`)
            }
          />
        )}
      </section>
    </div>
  );
}
