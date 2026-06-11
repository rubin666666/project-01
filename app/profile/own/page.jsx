import ProfileClient from '@/components/profile-client';
import { createPageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return createPageMetadata({
    title: 'My recipes',
    description: 'View and manage the recipes you published on Tasteorama.',
    path: '/profile/own',
  });
}

export default function OwnRecipesPage() {
  return <ProfileClient type="own" />;
}
