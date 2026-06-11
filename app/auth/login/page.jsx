import LoginForm from '@/components/login-form';
import { createPageMetadata } from '@/lib/metadata';
import styles from '@/styles/auth-page.module.css';

export function generateMetadata() {
  return createPageMetadata({
    title: 'Log in',
    description: 'Log in to save recipes and manage your Tasteorama profile.',
    path: '/auth/login',
  });
}

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
}
