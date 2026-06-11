import RegistrationForm from '@/components/registration-form';
import { createPageMetadata } from '@/lib/metadata';
import styles from '@/styles/auth-page.module.css';

export function generateMetadata() {
  return createPageMetadata({
    title: 'Register',
    description: 'Create a Tasteorama account and join the recipe community.',
    path: '/auth/register',
  });
}

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <RegistrationForm />
    </div>
  );
}
