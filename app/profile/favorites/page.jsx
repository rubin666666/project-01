import ProfileClient from '@/components/profile-client';

export const metadata = { title: 'Saved recipes' };

export default function FavoriteRecipesPage() {
  return <ProfileClient type="favorites" />;
}
