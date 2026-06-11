import ProfileClient from '@/components/profile-client';
import { createPageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return createPageMetadata({
    title: 'Saved recipes',
    description: 'Browse the Tasteorama recipes saved to your favorites.',
    path: '/profile/favorites',
  });
}

export default function FavoriteRecipesPage() {
  return <ProfileClient type="favorites" />;
}
