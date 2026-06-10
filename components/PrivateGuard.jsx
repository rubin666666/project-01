'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Loader from './Loader';

export default function PrivateGuard({ children }) {
  const router = useRouter();
  const { hydrated, isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (hydrated && !isLoggedIn) router.replace('/auth/login');
  }, [hydrated, isLoggedIn, router]);

  if (!hydrated || !isLoggedIn) return <Loader fullPage />;
  return children;
}
