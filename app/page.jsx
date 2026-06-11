import HomeClient from '@/components/home-client';

export const metadata = {
  title: 'Recipes',
  description: 'Browse and filter the Tasteorama recipe collection.',
};

export default function HomePage({ searchParams }) {
  return <HomeClient initialParams={searchParams} />;
}
