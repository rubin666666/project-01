import ProfileClient from '@/components/ProfileClient';

export const metadata = { title: 'My recipes' };

export default function OwnRecipesPage() {
  return <ProfileClient type="own" />;
}
