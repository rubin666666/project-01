import { redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return createPageMetadata({
    title: 'My profile',
    description: 'Manage your Tasteorama recipes and saved favorites.',
    path: '/profile',
  });
}

export default function ProfilePage() {
  redirect('/profile/own');
}
