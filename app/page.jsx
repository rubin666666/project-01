import HomeClient from '@/components/home-client';
import { createPageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return createPageMetadata({
    title: 'Recipes',
    description: 'Browse and filter the Tasteorama recipe collection.',
    path: '/',
  });
}

export default function HomePage({ searchParams }) {
  return <HomeClient initialParams={searchParams} />;
}
