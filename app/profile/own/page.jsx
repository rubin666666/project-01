import ProfileClient from '@/components/profile-client';

export const metadata = { title: 'My recipes' };

export default function OwnRecipesPage() {
  return <ProfileClient type="own" />;
}
