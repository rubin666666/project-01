import ProfileClient from '@/components/ProfileClient';

export const metadata = { title: 'Saved recipes' };

export default function FavoriteRecipesPage() {
  return <ProfileClient type="favorites" />;
}
